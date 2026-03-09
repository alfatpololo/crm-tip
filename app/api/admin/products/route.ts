import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function getCallerEmail(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get('authorization')?.replace(/Bearer\s+/i, '');
  if (!auth) return null;
  const supabase = createClient(url, anonKey);
  const { data: { user }, error } = await supabase.auth.getUser(auth);
  if (error || !user?.email) return null;
  return user.email.toLowerCase();
}

async function requireSuperadmin(req: NextRequest): Promise<NextResponse | null> {
  if (!url || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server env tidak lengkap' }, { status: 500 });
  }
  const callerEmail = await getCallerEmail(req);
  if (callerEmail !== SUPERADMIN_EMAIL) {
    return NextResponse.json({ error: 'Hanya superadmin' }, { status: 403 });
  }
  return null;
}

type ProductRow = Record<string, unknown> & { id: string; name?: string; sort_order?: number };

function normalizeProduct(p: ProductRow): { id: string; key: string; name: string; sort_order: number } {
  const key = (p.slug ?? p.key ?? p.product_key ?? p.code ?? String(p.id)) as string;
  const name = (p.name ?? 'Produk') as string;
  const sort_order = typeof p.sort_order === 'number' ? p.sort_order : 0;
  return { id: p.id, key: String(key), name, sort_order };
}

export async function GET(req: NextRequest) {
  const err = await requireSuperadmin(req);
  if (err) return err;
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.from('products').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const products = (data ?? []).map((p: ProductRow) => normalizeProduct(p)).sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const err = await requireSuperadmin(req);
  if (err) return err;
  let body: { key?: string; name?: string; sort_order?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const slug = typeof body.key === 'string' ? body.key.trim().toLowerCase().replace(/\s+/g, '_') : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!slug || !name) {
    return NextResponse.json({ error: 'key dan name wajib' }, { status: 400 });
  }
  const sort_order = typeof body.sort_order === 'number' ? body.sort_order : 0;
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const row: Record<string, unknown> = { slug, name, sort_order };
  if (slug) row.code = slug;
  const { data, error } = await supabase.from('products').insert(row).select('id, slug, name, sort_order').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data ? { ...data, key: (data as { slug: string }).slug } : data });
}

export async function PATCH(req: NextRequest) {
  const err = await requireSuperadmin(req);
  if (err) return err;
  let body: { id?: string; key?: string; name?: string; sort_order?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 });
  }
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return NextResponse.json({ error: 'id wajib' }, { status: 400 });
  const updates: { slug?: string; code?: string; name?: string; sort_order?: number } = {};
  if (typeof body.key === 'string') {
    const keyVal = body.key.trim().toLowerCase().replace(/\s+/g, '_');
    updates.slug = keyVal;
    updates.code = keyVal;
  }
  if (typeof body.name === 'string') updates.name = body.name.trim();
  if (typeof body.sort_order === 'number') updates.sort_order = body.sort_order;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Tidak ada field yang diupdate' }, { status: 400 });
  }
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select('id, slug, name, sort_order').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data ? { ...data, key: (data as { slug: string }).slug } : data });
}

export async function DELETE(req: NextRequest) {
  const err = await requireSuperadmin(req);
  if (err) return err;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id wajib' }, { status: 400 });
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
