import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const VALID_ROLES = ['superadmin', 'management', 'koordinator', 'sales_officer', 'staff'];

async function getCallerEmail(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get('authorization')?.replace(/Bearer\s+/i, '');
  if (!auth) return null;
  const supabase = createClient(url, anonKey);
  const { data: { user }, error } = await supabase.auth.getUser(auth);
  if (error || !user?.email) return null;
  return user.email.toLowerCase();
}

export async function PATCH(req: NextRequest) {
  if (!url || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server env tidak lengkap' }, { status: 500 });
  }
  const callerEmail = await getCallerEmail(req);
  if (callerEmail !== SUPERADMIN_EMAIL) {
    return NextResponse.json({ error: 'Hanya superadmin yang boleh mengubah role' }, { status: 403 });
  }
  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const role = typeof body.role === 'string' ? body.role.trim() : '';
  if (!email || !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'email dan role wajib; role harus: ' + VALID_ROLES.join(', ') }, { status: 400 });
  }
  if (email === SUPERADMIN_EMAIL && role !== 'superadmin') {
    return NextResponse.json({ error: 'Superadmin tidak boleh diubah rolenya' }, { status: 400 });
  }

  const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { users }, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    return NextResponse.json({ error: 'Gagal list user: ' + listError.message }, { status: 500 });
  }
  const target = users?.find((u) => (u.email ?? '').toLowerCase() === email);
  if (!target) {
    return NextResponse.json({ error: 'User dengan email tersebut belum terdaftar' }, { status: 404 });
  }

  const roleToSave = email === SUPERADMIN_EMAIL ? 'superadmin' : role;
  const { error: upsertError } = await admin.from('profiles').upsert(
    { id: target.id, email: target.email ?? email, role: roleToSave },
    { onConflict: 'id' }
  );
  if (upsertError) {
    return NextResponse.json({ error: 'Gagal update role: ' + upsertError.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, email, role: roleToSave });
}

export async function GET(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Server env tidak lengkap' }, { status: 500 });
  }
  const callerEmail = await getCallerEmail(req);
  if (callerEmail !== SUPERADMIN_EMAIL) {
    return NextResponse.json({ error: 'Hanya superadmin' }, { status: 403 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { users: authUsers }, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    const fromProfiles = await admin.from('profiles').select('id, email, role');
    if (fromProfiles.error || !fromProfiles.data?.length) {
      return NextResponse.json({
        error: 'Gagal ambil daftar user. Pasang SUPABASE_SERVICE_ROLE_KEY (bukan anon) di .env.local. Supabase Dashboard → Settings → API → service_role.',
        detail: listError.message,
      }, { status: 500 });
    }
    const list = (fromProfiles.data as { id: string; email?: string; role?: string }[]).map((p) => ({
      id: p.id,
      email: (p.email ?? '').toLowerCase(),
      role: (p.email ?? '').toLowerCase() === SUPERADMIN_EMAIL ? 'superadmin' : (VALID_ROLES.includes(p.role ?? '') ? p.role : 'staff'),
    }));
    return NextResponse.json({ users: list, fromProfilesOnly: true });
  }
  const { data: profiles } = await admin.from('profiles').select('id, email, role');
  const profileById = new Map((profiles ?? []).map((p: { id: string; email?: string; role?: string }) => [p.id, p]));
  const list = (authUsers ?? []).map((u) => {
    const profile = profileById.get(u.id);
    const email = (u.email ?? profile?.email ?? '').toLowerCase();
    const role = email === SUPERADMIN_EMAIL ? 'superadmin' : (profile?.role ?? 'staff');
    return { id: u.id, email, role };
  });
  return NextResponse.json({ users: list });
}
