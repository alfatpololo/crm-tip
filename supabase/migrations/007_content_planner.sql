-- Tabel content_planner: rencana posting konten. Semua role bisa baca/tambah (koordinator & staff).
create table if not exists public.content_planner (
  id uuid primary key default gen_random_uuid(),
  nama_aplikasi text not null,
  rencana_posting date not null,
  status text not null default 'concept',
  pic text not null,
  topic text,
  goals_content text,
  content_pillar text,
  type_of_content text,
  reference_file_name text,
  link text,
  caption text,
  revisi text,
  acc_to_posting boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_content_planner_rencana_posting on public.content_planner(rencana_posting desc);
create index if not exists idx_content_planner_pic on public.content_planner(pic);

alter table public.content_planner enable row level security;

create policy "Authenticated read content_planner"
  on public.content_planner for select to authenticated
  using (true);

create policy "Authenticated insert content_planner"
  on public.content_planner for insert to authenticated
  with check (true);

notify pgrst, 'reload schema';
