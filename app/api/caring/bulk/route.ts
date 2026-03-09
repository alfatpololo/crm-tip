import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function displayNameFromEmail(email: string): string {
  const local = (email || '').split('@')[0] || '';
  return local ? local.charAt(0).toUpperCase() + local.slice(1).toLowerCase() : email;
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
  if (isCoordinator) {
    return NextResponse.json({ error: 'Import caring hanya untuk staff. Koordinator hanya melihat data.' }, { status: 403 });
  }
  let body: { items?: { namaToko?: string; picToko?: string; tanggalCall?: string; statusCall?: string; hasil?: string; nextAction?: string; tanggalFu?: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: 'Tidak ada data untuk di-import' }, { status: 400 });
  }
  const picSales = displayNameFromEmail(caller.email);
  const rows = items
    .filter((i) => typeof i.namaToko === 'string' && i.namaToko.trim() && typeof i.tanggalCall === 'string' && i.tanggalCall.trim())
    .map((i) => ({
      pic_sales: picSales,
      nama_toko: String(i.namaToko).trim(),
      pic_toko: typeof i.picToko === 'string' ? i.picToko.trim() || null : null,
      tanggal_call: String(i.tanggalCall).trim(),
      status_call: typeof i.statusCall === 'string' ? i.statusCall.trim() || null : null,
      hasil: typeof i.hasil === 'string' ? i.hasil.trim() || null : null,
      next_action: typeof i.nextAction === 'string' ? i.nextAction.trim() || null : null,
      tanggal_fu: typeof i.tanggalFu === 'string' ? i.tanggalFu.trim() || null : null,
      created_by: caller.id,
    }));
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Tidak ada baris valid (Nama Toko dan Tanggal Call wajib)' }, { status: 400 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('caring').insert(rows).select('id');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ imported: (data ?? []).length });
}
