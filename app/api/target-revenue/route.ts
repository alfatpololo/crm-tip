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

export async function GET(req: NextRequest) {
  if (!url || !anonKey) return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  const caller = await getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const yearParam = req.nextUrl.searchParams.get('year');
  const currentYear = new Date().getFullYear();
  const yearNum = yearParam ? parseInt(yearParam, 10) : currentYear;
  const years = [yearNum, yearNum - 1];
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('target_revenue').select('*').in('year', years);
  if (error) return NextResponse.json({ error: error.message, list: [] }, { status: 200 });
  const list = (data ?? []).map((r: { id: string; year: number; product_key: string; target_value: number; created_at: string }) => ({
    id: r.id,
    year: r.year,
    productKey: r.product_key,
    targetValue: Number(r.target_value),
    createdAt: r.created_at,
  }));
  return NextResponse.json({ list });
}

export async function POST(req: NextRequest) {
  if (!url || !anonKey) return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  const caller = await getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: { year?: number; productKey?: string; targetValue?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 }); }
  const year = typeof body.year === 'number' ? body.year : new Date().getFullYear();
  const productKey = typeof body.productKey === 'string' ? body.productKey.trim() : '';
  if (!productKey) return NextResponse.json({ error: 'productKey wajib' }, { status: 400 });
  const targetValue = typeof body.targetValue === 'number' ? body.targetValue : 0;
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('target_revenue').upsert(
    { year, product_key: productKey, target_value: targetValue },
    { onConflict: 'year,product_key' }
  ).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: { id: data.id, year: data.year, productKey: data.product_key, targetValue: Number(data.target_value) } });
}
