import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const VALID_ROLES = ['superadmin', 'management', 'koordinator', 'sales_officer', 'staff'];

async function getCallerId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get('authorization')?.replace(/Bearer\s+/i, '');
  if (!auth) return null;
  const supabase = createClient(url, anonKey);
  const { data: { user } } = await supabase.auth.getUser(auth);
  return user?.id ?? null;
}

export async function GET(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const userId = await getCallerId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { users: authUsers }, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    const { data: profiles } = await admin.from('profiles').select('id, email, role');
    if (profiles?.length) {
      const list = (profiles as { id: string; email?: string; role?: string }[]).map((p) => ({
        id: p.id,
        email: (p.email ?? '').trim().toLowerCase(),
        role: (p.email ?? '').toLowerCase() === SUPERADMIN_EMAIL ? 'superadmin' : (VALID_ROLES.includes(p.role ?? '') ? p.role : 'staff'),
      }));
      return NextResponse.json({ users: list });
    }
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }
  const { data: profiles } = await admin.from('profiles').select('id, email, role');
  const profileById = new Map((profiles ?? []).map((p: { id: string; email?: string; role?: string }) => [p.id, p]));
  const list = (authUsers ?? []).map((u) => {
    const profile = profileById.get(u.id);
    const email = (u.email ?? profile?.email ?? '').trim().toLowerCase();
    const role = email === SUPERADMIN_EMAIL ? 'superadmin' : ((profile?.role && VALID_ROLES.includes(profile.role)) ? profile.role : 'staff');
    return { id: u.id, email, role };
  });
  return NextResponse.json({ users: list });
}
