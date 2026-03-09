import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getCaller(req: NextRequest): Promise<{ id: string } | null> {
  const auth = req.headers.get('authorization')?.replace(/Bearer\s+/i, '');
  if (!auth) return null;
  const supabase = createClient(url, anonKey);
  const { data: { user } } = await supabase.auth.getUser(auth);
  if (!user?.id) return null;
  return { id: user.id };
}

function toRow(rec: Record<string, unknown>, createdBy: string) {
  const namaAplikasi = typeof rec.namaAplikasi === 'string' ? rec.namaAplikasi.trim() : '';
  const pic = typeof rec.pic === 'string' ? rec.pic.trim() : '';
  if (!namaAplikasi || !pic) return null;
  return {
    nama_aplikasi: namaAplikasi,
    rencana_posting: typeof rec.rencanaPosting === 'string' ? rec.rencanaPosting.trim() : new Date().toISOString().slice(0, 10),
    status: typeof rec.status === 'string' ? rec.status : 'concept',
    pic,
    topic: typeof rec.topic === 'string' ? rec.topic.trim() || null : null,
    goals_content: typeof rec.goalsContent === 'string' ? rec.goalsContent.trim() || null : null,
    content_pillar: typeof rec.contentPillar === 'string' ? rec.contentPillar.trim() || null : null,
    type_of_content: typeof rec.typeOfContent === 'string' ? rec.typeOfContent.trim() || null : null,
    reference_file_name: typeof rec.referenceFileName === 'string' ? rec.referenceFileName.trim() || null : null,
    link: typeof rec.link === 'string' ? rec.link.trim() || null : null,
    caption: typeof rec.caption === 'string' ? rec.caption.trim() || null : null,
    revisi: typeof rec.revisi === 'string' ? rec.revisi.trim() || null : null,
    acc_to_posting: Boolean(rec.accToPosting),
    created_by: createdBy,
  };
}

export async function POST(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: { plans?: Record<string, unknown>[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const plans = Array.isArray(body.plans) ? body.plans : [];
  if (plans.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data rencana untuk di-import' }, { status: 400 });
  }
  const rows = plans.map((p) => toRow(p, caller.id)).filter(Boolean) as ReturnType<typeof toRow>[];
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Tidak ada baris valid (Nama Aplikasi dan PIC wajib)' }, { status: 400 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('content_planner').insert(rows).select('id');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ imported: (data ?? []).length });
}
