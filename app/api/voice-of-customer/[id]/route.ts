import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!url || !anonKey) return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'ID wajib' }, { status: 400 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 }); }
  const updates: Record<string, unknown> = {};
  if (typeof body.tanggalComplain === 'string') updates.tanggal_complain = body.tanggalComplain;
  if (body.channel !== undefined) updates.channel = body.channel;
  if (body.noTelpUsername !== undefined) updates.no_telp_username = body.noTelpUsername;
  if (body.namaUsaha !== undefined) updates.nama_usaha = body.namaUsaha;
  if (body.detailComplain !== undefined) updates.detail_complain = body.detailComplain;
  if (body.kategori !== undefined) updates.kategori = body.kategori;
  if (body.temuanMasalah !== undefined) updates.temuan_masalah = body.temuanMasalah;
  if (body.tindakLanjut !== undefined) updates.tindak_lanjut = body.tindakLanjut;
  if (body.pic !== undefined) updates.pic = body.pic;
  if (body.solved !== undefined) updates.solved = Boolean(body.solved);
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('voice_of_customer').update(updates).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const r = data as Record<string, unknown>;
  return NextResponse.json({ item: { id: r.id, tanggalComplain: r.tanggal_complain, channel: r.channel, noTelpUsername: r.no_telp_username, namaUsaha: r.nama_usaha, detailComplain: r.detail_complain, kategori: r.kategori, temuanMasalah: r.temuan_masalah, tindakLanjut: r.tindak_lanjut, pic: r.pic, solved: r.solved, createdAt: r.created_at } });
}
