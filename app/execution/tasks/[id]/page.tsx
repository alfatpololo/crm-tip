'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import type { TaskRecord } from '@/lib/tasksData';

function getStatusColor(s: string) {
  if (s === 'overdue') return 'bg-red-100 text-red-700';
  if (s === 'done') return 'bg-green-100 text-green-700';
  return 'bg-blue-100 text-blue-700';
}

export default function TaskDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { role } = useAuth();
  const isCoordinator = role === 'koordinator' || role === 'management';

  const [task, setTask] = useState<TaskRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evidenceLink, setEvidenceLink] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [progressRealisasi, setProgressRealisasi] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [progressNote, setProgressNote] = useState('');
  const [savingProgress, setSavingProgress] = useState(false);

  const fetchTask = useCallback(async (silent = false) => {
    if (!id) return;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`/api/tasks/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (!res.ok) {
        if (!silent) setError(json.error || 'Gagal memuat tugas');
        setTask(null);
        return;
      }
      setTask(json.task);
      setEvidenceNote(json.task.evidenceNote || '');
      setProgressRealisasi(json.task.progressRealisasi != null ? String(json.task.progressRealisasi) : '');
      setProgressStatus(json.task.status || 'pending');
      setProgressNote(json.task.progressNote || '');
    } catch {
      if (!silent) setError('Gagal memuat tugas');
      setTask(null);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const BUCKET = 'task-evidence';
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file || !task || uploadingFile) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 10MB');
      return;
    }
    setUploadError(null);
    setUploadingFile(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
      const path = `${task.id}/${Date.now()}-${safeName}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });

      if (uploadErr) {
        setUploadError(uploadErr.message || 'Gagal upload. Pastikan bucket "task-evidence" ada dan policy izinkan upload.');
        return;
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
      const publicUrl = urlData.publicUrl;

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const newLinks = [...(task.evidenceLinks || []), publicUrl];
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ id: task.id, evidenceLinks: newLinks }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setUploadError((json as { error?: string }).error || 'Gagal menyimpan link bukti');
        return;
      }
      await fetchTask(true);
      input.value = '';
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Gagal upload');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || savingEvidence) return;
    const newLink = evidenceLink.trim();
    const links = [...(task.evidenceLinks || [])];
    if (newLink) links.push(newLink);
    setSavingEvidence(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          id: task.id,
          evidenceLinks: links,
          evidenceNote: evidenceNote.trim() || undefined,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setTask(json.task);
        setEvidenceLink('');
      }
    } finally {
      setSavingEvidence(false);
    }
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || savingProgress) return;
    const realisasi = progressRealisasi.trim() ? Number(progressRealisasi) : undefined;
    const note = progressNote.trim() || undefined;
    const status = progressStatus || task.status;
    setSavingProgress(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          id: task.id,
          progressRealisasi: realisasi,
          progressNote: note,
          status,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setTask(json.task);
        setProgressRealisasi(json.task.progressRealisasi != null ? String(json.task.progressRealisasi) : '');
        setProgressStatus(json.task.status || '');
        setProgressNote(json.task.progressNote || '');
      }
    } finally {
      setSavingProgress(false);
    }
  };

  const handleApprove = async () => {
    if (!task || approving || !isCoordinator) return;
    setApproving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          id: task.id,
          status: 'done',
          approvedAt: new Date().toISOString(),
          approvedBy: session?.user?.id,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setTask(json.task);
      }
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px] gap-2 text-gray-500">
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
          Memuat...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !task) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <p className="text-red-600">{error || 'Tugas tidak ditemukan'}</p>
          <Link href="/execution/tasks" className="text-amber-600 hover:underline font-medium">
            ← Kembali ke Daftar Tugas
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const statusLabel = task.status === 'overdue' ? 'Terlambat' : task.status === 'done' ? 'Selesai' : 'Pending';
  const isApproved = !!task.approvedAt;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/execution/tasks"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium"
          >
            <i className="ri-arrow-left-line"></i> Kembali ke Daftar Tugas
          </Link>
        </div>

        <PageCard accent="amber" icon="ri-task-line" title="Detail Tugas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 block mb-0.5">Judul / Kegiatan</span>
              <span className="font-semibold text-gray-900">{task.title}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Produk</span>
              <span className="inline-flex px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">{task.product}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">PIC</span>
              <span className="font-medium text-amber-800">{task.pic}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Jatuh tempo</span>
              <span>{task.dueDate}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Status</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(task.status)}`}>
                {statusLabel}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Progress</span>
              <span className="tabular-nums">
                {task.targetValue != null
                  ? `${task.progressRealisasi ?? '–'} / ${task.targetValue} ${task.satuan || ''}`
                  : task.progressRealisasi != null ? `${task.progressRealisasi} ${task.satuan || ''}` : '–'}
              </span>
            </div>
            {task.catatan && (
              <div className="md:col-span-2">
                <span className="text-gray-500 block mb-0.5">Catatan tugas</span>
                <p className="text-gray-700">{task.catatan}</p>
              </div>
            )}
            {task.progressNote && (
              <div className="md:col-span-2">
                <span className="text-gray-500 block mb-0.5">Catatan progress</span>
                <p className="text-gray-700">{task.progressNote}</p>
              </div>
            )}
          </div>
        </PageCard>

        {!isCoordinator && (
          <PageCard accent="emerald" icon="ri-edit-line" title="Update Progress">
            <p className="text-sm text-gray-600 mb-4">Isi realisasi dan status di sini. Koordinator bisa pantau dari daftar tugas.</p>
            <form onSubmit={handleSaveProgress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Realisasi {task.targetValue != null ? `(target: ${task.targetValue} ${task.satuan || ''})` : ''}
                </label>
                <input
                  type="number"
                  min={0}
                  value={progressRealisasi}
                  onChange={(e) => setProgressRealisasi(e.target.value)}
                  placeholder={task.targetValue != null ? `Contoh: 5 dari ${task.targetValue}` : 'Angka yang sudah dicapai'}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="pending">Pending</option>
                  <option value="overdue">Terlambat</option>
                  <option value="done">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan progress (opsional)</label>
                <textarea
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  rows={2}
                  placeholder="Catatan untuk koordinator"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingProgress}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
              >
                {savingProgress ? 'Menyimpan...' : 'Simpan progress'}
              </button>
            </form>
          </PageCard>
        )}

        <PageCard accent="indigo" icon="ri-file-list-3-line" title="Bukti / Evidence">
          {(task.evidenceLinks?.length ?? 0) > 0 && (
            <div className="mb-4">
              <span className="text-gray-500 block text-sm mb-2">Bukti (file & link)</span>
              <ul className="space-y-2">
                {(task.evidenceLinks || []).map((url, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {url.startsWith('http') && (url.includes('/task-evidence/') || url.includes('supabase')) ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline">
                        <i className="ri-file-upload-line"></i> File bukti {i + 1}
                      </a>
                    ) : (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">
                        {url}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {task.evidenceNote && (
            <div className="mb-4">
              <span className="text-gray-500 block text-sm mb-1">Catatan bukti</span>
              <p className="text-gray-700">{task.evidenceNote}</p>
            </div>
          )}
          {!task.evidenceLinks?.length && !task.evidenceNote && (
            <p className="text-gray-500 text-sm mb-4">Belum ada bukti. Staff dapat upload file atau tambah link di bawah.</p>
          )}

          {!isCoordinator && (
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <h4 className="font-medium text-gray-900">Tambah bukti</h4>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Upload file (foto, PDF, atau Word — max 10MB)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,image/*,application/pdf"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100"
                />
                {uploadingFile && <p className="text-sm text-gray-500 mt-1">Mengunggah...</p>}
                {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
              </div>
              <form onSubmit={handleAddEvidence} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Atau link bukti (URL)</label>
                  <input
                    type="url"
                    value={evidenceLink}
                    onChange={(e) => setEvidenceLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Catatan bukti (opsional)</label>
                  <textarea
                    value={evidenceNote}
                    onChange={(e) => setEvidenceNote(e.target.value)}
                    rows={2}
                    placeholder="Keterangan singkat bukti"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingEvidence}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                >
                  {savingEvidence ? 'Menyimpan...' : 'Simpan link & catatan'}
                </button>
              </form>
            </div>
          )}

          {isCoordinator && (task.evidenceLinks?.length || task.evidenceNote) && (
            <div className="pt-4 border-t border-gray-200">
              {isApproved ? (
                <p className="inline-flex items-center gap-2 text-green-700 font-medium">
                  <i className="ri-checkbox-circle-fill"></i> Sudah dicek / disetujui
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                >
                  {approving ? '...' : <i className="ri-checkbox-circle-line"></i>}
                  Tandai sudah dicek / Setuju
                </button>
              )}
            </div>
          )}
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
