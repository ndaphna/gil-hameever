-- Allow brief creator to delete their own drafts.
-- Previously only admins could delete; this empowers Inbal to clean up her
-- own drafts from the list page without admin intervention.

drop policy if exists briefs_delete_admin on bots.briefs;

create policy briefs_delete_own_draft_or_admin on bots.briefs
  for delete using (
    newsletter.has_role('admin')
    or (created_by = auth.uid() and status = 'draft')
  );
