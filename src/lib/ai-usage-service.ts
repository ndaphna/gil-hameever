/**
 * AI Usage Service — wallet-aware credit billing.
 *
 * Single entry point for every AI call that should be metered. Responsibilities:
 *   1. Resolve the action's wallet (chat | analysis | platform) and credit cost.
 *   2. Verify the user has enough credits in that wallet (platform actions skip).
 *   3. Call the provider (Anthropic or OpenAI).
 *   4. Deduct credits from the correct wallet column.
 *   5. Record raw token usage + real USD cost in `token_ledger` for margin audit.
 *   6. Return a transparency message plus the post-deduction balance.
 *
 * Charging model: fixed credits per action (set in token-engine ACTION_CONFIG),
 * not multiplier-on-tokens. The USD cost is tracked separately so we can spot
 * margin regressions when prompts grow or models change.
 */

import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from './supabase-server';
import {
  TOKEN_ACTION_TYPES,
  type TokenActionType,
  type Wallet,
  type AnthropicModelId,
  type OpenAIModelId,
  ACTION_CONFIG,
  walletForAction,
  creditsForAction,
  computeAnthropicCostUSD,
  computeOpenAICostUSD,
  usdToMicros,
  formatDeductionMessage,
  getWalletWarningMessage,
} from '@/config/token-engine';

// ── shared response shape ─────────────────────────────────────────────────
export interface AIResponse {
  success: boolean;
  response?: string;
  data?: unknown;
  /** Raw provider usage (informational, for logs/UI). */
  usage?: {
    totalTokens: number;
    promptTokens?: number;
    completionTokens?: number;
    model?: string;
  };
  /** Credits removed from the wallet that was charged (0 for platform). */
  creditsDeducted: number;
  /** Post-deduction balance of the wallet that was charged. */
  creditsRemaining: number;
  /** Which wallet was charged. */
  wallet: Wallet;
  /** Hebrew transparency line for the user. Empty for platform calls. */
  transparencyMessage: string;
  /** Low-balance warning if applicable. */
  warningMessage?: string;
  error?: string;
}

// ── wallet helpers ────────────────────────────────────────────────────────

const WALLET_COLUMN: Record<Wallet, 'chat_credits' | 'analysis_credits' | null> = {
  chat: 'chat_credits',
  analysis: 'analysis_credits',
  platform: null,
};

async function readWalletBalance(userId: string, wallet: Wallet): Promise<number> {
  const column = WALLET_COLUMN[wallet];
  if (!column) return Number.POSITIVE_INFINITY; // platform — never gated by user wallet
  const { data } = await supabaseAdmin
    .from('user_profile')
    .select(column)
    .eq('id', userId)
    .single();
  // Supabase typing for dynamic columns is loose — narrow at the boundary.
  const raw = (data as Record<string, unknown> | null)?.[column];
  return typeof raw === 'number' ? raw : 0;
}

async function deductCredits(
  userId: string,
  wallet: Wallet,
  credits: number,
): Promise<{ ok: boolean; before: number; after: number }> {
  const column = WALLET_COLUMN[wallet];
  if (!column || credits === 0) {
    // Platform / zero-cost action: read for telemetry, no write.
    const before = await readWalletBalance(userId, wallet);
    return { ok: true, before, after: before };
  }

  const before = await readWalletBalance(userId, wallet);
  if (before < credits) {
    return { ok: false, before, after: before };
  }
  const after = Math.max(0, before - credits);

  const { error } = await supabaseAdmin
    .from('user_profile')
    .update({ [column]: after })
    .eq('id', userId);

  if (error) {
    console.error('❌ Wallet deduction failed:', error);
    throw new Error(`Failed to deduct credits from ${wallet} wallet`);
  }
  return { ok: true, before, after };
}

// ── ledger ───────────────────────────────────────────────────────────────

interface LedgerEntry {
  userId: string;
  action: TokenActionType;
  wallet: Wallet;
  credits: number;
  before: number;
  after: number;
  provider: 'anthropic' | 'openai';
  model: string;
  rawInputTokens: number;
  rawOutputTokens: number;
  costUSD: number;
  description?: string;
  metadata?: Record<string, unknown>;
}

async function writeLedgerEntry(entry: LedgerEntry): Promise<void> {
  try {
    await supabaseAdmin.from('token_ledger').insert({
      user_id: entry.userId,
      action_type: entry.action,
      wallet: entry.wallet,
      credits_deducted: entry.credits,
      cost_usd_micros: usdToMicros(entry.costUSD),
      provider: entry.provider,
      model: entry.model,
      openai_tokens: entry.rawInputTokens + entry.rawOutputTokens,
      tokens_deducted: entry.credits,
      tokens_before: entry.before,
      tokens_after: entry.after,
      metadata: {
        ...(entry.metadata ?? {}),
        input_tokens: entry.rawInputTokens,
        output_tokens: entry.rawOutputTokens,
      },
      tokens_used: entry.rawInputTokens + entry.rawOutputTokens,
      tokens_remaining: entry.after,
      description: entry.description ?? entry.action,
    });
  } catch (err) {
    // Logging failures must never break the user-facing call.
    console.error('❌ Ledger write failed:', err);
  }
}

// ── balance check (pre-call) ──────────────────────────────────────────────

export async function checkTokenBalance(
  userId: string,
  action: TokenActionType,
): Promise<{
  hasEnough: boolean;
  balance: number;
  wallet: Wallet;
  needed: number;
  warningMessage?: string;
}> {
  const wallet = walletForAction(action);
  const needed = creditsForAction(action);
  const balance = await readWalletBalance(userId, wallet);
  const warning = wallet === 'platform' ? null : getWalletWarningMessage(wallet, balance);
  return {
    hasEnough: wallet === 'platform' || needed === 0 || balance >= needed,
    balance,
    wallet,
    needed,
    warningMessage: warning ?? undefined,
  };
}

// ── Anthropic (primary path) ──────────────────────────────────────────────

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

export interface ClaudeRequest {
  userId: string;
  actionType: TokenActionType;
  /** Dynamic system text (changes per turn — user context, recent insights). */
  systemPrompt: string;
  /**
   * Static system blocks marked with cache_control: ephemeral. Place identity,
   * hard rules, style_guide content_md, resources catalog here. Cached blocks
   * cost 10% of input rate on hit (5min TTL), 25% extra on miss.
   */
  cachedSystemBlocks?: string[];
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  model: AnthropicModelId;
  maxTokens?: number;
  temperature?: number;
  /** Enable Claude adaptive thinking (opus only, recommended for expert mode). */
  thinking?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}

export async function executeClaudeRequest(request: ClaudeRequest): Promise<AIResponse> {
  const {
    userId,
    actionType,
    systemPrompt,
    cachedSystemBlocks = [],
    messages,
    model,
    maxTokens = 1024,
    temperature = 0.7,
    thinking = false,
    description,
    metadata,
  } = request;

  const wallet = walletForAction(actionType);
  const credits = creditsForAction(actionType);

  try {
    console.log(`🤖 Claude ${actionType} (${model}) wallet=${wallet} credits=${credits} user=${userId}`);

    const pre = await checkTokenBalance(userId, actionType);
    if (!pre.hasEnough) {
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: pre.balance,
        wallet,
        transparencyMessage: `אין מספיק יתרה ב${wallet === 'chat' ? 'שיחות' : 'ניתוחים'}.`,
        warningMessage: pre.warningMessage,
        error: 'Insufficient credits',
      };
    }

    const client = getAnthropic();
    const systemField: Anthropic.MessageCreateParams['system'] = cachedSystemBlocks.length > 0
      ? [
          ...cachedSystemBlocks.map(text => ({
            type: 'text' as const,
            text,
            cache_control: { type: 'ephemeral' as const },
          })),
          { type: 'text' as const, text: systemPrompt },
        ]
      : systemPrompt;

    const callOptions: Anthropic.MessageCreateParams = {
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemField,
      messages,
    };
    if (thinking) {
      (callOptions as unknown as Record<string, unknown>).thinking = { type: 'adaptive' };
      (callOptions as unknown as Record<string, unknown>).output_config = { effort: 'high' };
    }

    let response: Anthropic.Message;
    try {
      response = await client.messages.create(callOptions);
    } catch (err) {
      const errMsg = err instanceof Anthropic.APIError ? `${err.status}: ${err.message}` : String(err);
      console.error('❌ Anthropic API error:', errMsg);
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: pre.balance,
        wallet,
        transparencyMessage: 'הייתה בעיה בשליחת הבקשה ל-AI.',
        error: errMsg,
      };
    }

    const textContent = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('\n\n')
      .trim();

    const inputTokens   = response.usage.input_tokens ?? 0;
    const cacheCreation = (response.usage as { cache_creation_input_tokens?: number }).cache_creation_input_tokens ?? 0;
    const cacheRead     = (response.usage as { cache_read_input_tokens?: number }).cache_read_input_tokens ?? 0;
    const outputTokens  = response.usage.output_tokens ?? 0;

    const costUSD = computeAnthropicCostUSD(model, {
      input_tokens: inputTokens,
      cache_creation_input_tokens: cacheCreation,
      cache_read_input_tokens: cacheRead,
      output_tokens: outputTokens,
    });

    const deduction = await deductCredits(userId, wallet, credits);
    if (!deduction.ok) {
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: deduction.before,
        wallet,
        transparencyMessage: 'אין מספיק יתרה לביצוע הפעולה.',
        error: 'Insufficient credits',
      };
    }

    await writeLedgerEntry({
      userId,
      action: actionType,
      wallet,
      credits,
      before: deduction.before,
      after: deduction.after,
      provider: 'anthropic',
      model,
      rawInputTokens: inputTokens + cacheCreation + cacheRead,
      rawOutputTokens: outputTokens,
      costUSD,
      description,
      metadata: {
        ...(metadata ?? {}),
        cache_creation_input_tokens: cacheCreation,
        cache_read_input_tokens: cacheRead,
        cache_hit_ratio: (cacheRead + cacheCreation + inputTokens) > 0
          ? Number((cacheRead / (cacheRead + cacheCreation + inputTokens)).toFixed(3))
          : 0,
      },
    });

    return {
      success: true,
      response: textContent,
      usage: {
        totalTokens: inputTokens + cacheCreation + cacheRead + outputTokens,
        promptTokens: inputTokens + cacheCreation + cacheRead,
        completionTokens: outputTokens,
        model,
      },
      creditsDeducted: credits,
      creditsRemaining: deduction.after,
      wallet,
      transparencyMessage: formatDeductionMessage(credits, deduction.after, actionType),
      warningMessage: getWalletWarningMessage(wallet, deduction.after) ?? undefined,
    };
  } catch (err) {
    console.error('❌ Claude request failed:', err);
    // Don't trust 0 here — read live balance so the client doesn't render
    // a misleading "out of credits" state from a transient failure.
    const safeRemaining = await readWalletBalance(userId, wallet).catch(() => 0);
    return {
      success: false,
      creditsDeducted: 0,
      creditsRemaining: safeRemaining,
      wallet,
      transparencyMessage: 'אירעה שגיאה בביצוע הבקשה.',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ── OpenAI (legacy path, still used by analysis endpoints) ────────────────

export interface AIRequest {
  userId: string;
  actionType: TokenActionType;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  model?: OpenAIModelId;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: { type: 'json_object' } | { type: 'text' };
  description?: string;
  metadata?: Record<string, unknown>;
}

export async function executeAIRequest(request: AIRequest): Promise<AIResponse> {
  const {
    userId,
    actionType,
    messages,
    model = 'gpt-4o',
    maxTokens = 2000,
    temperature = 0.7,
    responseFormat,
    description,
    metadata,
  } = request;

  const wallet = walletForAction(actionType);
  const credits = creditsForAction(actionType);

  try {
    console.log(`🤖 OpenAI ${actionType} (${model}) wallet=${wallet} credits=${credits} user=${userId}`);

    const pre = await checkTokenBalance(userId, actionType);
    if (!pre.hasEnough) {
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: pre.balance,
        wallet,
        transparencyMessage: `אין מספיק יתרה ב${wallet === 'chat' ? 'שיחות' : 'ניתוחים'}.`,
        warningMessage: pre.warningMessage,
        error: 'Insufficient credits',
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'dummy-key') {
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: pre.balance,
        wallet,
        transparencyMessage: 'מפתח OpenAI לא מוגדר.',
        error: 'OPENAI_API_KEY missing',
      };
    }

    const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens, temperature };
    if (responseFormat) body.response_format = responseFormat;

    const httpRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!httpRes.ok) {
      const errText = await httpRes.text();
      console.error('OpenAI API error:', errText);
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: pre.balance,
        wallet,
        transparencyMessage: 'הייתה בעיה בשליחת הבקשה ל-AI.',
        error: `OpenAI API error: ${httpRes.status}`,
      };
    }

    const data = await httpRes.json();
    const responseText: string = data.choices?.[0]?.message?.content ?? '';
    const promptTokens: number = data.usage?.prompt_tokens ?? 0;
    const completionTokens: number = data.usage?.completion_tokens ?? 0;

    const costUSD = computeOpenAICostUSD(model, {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
    });

    const deduction = await deductCredits(userId, wallet, credits);
    if (!deduction.ok) {
      return {
        success: false,
        creditsDeducted: 0,
        creditsRemaining: deduction.before,
        wallet,
        transparencyMessage: 'אין מספיק יתרה לביצוע הפעולה.',
        error: 'Insufficient credits',
      };
    }

    await writeLedgerEntry({
      userId,
      action: actionType,
      wallet,
      credits,
      before: deduction.before,
      after: deduction.after,
      provider: 'openai',
      model,
      rawInputTokens: promptTokens,
      rawOutputTokens: completionTokens,
      costUSD,
      description,
      metadata: metadata ?? {},
    });

    let parsedData: unknown = undefined;
    if (responseFormat?.type === 'json_object' && responseText) {
      try {
        parsedData = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse JSON response:', err);
      }
    }

    return {
      success: true,
      response: responseText,
      data: parsedData,
      usage: {
        totalTokens: promptTokens + completionTokens,
        promptTokens,
        completionTokens,
        model,
      },
      creditsDeducted: credits,
      creditsRemaining: deduction.after,
      wallet,
      transparencyMessage: formatDeductionMessage(credits, deduction.after, actionType),
      warningMessage: getWalletWarningMessage(wallet, deduction.after) ?? undefined,
    };
  } catch (err) {
    console.error('❌ AI request failed:', err);
    const safeRemaining = await readWalletBalance(userId, wallet).catch(() => 0);
    return {
      success: false,
      creditsDeducted: 0,
      creditsRemaining: safeRemaining,
      wallet,
      transparencyMessage: 'אירעה שגיאה בביצוע הבקשה.',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ── audit endpoints (used by admin dashboards) ────────────────────────────

export async function getTokenHistory(
  userId: string,
  limit = 50,
  offset = 0,
): Promise<{ success: boolean; history?: unknown[]; total?: number; error?: string }> {
  try {
    const { data, error, count } = await supabaseAdmin
      .from('token_ledger')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) return { success: false, error: error.message };
    return { success: true, history: data ?? [], total: count ?? 0 };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getTokenUsageSummary(
  userId: string,
): Promise<{ success: boolean; summary?: unknown; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('token_usage_summary')
      .select('*')
      .eq('user_id', userId);
    if (error) return { success: false, error: error.message };
    return { success: true, summary: data ?? [] };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Re-export the action constants so callers keep a single import.
export { TOKEN_ACTION_TYPES, ACTION_CONFIG };
export type { TokenActionType, Wallet };
