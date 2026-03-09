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
  progress_realisasi: number | null;
  progress_note: string | null;
  evidence_links?: unknown;
  evidence_note?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
};

function rowToRecord(r: TaskRow) {
  const links = r.evidence_links;
  const evidenceLinks = Array.isArray(links) ? links.filter((x): x is string => typeof x === 'string') : [];
  return {
    id: r.id,
    title: r.title,
    leadCompany: r.lead_company ?? undefined,
    product: r.product,
    aktivitas: r.aktivitas,
    aktivitasLabel: r.aktivitas_label ?? r.aktivitas,
    pic: r.pic,
    dueDate: r.due_date,
    priority: r.priority,
    status: r.status,
    catatan: r.catatan ?? undefined,
    leadId: r.lead_id ?? undefined,
    createdAt: r.created_at,
    createdBy: r.created_by ?? undefined,
    targetValue: r.target_value != null ? Number(r.target_value) : undefined,
    satuan: r.satuan ?? undefined,
    progressRealisasi: r.progress_realisasi != null ? Number(r.progress_realisasi) : undefined,
    progressNote: r.progress_note ?? undefined,
    evidenceLinks,
    evidenceNote: r.evidence_note ?? undefined,
    approvedAt: r.approved_at ?? undefined,
    approvedBy: r.approved_by ?? undefined,
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

function displayNameFromEmail(email: string): string {
  const local = (email || '').split('@')[0] || '';
  return local ? local.charAt(0).toUpperCase() + local.slice(1).toLowerCase() : email;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'ID tugas wajib' }, { status: 400 });
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('tasks').select('*').eq('id', id).single();
  if (error || !data) {
    return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
  }
  const isCoordinator = caller.role === 'koordinator' || caller.role === 'management';
  const myName = displayNameFromEmail(caller.email);
  const isMine = ((data as TaskRow).pic || '').trim().toLowerCase() === myName.toLowerCase();
  if (!isCoordinator && !isMine) {
    return NextResponse.json({ error: 'Anda tidak punya akses ke tugas ini' }, { status: 403 });
  }
  return NextResponse.json({ task: rowToRecord(data as TaskRow) });
}
