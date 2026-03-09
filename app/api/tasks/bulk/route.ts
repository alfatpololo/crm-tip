import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type TaskRow = {
  id: string;
  title: string;
  lead_company: string | null;
  product: string;
  aktivitas: string;
  aktivitas_label: string | null;
  pic: string;
  due_date: string;
  priority: string;
  status: string;
  catatan: string | null;
  lead_id: number | null;
  created_at: string;
  created_by: string | null;
  target_value: number | null;
  satuan: string | null;
};

function recordToInsertRow(rec: Record<string, unknown>) {
  return {
    title: rec.title,
    lead_company: rec.leadCompany ?? null,
    product: rec.product ?? 'MKASIR',
    aktivitas: rec.aktivitas ?? 'digital',
    aktivitas_label: rec.aktivitasLabel ?? rec.aktivitas ?? null,
    pic: rec.pic,
    due_date: rec.dueDate,
    priority: rec.priority ?? 'sedang',
    status: rec.status ?? 'pending',
    catatan: rec.catatan ?? null,
    lead_id: rec.leadId ?? null,
    created_by: rec.createdBy ?? null,
    target_value: rec.targetValue != null ? Number(rec.targetValue) : null,
    satuan: rec.satuan ?? null,
    progress_realisasi: rec.progressRealisasi != null ? Number(rec.progressRealisasi) : null,
    progress_note: rec.progressNote ?? null,
  };
}

async function getCaller(req: NextRequest): Promise<{ id: string; email: string; role: string } | null> {
  const auth = req.headers.get('authorization')?.replace(/Bearer\s+/i, '');
  if (!auth) return null;
  const supabase = createClient(url, anonKey);
  const { data: { user } } = await supabase.auth.getUser(auth);
  if (!user?.email) return null;
  const email = user.email.toLowerCase();
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  const role = email === SUPERADMIN_EMAIL ? 'superadmin' : (profile?.role ?? 'staff');
  return { id: user.id, email, role };
}

export async function POST(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const isCoordinator = caller.role === 'koordinator' || caller.role === 'management';
  if (!isCoordinator) {
    return NextResponse.json({ error: 'Hanya koordinator yang boleh import tugas' }, { status: 403 });
  }
  let body: { tasks?: Record<string, unknown>[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const tasks = Array.isArray(body.tasks) ? body.tasks : [];
  if (tasks.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data tugas untuk di-import' }, { status: 400 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const rows = tasks.map((t) => recordToInsertRow({ ...t, createdBy: caller.id }));
  const { data, error } = await admin.from('tasks').insert(rows).select('id');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ imported: (data ?? []).length });
}
