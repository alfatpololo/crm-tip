import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type CaringRow = {
  id: string;
  pic_sales: string;
  nama_toko: string;
  pic_toko: string | null;
  tanggal_call: string;
  status_call: string | null;
  hasil: string | null;
  next_action: string | null;
  tanggal_fu: string | null;
  created_at: string;
  created_by: string | null;
};

function rowToRecord(r: CaringRow) {
  return {
    id: r.id,
    picSales: r.pic_sales,
    namaToko: r.nama_toko,
    picToko: r.pic_toko ?? undefined,
    tanggalCall: r.tanggal_call,
    statusCall: r.status_call ?? undefined,
    hasil: r.hasil ?? undefined,
    nextAction: r.next_action ?? undefined,
    tanggalFu: r.tanggal_fu ?? undefined,
    createdAt: r.created_at,
    createdBy: r.created_by ?? undefined,
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
  const isCoordinator = caller.role === 'koordinator' || caller.role === 'management';
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  let query = admin.from('caring').select('*').order('tanggal_call', { ascending: false });
  if (!isCoordinator) {
    const myName = displayNameFromEmail(caller.email);
    query = query.eq('pic_sales', myName);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message, list: [] }, { status: 200 });
  }
  const list = (data ?? []).map((r: CaringRow) => rowToRecord(r));
  return NextResponse.json({ list });
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
  if (isCoordinator) {
    return NextResponse.json({ error: 'Koordinator hanya dapat melihat data. Input oleh staff.' }, { status: 403 });
  }
  let body: {
    namaToko?: string;
    picToko?: string;
    tanggalCall?: string;
    statusCall?: string;
    hasil?: string;
    nextAction?: string;
    tanggalFu?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const namaToko = typeof body.namaToko === 'string' ? body.namaToko.trim() : '';
  const tanggalCall = typeof body.tanggalCall === 'string' ? body.tanggalCall.trim() : '';
  if (!namaToko || !tanggalCall) {
    return NextResponse.json({ error: 'Nama Toko dan Tanggal Call wajib' }, { status: 400 });
  }
  const picSales = displayNameFromEmail(caller.email);
  const row = {
    pic_sales: picSales,
    nama_toko: namaToko,
    pic_toko: typeof body.picToko === 'string' ? body.picToko.trim() || null : null,
    tanggal_call: tanggalCall,
    status_call: typeof body.statusCall === 'string' ? body.statusCall.trim() || null : null,
    hasil: typeof body.hasil === 'string' ? body.hasil.trim() || null : null,
    next_action: typeof body.nextAction === 'string' ? body.nextAction.trim() || null : null,
    tanggal_fu: typeof body.tanggalFu === 'string' ? body.tanggalFu.trim() || null : null,
    created_by: caller.id,
  };
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('caring').insert(row).select('*').single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ item: rowToRecord(data as CaringRow) });
}
