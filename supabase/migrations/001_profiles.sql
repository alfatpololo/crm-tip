-- Tabel profiles: simpan role per user (id = auth.users.id)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'staff',
  updated_at timestamptz default now()
);

-- Indeks untuk role (opsional)
create index if not exists idx_profiles_role on public.profiles(role);

-- RLS: user boleh baca profil sendiri (untuk AuthContext). Service_role (API) bypass RLS.
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Reload schema cache Supabase (penting agar tabel keluar di API)
notify pgrst, 'reload schema';
