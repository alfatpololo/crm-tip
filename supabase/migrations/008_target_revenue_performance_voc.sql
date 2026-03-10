-- Target Revenue: per tahun per produk (MKASIR F&B, Persewaan, Retail, DISIPLINKU)
create table if not exists public.target_revenue (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  product_key text not null,
  target_value numeric not null default 0,
  created_at timestamptz not null default now(),
  unique(year, product_key)
);

create index if not exists idx_target_revenue_year on public.target_revenue(year);

-- Performance Customer: per bulan per week (1-4), target + realisasi
create table if not exists public.performance_customer (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null,
  week int not null,
  target numeric,
  total_customer int,
  new_customer int,
  repeat_customer int,
  churn_customer int,
  created_at timestamptz not null default now(),
  unique(year, month, week)
);

create index if not exists idx_performance_customer_ym on public.performance_customer(year, month);

-- Voice of Customer
create table if not exists public.voice_of_customer (
  id uuid primary key default gen_random_uuid(),
  tanggal_complain date not null,
  channel text,
  no_telp_username text,
  nama_usaha text,
  detail_complain text,
  kategori text,
  temuan_masalah text,
  tindak_lanjut text,
  pic text,
  solved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_voice_of_customer_tanggal on public.voice_of_customer(tanggal_complain desc);

alter table public.target_revenue enable row level security;
alter table public.performance_customer enable row level security;
alter table public.voice_of_customer enable row level security;

create policy "Authenticated read target_revenue" on public.target_revenue for select to authenticated using (true);
create policy "Authenticated insert target_revenue" on public.target_revenue for insert to authenticated with check (true);
create policy "Authenticated update target_revenue" on public.target_revenue for update to authenticated using (true);

create policy "Authenticated read performance_customer" on public.performance_customer for select to authenticated using (true);
create policy "Authenticated insert performance_customer" on public.performance_customer for insert to authenticated with check (true);
create policy "Authenticated update performance_customer" on public.performance_customer for update to authenticated using (true);

create policy "Authenticated read voice_of_customer" on public.voice_of_customer for select to authenticated using (true);
create policy "Authenticated insert voice_of_customer" on public.voice_of_customer for insert to authenticated with check (true);
create policy "Authenticated update voice_of_customer" on public.voice_of_customer for update to authenticated using (true);

notify pgrst, 'reload schema';
