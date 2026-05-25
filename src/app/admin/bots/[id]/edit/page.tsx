import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BotBriefRow, BriefAssetRow, BriefDraftInput } from '@/lib/bots/schema';
import { BriefWizard, UploadedAsset, WizardState } from '../../new/page';

export const dynamic = 'force-dynamic';

export default async function EditBriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: brief } = await supabase
    .schema('bots')
    .from('briefs')
    .select('*')
    .eq('id', id)
    .single<BotBriefRow>();

  if (!brief) notFound();

  // Editing is only meaningful while the brief is still a draft. For other
  // statuses (submitted/building/live/archived), redirect back to detail view.
  if (brief.status !== 'draft') {
    redirect(`/admin/bots/${id}`);
  }

  const { data: assetRows } = await supabase
    .schema('bots')
    .from('brief_assets')
    .select('*')
    .eq('brief_id', id)
    .order('created_at', { ascending: true });

  const initialAssets: UploadedAsset[] = ((assetRows ?? []) as BriefAssetRow[]).map((a) => ({
    id: a.id,
    filename: a.filename,
    storage_path: a.storage_path,
  }));

  const initialState: WizardState = {
    title: brief.title,
    type: brief.type,
    post_scope: brief.post_scope,
    post_url: brief.post_url,
    keyword_triggers: brief.keyword_triggers ?? [],
    story_label: brief.story_label,
    dm_message: brief.dm_message ?? '',
    cta_button_text: brief.cta_button_text,
    lead_magnet_url: brief.lead_magnet_url,
    followup_dm_message: brief.followup_dm_message,
    followup_dm_delay_minutes: brief.followup_dm_delay_minutes,
    brevo_template_id: brief.brevo_template_id,
    followup_delay_hours: brief.followup_delay_hours,
    followup_enabled: brief.followup_enabled,
    notes: brief.notes,
  } satisfies BriefDraftInput;

  return (
    <BriefWizard
      initialBriefId={brief.id}
      initialState={initialState}
      initialAssets={initialAssets}
      mode="edit"
    />
  );
}
