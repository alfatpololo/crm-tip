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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID wajib' }, { status: 400 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('content_planner').select('*').eq('id', id).single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Rencana tidak ditemukan' }, { status: 404 });
  }
  return NextResponse.json({ plan: rowToRecord(data as ContentPlannerRow) });
}
