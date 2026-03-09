import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPERADMIN_EMAIL = (process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL ?? 'alfat.pololo@gmail.com').trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = 'task-evidence';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', // kadang browser kirim jpg bukan jpeg
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic', // foto iPhone
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function isAllowedType(mime: string): boolean {
  if (!mime) return false;
  if (mime.startsWith('image/')) return true; // semua tipe gambar
  return ALLOWED_TYPES.includes(mime);
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!url || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase tidak dikonfigurasi' }, { status: 500 });
  }
  const caller = await getCaller(req);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id: taskId } = await params;
  if (!taskId) return NextResponse.json({ error: 'ID tugas wajib' }, { status: 400 });

  const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: task, error: taskErr } = await admin.from('tasks').select('id, pic, evidence_links').eq('id', taskId).single();
  if (taskErr || !task) {
    return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
  }
  const isCoordinator = caller.role === 'koordinator' || caller.role === 'management';
  const myName = displayNameFromEmail(caller.email);
  const isMine = ((task as { pic?: string }).pic || '').trim().toLowerCase() === myName.toLowerCase();
  if (!isCoordinator && !isMine) {
    return NextResponse.json({ error: 'Anda tidak boleh menambah bukti untuk tugas ini' }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Body harus form-data dengan field "file"' }, { status: 400 });
  }
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'File wajib (field name: file)' }, { status: 400 });
  }
  const blob = file as Blob;
  const size = blob.size;
  const type = blob.type || '';
  if (size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ukuran file maksimal 10MB' }, { status: 400 });
  }
  if (!isAllowedType(type)) {
    return NextResponse.json({ error: `Tipe file tidak diizinkan: ${type || 'unknown'}. Gunakan foto (jpg/png/gif), PDF, atau Word.` }, { status: 400 });
  }

  const name = (file as File).name || 'file';
  const safeName = name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
  const path = `${taskId}/${Date.now()}-${safeName}`;

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = type || 'application/octet-stream';

  const { data: uploadData, error: uploadErr } = await admin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: false });

  if (uploadErr) {
    const msg = uploadErr.message || String(uploadErr);
    return NextResponse.json({
      error: 'Gagal upload ke storage: ' + msg,
      detail: msg,
      hint: msg.includes('Bucket') || msg.includes('bucket') ? 'Buat bucket "task-evidence" di Supabase Dashboard → Storage (Public: on).' : undefined,
    }, { status: 500 });
  }

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(uploadData.path);
  const publicUrl = urlData.publicUrl;

  const currentLinks = Array.isArray((task as { evidence_links?: unknown }).evidence_links)
    ? ((task as { evidence_links: string[] }).evidence_links).filter((x): x is string => typeof x === 'string')
    : [];
  const newLinks = [...currentLinks, publicUrl];

  const { error: updateErr } = await admin
    .from('tasks')
    .update({ evidence_links: newLinks })
    .eq('id', taskId);

  if (updateErr) {
    return NextResponse.json({ error: 'Gagal menyimpan referensi file' }, { status: 500 });
  }

  return NextResponse.json({ url: publicUrl, ok: true });
}
