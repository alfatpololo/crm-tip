import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type ContentPlannerRow = {
  id: string;
  nama_aplikasi: string;
  rencana_posting: string;
  status: string;
  pic: string;
  topic: string | null;
  goals_content: string | null;
  content_pillar: string | null;
  type_of_content: string | null;
  reference_file_name: string | null;
  link: string | null;
  caption: string | null;
  revisi: string | null;
  acc_to_posting: boolean;
  created_at: string;
  created_by: string | null;
};

function rowToRecord(r: ContentPlannerRow) {
  return {
    id: r.id,
    namaAplikasi: r.nama_aplikasi,
    rencanaPosting: r.rencana_posting,
    status: r.status,
    pic: r.pic,
    topic: r.topic ?? '',
    goalsContent: r.goals_content ?? '',
    contentPillar: r.content_pillar ?? '',
    typeOfContent: r.type_of_content ?? '',
    referenceFileName: r.reference_file_name ?? undefined,
    link: r.link ?? '',
    caption: r.caption ?? '',
    revisi: r.revisi ?? '',
    accToPosting: r.acc_to_posting,
    createdAt: r.created_at,
  };
}

async function getCaller(req: NextRequest): Promise<{ id: string } | null> {
  const auth = req.headers.get('authorization')?.replace(/Bearer\s+/i, '');
  if (!auth) return null;
  const supabase = createClient(url, anonKey);
  const { data: { user } } = await supabase.auth.getUser(auth);
  if (!user?.id) return null;
  return { id: user.id };
}

export async function GET() {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin
    .from('content_planner')
    .select('*')
    .order('rencana_posting', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message, plans: [] }, { status: 200 });
  }
  const plans = (data ?? []).map((r: ContentPlannerRow) => rowToRecord(r));
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: {
    namaAplikasi?: string;
    rencanaPosting?: string;
    status?: string;
    pic?: string;
    topic?: string;
    goalsContent?: string;
    contentPillar?: string;
    typeOfContent?: string;
    referenceFileName?: string;
    link?: string;
    caption?: string;
    revisi?: string;
    accToPosting?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const namaAplikasi = typeof body.namaAplikasi === 'string' ? body.namaAplikasi.trim() : '';
  const pic = typeof body.pic === 'string' ? body.pic.trim() : '';
  if (!namaAplikasi || !pic) {
    return NextResponse.json({ error: 'Nama Aplikasi dan PIC wajib' }, { status: 400 });
  }
  const rencanaPosting = typeof body.rencanaPosting === 'string' ? body.rencanaPosting.trim() : new Date().toISOString().slice(0, 10);
  const row = {
    nama_aplikasi: namaAplikasi,
    rencana_posting: rencanaPosting,
    status: typeof body.status === 'string' ? body.status : 'concept',
    pic,
    topic: typeof body.topic === 'string' ? body.topic.trim() || null : null,
    goals_content: typeof body.goalsContent === 'string' ? body.goalsContent.trim() || null : null,
    content_pillar: typeof body.contentPillar === 'string' ? body.contentPillar.trim() || null : null,
    type_of_content: typeof body.typeOfContent === 'string' ? body.typeOfContent.trim() || null : null,
    reference_file_name: typeof body.referenceFileName === 'string' ? body.referenceFileName.trim() || null : null,
    link: typeof body.link === 'string' ? body.link.trim() || null : null,
    caption: typeof body.caption === 'string' ? body.caption.trim() || null : null,
    revisi: typeof body.revisi === 'string' ? body.revisi.trim() || null : null,
    acc_to_posting: Boolean(body.accToPosting),
    created_by: caller.id,
  };
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('content_planner').insert(row).select('*').single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: rowToRecord(data as ContentPlannerRow) });
}
