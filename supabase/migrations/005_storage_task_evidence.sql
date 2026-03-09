-- Bucket untuk bukti tugas (file upload).
-- Jika migration gagal (permission), buat manual di Dashboard: Storage → New bucket → id: task-evidence, Public: on.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'task-evidence',
  'task-evidence',
  true,
  10485760,
  array['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/heic','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policy: authenticated boleh upload & baca (akses task tetap dicek di API)
create policy "Authenticated can upload task evidence"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'task-evidence');

create policy "Authenticated can read task evidence"
  on storage.objects for select to authenticated
  using (bucket_id = 'task-evidence');

notify pgrst, 'reload schema';
