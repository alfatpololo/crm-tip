-- Bukti tugas (staff) dan checklist approval (koordinator)
alter table public.tasks
  add column if not exists evidence_links jsonb default '[]'::jsonb,
  add column if not exists evidence_note text,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id) on delete set null;

notify pgrst, 'reload schema';
