'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import {
  TASK_PRIORITY,
  loadTasksFromStorage,
  saveTasksToStorage,
  type TaskRecord,
} from '@/lib/tasksData';
import { getActivityOptionsForInputTask } from '@/lib/activityOptions';
import { useAuth } from '@/contexts/AuthContext';
import { useTeamMembers, teamMemberDisplay, useProducts } from '@/lib/useTeamAndProducts';
import { supabase } from '@/lib/supabase/client';

const TASK_PRODUCTS_FALLBACK = ['MKASIR', 'DISIPLINKU'];

function getPriorityColor(p: string) {
  if (p === 'tinggi') return 'bg-red-100 text-red-700';
  if (p === 'sedang') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
}
function getStatusColor(s: string) {
  if (s === 'overdue') return 'bg-red-100 text-red-700';
  if (s === 'done') return 'bg-green-100 text-green-700';
  return 'bg-blue-100 text-blue-700';
}

function samePic(a: string, b: string): boolean {
  return (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();
}

export default function TasksPage() {
  const { user, role } = useAuth();
  const { users } = useTeamMembers();
  const { products } = useProducts();
  const isCoordinator = role === 'koordinator' || role === 'management';

  const myDisplayName = useMemo(() => {
    if (!user?.email) return '';
    const fromTeam = users.find((u) => u.email?.toLowerCase() === user.email?.toLowerCase());
    if (fromTeam) return teamMemberDisplay(fromTeam);
    const local = (user.email || '').split('@')[0] || '';
    return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
  }, [user?.email, users]);

  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progressModalTask, setProgressModalTask] = useState<TaskRecord | null>(null);
  const [progressForm, setProgressForm] = useState({ realisasi: '', status: '', note: '' });
  const [filter, setFilter] = useState({ status: 'all', product: 'all', aktivitas: 'all', pic: 'all' });
  const [form, setForm] = useState({
    chanel: '',
    kegiatan: '',
    title: '',
    leadCompany: '',
    product: 'MKASIR',
    aktivitas: '',
    pic: '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'sedang',
    catatan: '',
    targetValue: '',
    satuan: '',
  });

  const activityOptions = useMemo(() => getActivityOptionsForInputTask(), []);
  const channelList = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; label: string }[] = [];
    activityOptions.forEach((o) => {
      const id = o.value.split('-')[0];
      if (seen.has(id)) return;
      seen.add(id);
      list.push({ id, label: o.sectionLabel });
    });
    return list;
  }, [activityOptions]);
  const activitiesByChanel = useMemo(() => {
    const map = new Map<string, typeof activityOptions>();
    activityOptions.forEach((o) => {
      const id = o.value.split('-')[0];
      const list = map.get(id) ?? [];
      list.push(o);
      map.set(id, list);
    });
    return map;
  }, [activityOptions]);
  const kegiatanOptions = useMemo(
    () => (form.chanel ? (activitiesByChanel.get(form.chanel) ?? []) : []),
    [form.chanel, activitiesByChanel]
  );
  const filterChanelOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: { value: string; label: string }[] = [{ value: 'all', label: 'Semua Chanel' }];
    activityOptions.forEach((o) => {
      const id = o.value.split('-')[0];
      if (seen.has(id)) return;
      seen.add(id);
      list.push({ value: id, label: o.sectionLabel });
    });
    return list;
  }, [activityOptions]);

  const productList = useMemo(() => (products.length > 0 ? products.map((p) => p.name) : TASK_PRODUCTS_FALLBACK), [products]);
  const picList = useMemo(() => (users.length > 0 ? users.map((u) => teamMemberDisplay(u)) : ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi']), [users]);

  const loadTasks = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && Array.isArray(json.tasks)) {
        setTasks(json.tasks.length > 0 ? json.tasks : []);
        return;
      }
    } catch (_) {}
    const stored = loadTasksFromStorage();
    setTasks(stored.length > 0 ? stored : []);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const interval = setInterval(loadTasks, 3000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  const saveTasks = (next: TaskRecord[]) => {
    setTasks(next);
    saveTasksToStorage(next);
  };

  const myTasks = useMemo(() => tasks.filter((t) => samePic(t.pic, myDisplayName)), [tasks, myDisplayName]);
  const myPending = myTasks.filter((t) => t.status === 'pending' || t.status === 'overdue').length;
  const myDone = myTasks.filter((t) => t.status === 'done').length;

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.kegiatan || !form.pic) return;
    const opt = activityOptions.find((a) => a.value === form.kegiatan);
    const aktivitasLabel = opt?.activityLabel ?? form.kegiatan;
    const targetNum = form.targetValue.trim() ? Number(form.targetValue) : undefined;
    const payload: Omit<TaskRecord, 'id' | 'createdAt'> & { createdAt?: string } = {
      title: aktivitasLabel,
      leadCompany: form.leadCompany.trim() || undefined,
      product: form.product,
      aktivitas: form.kegiatan,
      aktivitasLabel,
      pic: form.pic,
      dueDate: form.dueDate,
      priority: form.priority,
      status: 'pending',
      catatan: form.catatan.trim() || undefined,
      targetValue: targetNum,
      satuan: (form.satuan.trim() || opt?.satuan) || undefined,
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.task) {
        setTasks((prev) => [json.task, ...prev]);
        saveTasksToStorage([json.task, ...tasks]);
        setForm({ chanel: '', kegiatan: '', title: '', leadCompany: '', product: 'MKASIR', aktivitas: '', pic: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'sedang', catatan: '', targetValue: '', satuan: '' });
        setIsModalOpen(false);
        return;
      }
    } catch (_) {}
    const newTask: TaskRecord = {
      ...payload,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    saveTasks([newTask, ...tasks]);
    setForm({ chanel: '', kegiatan: '', title: '', leadCompany: '', product: 'MKASIR', aktivitas: '', pic: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'sedang', catatan: '', targetValue: '', satuan: '' });
    setIsModalOpen(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'pending' : 'done';
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
        return;
      }
    } catch (_) {}
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
  };

  const openProgressModal = (t: TaskRecord) => {
    setProgressModalTask(t);
    setProgressForm({
      realisasi: t.progressRealisasi != null ? String(t.progressRealisasi) : '',
      status: t.status,
      note: t.progressNote || '',
    });
  };

  const saveProgress = async () => {
    if (!progressModalTask) return;
    const realisasi = progressForm.realisasi ? Number(progressForm.realisasi) : undefined;
    const note = progressForm.note.trim() || undefined;
    const status = progressForm.status || progressModalTask.status;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          id: progressModalTask.id,
          progressRealisasi: realisasi,
          progressNote: note,
          status,
        }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === progressModalTask.id
              ? { ...t, progressRealisasi: realisasi, progressNote: note, status }
              : t
          )
        );
        setProgressModalTask(null);
        return;
      }
    } catch (_) {}
    const next = tasks.map((t) =>
      t.id === progressModalTask.id
        ? { ...t, progressRealisasi: realisasi, progressNote: note, status }
        : t
    );
    saveTasks(next);
    setProgressModalTask(null);
  };

  const baseTasks = isCoordinator ? tasks : myTasks;
  const filteredTasks = baseTasks.filter((t) => {
    if (filter.status !== 'all' && t.status !== filter.status) return false;
    if (filter.product !== 'all' && t.product !== filter.product) return false;
    if (filter.aktivitas !== 'all' && !t.aktivitas.startsWith(filter.aktivitas)) return false;
    if (filter.pic !== 'all' && !samePic(t.pic, filter.pic)) return false;
    return true;
  });

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleImportExcel = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || !isCoordinator) return;
      setImporting(true);
      try {
        const data = await file.arrayBuffer();
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as (string | number)[][];
        if (rows.length < 2) {
          setError('File kosong atau hanya header. Minimal 1 baris data.');
          return;
        }
        const header = rows[0];
        const tugasIdx = header.indexOf('Tugas');
        const dueIdx = header.indexOf('Jatuh Tempo');
        const picIdx = header.indexOf('PIC');
        if (tugasIdx < 0 || dueIdx < 0 || picIdx < 0) {
          setError('Format Excel tidak sesuai. Gunakan file hasil Export atau kolom: Tugas, Jatuh Tempo, PIC.');
          return;
        }
        const leadIdx = header.indexOf('Lead / Perusahaan');
        const productIdx = header.indexOf('Produk');
        const aktivitasIdx = header.indexOf('Aktivitas');
        const prioritasIdx = header.indexOf('Prioritas');
        const statusIdx = header.indexOf('Status');
        const catatanIdx = header.indexOf('Catatan');
        const targetIdx = header.indexOf('Target');
        const satuanIdx = header.indexOf('Satuan');
        const progressNoteIdx = header.indexOf('Catatan Progress');
        const progressRealisasiIdx = header.indexOf('Progress Realisasi');

        const tasksToImport = rows.slice(1).map((row) => {
          const get = (i: number) => (row[i] != null ? String(row[i]).trim() : '');
          const getNum = (i: number) => {
            const v = row[i];
            if (v == null) return undefined;
            const n = Number(v);
            return isNaN(n) ? undefined : n;
          };
          let status = get(statusIdx).toLowerCase();
          if (status === 'terlambat') status = 'overdue';
          else if (status === 'selesai') status = 'done';
          else if (!status) status = 'pending';
          return {
            title: get(tugasIdx) || 'Tugas',
            leadCompany: leadIdx >= 0 ? get(leadIdx) || undefined : undefined,
            product: productIdx >= 0 ? get(productIdx) || 'MKASIR' : 'MKASIR',
            aktivitas: aktivitasIdx >= 0 ? get(aktivitasIdx) || 'digital' : 'digital',
            aktivitasLabel: aktivitasIdx >= 0 ? get(aktivitasIdx) || undefined : undefined,
            pic: get(picIdx) || 'Staff',
            dueDate: dueIdx >= 0 ? get(dueIdx) || new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            priority: prioritasIdx >= 0 ? get(prioritasIdx).toLowerCase() || 'sedang' : 'sedang',
            status,
            catatan: catatanIdx >= 0 ? get(catatanIdx) || undefined : undefined,
            targetValue: targetIdx >= 0 ? getNum(targetIdx) : undefined,
            satuan: satuanIdx >= 0 ? get(satuanIdx) || undefined : undefined,
            progressNote: progressNoteIdx >= 0 ? get(progressNoteIdx) || undefined : undefined,
            progressRealisasi: progressRealisasiIdx >= 0 ? getNum(progressRealisasiIdx) : undefined,
          };
        }).filter((t) => t.title && t.dueDate);

        if (tasksToImport.length === 0) {
          setError('Tidak ada baris valid. Kolom Tugas dan Jatuh Tempo wajib.');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch('/api/tasks/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ tasks: tasksToImport }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Gagal import');
          return;
        }
        setError(null);
        loadTasks();
      } catch (err) {
        setError('Gagal memproses file. Pastikan format .xlsx.');
      } finally {
        setImporting(false);
      }
    },
    [isCoordinator, loadTasks]
  );

  const exportToExcel = useCallback(() => {
    if (filteredTasks.length === 0) return;
    setExporting(true);
    try {
      const headers = [
        'No',
        'Tugas',
        'Lead / Perusahaan',
        'Produk',
        'Aktivitas',
        'PIC',
        'Progress Realisasi',
        'Target',
        'Satuan',
        'Catatan Progress',
        'Jatuh Tempo',
        'Prioritas',
        'Status',
        'Catatan',
        'Link Bukti',
        'Disetujui',
        'Tanggal Buat',
      ];
      const rows = filteredTasks.map((t, i) => [
        i + 1,
        t.title ?? '',
        t.leadCompany ?? '',
        t.product ?? '',
        t.aktivitasLabel ?? '',
        t.pic ?? '',
        t.progressRealisasi ?? '',
        t.targetValue ?? '',
        t.satuan ?? '',
        t.progressNote ?? '',
        t.dueDate ?? '',
        t.priority ?? '',
        t.status === 'overdue' ? 'Terlambat' : t.status === 'done' ? 'Selesai' : 'Pending',
        t.catatan ?? '',
        Array.isArray(t.evidenceLinks) ? t.evidenceLinks.join('; ') : '',
        t.approvedAt ?? '',
        t.createdAt ?? '',
      ]);
      const wsData = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tugas');
      const fileName = `tugas-dan-tindak-lanjut-${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } finally {
      setExporting(false);
    }
  }, [filteredTasks]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Tugas & Tindak Lanjut"
          subtitle={isCoordinator ? 'Kelola tugas dan assign ke PIC. Staff melihat tugas yang ditunjuk dan update progress.' : 'Tugas yang ditugaskan ke Anda. Update progress di sini.'}
          badge={{ icon: 'ri-task-line', text: 'Eksekusi' }}
          variant="amber"
        >
          {isCoordinator && (
            <div className="flex items-center gap-3">
              <select
                value={filter.status}
                onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="overdue">Terlambat</option>
                <option value="done">Selesai</option>
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line text-lg w-5 h-5"></i>
                Tambah Tugas
              </button>
            </div>
          )}
        </PageHero>

        {/* Staff: Dashboard Tugas Saya */}
        {!isCoordinator && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm border-l-4 border-l-amber-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <i className="ri-time-line text-2xl text-amber-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tugas Menunggu</p>
                  <p className="text-2xl font-bold text-gray-900">{myPending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm border-l-4 border-l-green-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{myDone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <PageCard accent="amber" icon="ri-task-line"           title={isCoordinator ? 'Daftar Tugas' : 'Tugas Saya'}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center justify-between gap-2">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} className="text-red-500 hover:text-red-700" aria-label="Tutup">×</button>
            </div>
          )}
          <p className="text-sm text-gray-600 mb-4">
            {isCoordinator ? 'Tugas yang Anda assign ke PIC. Staff update progress dan upload bukti di halaman detail tugas.' : 'Tugas yang koordinator berikan ke Anda. Klik judul tugas untuk buka detail: di sana Anda bisa update progress (realisasi, status) dan upload bukti.'}
          </p>
          {isCoordinator && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <select
                value={filter.product}
                onChange={(e) => setFilter((f) => ({ ...f, product: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua Produk</option>
                {productList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={filter.aktivitas}
                onChange={(e) => setFilter((f) => ({ ...f, aktivitas: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {filterChanelOptions.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <select
                value={filter.pic}
                onChange={(e) => setFilter((f) => ({ ...f, pic: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Semua PIC</option>
                {picList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                ref={importFileRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportExcel}
              />
              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                disabled={importing}
                className="px-4 py-2 border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {importing ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-upload-line"></i>}
                Import dari Excel
              </button>
              <button
                type="button"
                onClick={exportToExcel}
                disabled={exporting || filteredTasks.length === 0}
                className="px-4 py-2 border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-excel-2-line"></i>}
                Export ke Excel
              </button>
            </div>
          )}
          {!isCoordinator && (
            <div className="flex justify-end gap-2 mb-4">
              <button
                type="button"
                onClick={exportToExcel}
                disabled={exporting || filteredTasks.length === 0}
                className="px-4 py-2 border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-excel-2-line"></i>}
                Export ke Excel
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tugas</th>
                  {isCoordinator && <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Lead / Perusahaan</th>}
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Produk</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aktivitas</th>
                  {isCoordinator && <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">PIC</th>}
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Jatuh Tempo</th>
                  {isCoordinator && <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Prioritas</th>}
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={isCoordinator ? 10 : 7} className="py-8 text-center text-gray-500">
                      {isCoordinator ? 'Tidak ada tugas. Klik Tambah Tugas untuk assign ke staff.' : 'Belum ada tugas yang ditugaskan ke Anda. Koordinator akan assign tugas; klik tugas untuk buka detail, update progress, dan upload bukti.'}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link href={`/execution/tasks/${t.id}`} className="flex items-center gap-2 group">
                          <i className="ri-task-line text-gray-400 w-5 h-5 flex-shrink-0 group-hover:text-amber-500"></i>
                          <span className="font-medium text-gray-900 group-hover:text-amber-700 underline-offset-2 group-hover:underline">{t.title}</span>
                        </Link>
                      </td>
                      {isCoordinator && <td className="py-3 px-4 text-gray-700">{t.leadCompany || '–'}</td>}
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">{t.product}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{t.aktivitasLabel}</td>
                      {isCoordinator && (
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800">{t.pic}</span>
                        </td>
                      )}
                      <td className="py-3 px-4 text-gray-700">
                        {t.targetValue != null ? (
                          <span className="tabular-nums">{t.progressRealisasi ?? '–'} / {t.targetValue} {t.satuan || ''}</span>
                        ) : (
                          t.progressRealisasi != null ? <span className="tabular-nums">{t.progressRealisasi} {t.satuan || ''}</span> : '–'
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{t.dueDate}</td>
                      {isCoordinator && (
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(t.status)}`}>
                          {t.status === 'overdue' ? 'Terlambat' : t.status === 'done' ? 'Selesai' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleStatus(t.id, t.status)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                            title={t.status === 'done' ? 'Tandai pending' : 'Tandai selesai'}
                          >
                            <i className={t.status === 'done' ? 'ri-checkbox-blank-line' : 'ri-checkbox-circle-line'}></i>
                          </button>
                          {t.leadId != null && (
                            <Link href={`/crm/lead-details/${t.leadId}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Lihat lead">
                              <i className="ri-eye-line w-5 h-5"></i>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </PageCard>
      </div>

      {/* Modal Tambah Tugas (koordinator) */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Tambah Tugas</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleAddTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chanel *</label>
                  <select
                    value={form.chanel}
                    onChange={(e) => setForm((f) => ({ ...f, chanel: e.target.value, kegiatan: '' }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="">Pilih chanel</option>
                    {channelList.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan (Judul Tugas) *</label>
                  <select
                    value={form.kegiatan}
                    onChange={(e) => {
                      const val = e.target.value;
                      const opt = activityOptions.find((a) => a.value === val);
                      setForm((f) => ({
                        ...f,
                        kegiatan: val,
                        title: opt?.activityLabel ?? '',
                        satuan: opt?.satuan ? (f.satuan || opt.satuan) : f.satuan,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                    disabled={!form.chanel}
                  >
                    <option value="">Pilih kegiatan</option>
                    {kegiatanOptions.map((a) => (
                      <option key={a.value} value={a.value}>{a.activityLabel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead / Perusahaan (opsional)</label>
                  <input type="text" value={form.leadCompany} onChange={(e) => setForm((f) => ({ ...f, leadCompany: e.target.value }))} placeholder="Nama lead atau perusahaan" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
                  <select value={form.product} onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {productList.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIC / Staff *</label>
                    <select value={form.pic} onChange={(e) => setForm((f) => ({ ...f, pic: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                      <option value="">Pilih PIC</option>
                      {picList.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo *</label>
                    <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target (opsional)</label>
                    <input type="number" min={0} value={form.targetValue} onChange={(e) => setForm((f) => ({ ...f, targetValue: e.target.value }))} placeholder="Contoh: 10" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Satuan (opsional)</label>
                    <input type="text" value={form.satuan} onChange={(e) => setForm((f) => ({ ...f, satuan: e.target.value }))} placeholder="Konten, Kunjungan, dll" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                  <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {TASK_PRIORITY.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                  <textarea value={form.catatan} onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))} placeholder="Catatan tambahan" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold">Simpan Tugas</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Modal Update Progress (staff) */}
      {progressModalTask && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setProgressModalTask(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Input Progress</h3>
              <p className="text-sm text-gray-600 mb-4">{progressModalTask.title}</p>
              <p className="text-xs text-gray-500 mb-4">Isi realisasi yang sudah dicapai agar koordinator (Nina) bisa memantau. Misal target 10, baru dapat 5 — ketik 5.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Realisasi {progressModalTask.targetValue != null ? `(target: ${progressModalTask.targetValue} ${progressModalTask.satuan || ''})` : ''}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={progressForm.realisasi}
                    onChange={(e) => setProgressForm((f) => ({ ...f, realisasi: e.target.value }))}
                    placeholder={progressModalTask.targetValue != null ? `Contoh: 5 dari ${progressModalTask.targetValue}` : 'Angka yang sudah dicapai'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={progressForm.status} onChange={(e) => setProgressForm((f) => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="pending">Pending</option>
                    <option value="overdue">Terlambat</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan progress (opsional)</label>
                  <textarea value={progressForm.note} onChange={(e) => setProgressForm((f) => ({ ...f, note: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Catatan tambahan untuk koordinator" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setProgressModalTask(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="button" onClick={saveProgress} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold">Simpan</button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
