-- Header image generation for newsletter drafts.
-- Per-draft AI-generated landscape image rendered between header banner and body.

alter table newsletter.email_drafts
  add column if not exists header_image_url      text,
  add column if not exists header_image_prompt   text,
  add column if not exists header_image_provider text;

-- Public bucket for newsletter header images. Public read so Brevo + email
-- clients can fetch without auth; writes are service-role only via API routes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'newsletter-images',
  'newsletter-images',
  true,
  10 * 1024 * 1024,
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'newsletter_images_public_read'
  ) then
    create policy newsletter_images_public_read
      on storage.objects for select
      using (bucket_id = 'newsletter-images');
  end if;
end$$;
