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
  const year = parseInt(req.nextUrl.searchParams.get('year') ?? String(new Date().getFullYear()), 10);
  const month = parseInt(req.nextUrl.searchParams.get('month') ?? String(new Date().getMonth() + 1), 10);
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await admin.from('performance_customer').select('*').eq('year', year).eq('month', month).order('week');
  if (error) return NextResponse.json({ error: error.message, list: [] }, { status: 200 });
  const list = (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id,
    year: r.year,
    month: r.month,
    week: r.week,
    target: r.target != null ? Number(r.target) : null,
    totalCustomer: r.total_customer != null ? Number(r.total_customer) : null,
    newCustomer: r.new_customer != null ? Number(r.new_customer) : null,
    repeatCustomer: r.repeat_customer != null ? Number(r.repeat_customer) : null,
    churnCustomer: r.churn_customer != null ? Number(r.churn_customer) : null,
  }));
  return NextResponse.json({ list });
}

export async function POST(req: NextRequest) {
  if (!url || !anonKey) return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  const caller = await getCaller(req);
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: { year?: number; month?: number; week?: number; target?: number; totalCustomer?: number; newCustomer?: number; repeatCustomer?: number; churnCustomer?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Body harus JSON' }, { status: 400 }); }
  const year = typeof body.year === 'number' ? body.year : new Date().getFullYear();
  const month = typeof body.month === 'number' ? body.month : new Date().getMonth() + 1;
  const week = typeof body.week === 'number' ? body.week : 1;
  const admin = createClient(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const row = {
    year,
    month,
    week,
    target: body.target ?? null,
    total_customer: body.totalCustomer ?? null,
    new_customer: body.newCustomer ?? null,
    repeat_customer: body.repeatCustomer ?? null,
    churn_customer: body.churnCustomer ?? null,
  };
  const { data, error } = await admin.from('performance_customer').upsert(row, { onConflict: 'year,month,week' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: { id: data.id, year: data.year, month: data.month, week: data.week, target: data.target, totalCustomer: data.total_customer, newCustomer: data.new_customer, repeatCustomer: data.repeat_customer, churnCustomer: data.churn_customer } });
}
