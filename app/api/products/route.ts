import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type ProductRow = Record<string, unknown> & { id: string; name?: string; sort_order?: number };

function normalizeProduct(p: ProductRow): { id: string; key: string; name: string; sort_order: number } {
  const key = (p.slug ?? p.key ?? p.product_key ?? p.code ?? String(p.id)) as string;
  const name = (p.name ?? 'Produk') as string;
  const sort_order = typeof p.sort_order === 'number' ? p.sort_order : 0;
  return { id: p.id, key: String(key), name, sort_order };
}

export async function GET() {
  if (!url || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server env tidak lengkap' }, { status: 500 });
  }
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const products = (data ?? []).map((p: ProductRow) => normalizeProduct(p)).sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json({ products });
}
