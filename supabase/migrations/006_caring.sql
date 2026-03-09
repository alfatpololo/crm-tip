-- Tabel caring: hasil caring call per PIC Sales. Staff input, koordinator hanya lihat.
create table if not exists public.caring (
  id uuid primary key default gen_random_uuid(),
  pic_sales text not null,
  nama_toko text not null,
  pic_toko text,
  tanggal_call date not null,
  status_call text,
  hasil text,
  next_action text,
  tanggal_fu date,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_caring_pic_sales on public.caring(pic_sales);
create index if not exists idx_caring_tanggal_call on public.caring(tanggal_call desc);

alter table public.caring enable row level security;

create policy "Authenticated read caring"
  on public.caring for select to authenticated
  using (true);

create policy "Authenticated insert caring"
  on public.caring for insert to authenticated
  with check (true);

notify pgrst, 'reload schema';
