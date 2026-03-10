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
  return user?.id ? { id: user.id } : null;
}

function rowToRecord(r: Record<string, unknown>) {
  return {
    id: r.id,
    tanggalComplain: r.tanggal_complain,
    channel: r.channel ?? '',
    noTelpUsername: r.no_telp_username ?? '',
    namaUsaha: r.nama_usaha ?? '',
    detailComplain: r.detail_complain ?? '',
    kategori: r.kategori ?? '',
    temuanMasalah: r.temuan_masalah ?? '',
    tindakLanjut: r.tindak_lanjut ?? '',
    pic: r.pic ?? '',
    solved: Boolean(r.solved),
    createdAt: r.created_at,
  };
}

export async function GET() {
  if (!url || !anonKey) return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('voice_of_customer').select('*').order('tanggal_complain', { ascending: false });
  if (error) return NextResponse.json({ error: error.message, list: [] }, { status: 200 });
  return NextResponse.json({ list: (data ?? []).map(rowToRecord) });
}

export async function POST(req: NextRequest) {
  if (!url || !anonKey) return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  const caller = await getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 }); }
  const tanggalComplain = typeof body.tanggalComplain === 'string' ? body.tanggalComplain : new Date().toISOString().slice(0, 10);
  const row = {
    tanggal_complain: tanggalComplain,
    channel: typeof body.channel === 'string' ? body.channel.trim() || null : null,
    no_telp_username: typeof body.noTelpUsername === 'string' ? body.noTelpUsername.trim() || null : null,
    nama_usaha: typeof body.namaUsaha === 'string' ? body.namaUsaha.trim() || null : null,
    detail_complain: typeof body.detailComplain === 'string' ? body.detailComplain.trim() || null : null,
    kategori: typeof body.kategori === 'string' ? body.kategori.trim() || null : null,
    temuan_masalah: typeof body.temuanMasalah === 'string' ? body.temuanMasalah.trim() || null : null,
    tindak_lanjut: typeof body.tindakLanjut === 'string' ? body.tindakLanjut.trim() || null : null,
    pic: typeof body.pic === 'string' ? body.pic.trim() || null : null,
    solved: Boolean(body.solved),
  };
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('voice_of_customer').insert(row).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: rowToRecord(data as Record<string, unknown>) });
}
