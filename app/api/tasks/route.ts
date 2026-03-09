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

/** Hanya kolom yang dipakai saat INSERT (tidak termasuk evidence/approved agar tetap jalan kalau migration 004 belum dijalankan). */
function recordToInsertRow(rec: Record<string, unknown>) {
  return {
    title: rec.title,
    lead_company: rec.leadCompany ?? null,
    product: rec.product ?? 'MKASIR',
    aktivitas: rec.aktivitas,
    aktivitas_label: rec.aktivitasLabel ?? rec.aktivitas,
    pic: rec.pic,
    due_date: rec.dueDate,
    priority: rec.priority ?? 'sedang',
    status: rec.status ?? 'pending',
    catatan: rec.catatan ?? null,
    lead_id: rec.leadId ?? null,
    created_by: rec.createdBy ?? null,
    target_value: rec.targetValue != null ? rec.targetValue : null,
    satuan: rec.satuan ?? null,
    progress_realisasi: rec.progressRealisasi != null ? rec.progressRealisasi : null,
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

function displayNameFromEmail(email: string): string {
  const local = (email || '').split('@')[0] || '';
  return local ? local.charAt(0).toUpperCase() + local.slice(1).toLowerCase() : email;
}

export async function GET(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const isCoordinator = caller.role === 'koordinator' || caller.role === 'management';
  let query = admin.from('tasks').select('*').order('created_at', { ascending: false });
  if (!isCoordinator) {
    const myName = displayNameFromEmail(caller.email);
    query = query.ilike('pic', myName);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message, tasks: [] }, { status: 200 });
  }
  const tasks = (data ?? []).map((r: TaskRow) => rowToRecord(r));
  return NextResponse.json({ tasks });
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
    return NextResponse.json({ error: 'Hanya koordinator yang boleh menambah tugas' }, { status: 403 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const row = recordToInsertRow({ ...body, createdBy: caller.id });
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('tasks').insert(row).select('*').single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ task: rowToRecord(data as TaskRow) });
}

export async function PATCH(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: {
    id?: string;
    status?: string;
    progressRealisasi?: number;
    progressNote?: string;
    evidenceLinks?: string[];
    evidenceNote?: string;
    approvedAt?: string;
    approvedBy?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return NextResponse.json({ error: 'id wajib' }, { status: 400 });
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: existing, error: fetchErr } = await admin.from('tasks').select('*').eq('id', id).single();
  if (fetchErr || !existing) {
    return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
  }
  const isCoordinator = caller.role === 'koordinator' || caller.role === 'management';
  const myName = displayNameFromEmail(caller.email);
  const isMine = (existing.pic || '').trim().toLowerCase() === myName.toLowerCase();
  if (!isCoordinator && !isMine) {
    return NextResponse.json({ error: 'Hanya boleh update tugas yang ditugaskan ke Anda' }, { status: 403 });
  }
  const updates: Partial<TaskRow> = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.progressRealisasi !== undefined) updates.progress_realisasi = body.progressRealisasi;
  if (body.progressNote !== undefined) updates.progress_note = body.progressNote;
  if (body.evidenceLinks !== undefined) updates.evidence_links = Array.isArray(body.evidenceLinks) ? body.evidenceLinks : [];
  if (body.evidenceNote !== undefined) updates.evidence_note = body.evidenceNote;
  if (isCoordinator) {
    if (body.approvedAt !== undefined) updates.approved_at = body.approvedAt;
    if (body.approvedBy !== undefined) updates.approved_by = body.approvedBy;
  }
  const { data: updated, error: updateErr } = await admin.from('tasks').update(updates).eq('id', id).select('*').single();
  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }
  return NextResponse.json({ task: rowToRecord(updated as TaskRow) });
}
