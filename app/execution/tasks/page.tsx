'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import {
  TASK_PRODUCTS,
  TASK_AKTIVITAS,
  TASK_PRIORITY,
  loadTasksFromStorage,
  saveTasksToStorage,
  type TaskRecord,
} from '@/lib/tasksData';
import { PIC_OPTIONS } from '@/lib/leadsData';

const defaultTasks: TaskRecord[] = [
  { id: '1', title: 'Follow-up Budi Santoso', leadCompany: 'Toko Maju Jaya', product: 'MKASIR', aktivitas: 'digital', aktivitasLabel: 'Digital Marketing', pic: 'Ilham', dueDate: '2024-01-16', priority: 'tinggi', status: 'pending', leadId: 1, createdAt: new Date().toISOString() },
  { id: '2', title: 'Kirim proposal ke Siti Rahayu', leadCompany: 'Warung Sejahtera Depok', product: 'MKASIR', aktivitas: 'komunitas', aktivitasLabel: 'Komunitas', pic: 'Robby', dueDate: '2024-01-15', priority: 'tinggi', status: 'overdue', leadId: 2, createdAt: new Date().toISOString() },
  { id: '3', title: 'Jadwalkan demo Ahmad Fauzi', leadCompany: 'RM Sederhana', product: 'MKASIR', aktivitas: 'kemitraan', aktivitasLabel: 'Kemitraan Corporate', pic: 'Nina', dueDate: '2024-01-17', priority: 'sedang', status: 'pending', leadId: 3, createdAt: new Date().toISOString() },
  { id: '4', title: 'Email follow-up Dewi Lestari', leadCompany: 'Minimarket Citra', product: 'DISIPLINKU', aktivitas: 'customer', aktivitasLabel: 'Customer Handling', pic: 'Radi', dueDate: '2024-01-18', priority: 'rendah', status: 'pending', leadId: 4, createdAt: new Date().toISOString() },
  { id: '5', title: 'Persiapan presentasi Kafe 99', leadCompany: 'Kafe 99', product: 'MKASIR', aktivitas: 'canvassing', aktivitasLabel: 'Canvassing', pic: 'Jemi', dueDate: '2024-01-14', priority: 'tinggi', status: 'done', leadId: 5, createdAt: new Date().toISOString() },
];

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', product: 'all', aktivitas: 'all', pic: 'all' });
  const [form, setForm] = useState({
    title: '',
    leadCompany: '',
    product: 'MKASIR',
    aktivitas: 'digital',
    pic: '',
    dueDate: new Date().toISOString().slice(0, 10),
    priority: 'sedang',
    catatan: '',
  });

  useEffect(() => {
    const stored = loadTasksFromStorage();
    if (stored.length > 0) {
      setTasks(stored);
    } else {
      saveTasksToStorage(defaultTasks);
      setTasks(defaultTasks);
    }
  }, []);

  const saveTasks = (next: TaskRecord[]) => {
    setTasks(next);
    saveTasksToStorage(next);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.pic) return;
    const aktivitasLabel = TASK_AKTIVITAS.find((a) => a.value === form.aktivitas)?.label ?? form.aktivitas;
    const newTask: TaskRecord = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: form.title.trim(),
      leadCompany: form.leadCompany.trim() || undefined,
      product: form.product,
      aktivitas: form.aktivitas,
      aktivitasLabel,
      pic: form.pic,
      dueDate: form.dueDate,
      priority: form.priority,
      status: 'pending',
      catatan: form.catatan.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    saveTasks([newTask, ...tasks]);
    setForm({
      title: '',
      leadCompany: '',
      product: 'MKASIR',
      aktivitas: 'digital',
      pic: '',
      dueDate: new Date().toISOString().slice(0, 10),
      priority: 'sedang',
      catatan: '',
    });
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const next = tasks.map((t) =>
      t.id === id ? { ...t, status: currentStatus === 'done' ? 'pending' : 'done' } : t
    );
    saveTasks(next);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter.status !== 'all' && t.status !== filter.status) return false;
    if (filter.product !== 'all' && t.product !== filter.product) return false;
    if (filter.aktivitas !== 'all' && t.aktivitas !== filter.aktivitas) return false;
    if (filter.pic !== 'all' && t.pic !== filter.pic) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Tugas & Tindak Lanjut"
          subtitle="Staff input tugas sesuai standar KPI, produk (MKASIR & DISIPLINKU), dan aktivitas. Kelola reminder follow-up."
          badge={{ icon: 'ri-task-line', text: 'Eksekusi' }}
          variant="amber"
        >
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
        </PageHero>

        <PageCard accent="amber" icon="ri-task-line" title="Daftar Tugas">
          <p className="text-sm text-gray-600 mb-4">Tugas mengacu produk (MKASIR & DISIPLINKU) dan aktivitas/KPI channel. Staff yang terlibat bisa menambah dan mengelola tugas di sini.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <select
              value={filter.product}
              onChange={(e) => setFilter((f) => ({ ...f, product: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Semua Produk</option>
              {TASK_PRODUCTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filter.aktivitas}
              onChange={(e) => setFilter((f) => ({ ...f, aktivitas: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Semua Aktivitas</option>
              {TASK_AKTIVITAS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <select
              value={filter.pic}
              onChange={(e) => setFilter((f) => ({ ...f, pic: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Semua PIC</option>
              {PIC_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tugas</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Lead / Perusahaan</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Produk</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aktivitas</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">PIC</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Jatuh Tempo</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Prioritas</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      Tidak ada tugas. Klik &quot;Tambah Tugas&quot; untuk input tugas baru (sesuai produk & aktivitas KPI).
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <i className="ri-task-line text-gray-400 w-5 h-5 flex-shrink-0"></i>
                          <span className="font-medium text-gray-900">{t.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{t.leadCompany || '–'}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">{t.product}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{t.aktivitasLabel}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800">{t.pic}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{t.dueDate}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                      </td>
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
                            <Link
                              href={`/crm/lead-details/${t.leadId}`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Lihat lead"
                            >
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

      {/* Modal Tambah Tugas */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Contoh: Follow-up demo, Kirim proposal..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead / Perusahaan (opsional)</label>
                  <input
                    type="text"
                    value={form.leadCompany}
                    onChange={(e) => setForm((f) => ({ ...f, leadCompany: e.target.value }))}
                    placeholder="Nama lead atau perusahaan"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
                    <select
                      value={form.product}
                      onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {TASK_PRODUCTS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas (KPI) *</label>
                    <select
                      value={form.aktivitas}
                      onChange={(e) => setForm((f) => ({ ...f, aktivitas: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {TASK_AKTIVITAS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIC / Staff *</label>
                    <select
                      value={form.pic}
                      onChange={(e) => setForm((f) => ({ ...f, pic: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="">Pilih PIC</option>
                      {PIC_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo *</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioritas</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {TASK_PRIORITY.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                  <textarea
                    value={form.catatan}
                    onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
                    placeholder="Catatan tambahan"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold"
                  >
                    Simpan Tugas
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
