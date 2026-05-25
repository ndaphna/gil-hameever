/**
 * Public list of Aliza-recommendable resources.
 * Read-only, RLS-public-read. Used by the chat UI to resolve [RESOURCE:slug]
 * markers into ResourceCard metadata client-side.
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .schema('newsletter')
    .from('aliza_resources')
    .select('slug, url, hebrew_title, short_desc, format, gated, priority')
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { resources: data ?? [] },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' } },
  );
}
