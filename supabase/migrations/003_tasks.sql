-- Tabel tasks: tugas yang koordinator assign ke PIC (staff). Dibaca/ditulis via API (service role).
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  lead_company text,
  product text not null default 'MKASIR',
  aktivitas text not null,
  aktivitas_label text,
  pic text not null,
  due_date date not null,
  priority text not null default 'sedang',
  status text not null default 'pending',
  catatan text,
  lead_id integer,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  target_value numeric,
  satuan text,
  progress_realisasi numeric,
  progress_note text
);

create index if not exists idx_tasks_pic on public.tasks(pic);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_created_at on public.tasks(created_at desc);

alter table public.tasks enable row level security;

-- Baca: semua user terauth bisa baca (filter di API by role: coordinator semua, staff hanya punya dia)
create policy "Authenticated read tasks"
  on public.tasks for select
  using (auth.role() = 'authenticated');

-- Insert: hanya koordinator/manajement (dicek di API)
create policy "Authenticated insert tasks"
  on public.tasks for insert
  with check (auth.role() = 'authenticated');

-- Update: semua authenticated (API akan cek ownership/role)
create policy "Authenticated update tasks"
  on public.tasks for update
  using (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
