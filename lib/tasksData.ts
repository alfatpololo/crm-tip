/**
 * Tugas & Tindak Lanjut — sesuai standar KPI, produk (MKASIR & DISIPLINKU), dan aktivitas/channel.
 * Staff yang terlibat bisa input tugas di halaman Tugas & Tindak Lanjut.
 */

export const TASKS_STORAGE_KEY = 'crm-tip-tugas-tindak-lanjut';

export const TASK_PRODUCTS = ['MKASIR', 'DISIPLINKU'] as const;
export const TASK_AKTIVITAS = [
  { value: 'digital', label: 'Digital Marketing' },
  { value: 'komunitas', label: 'Komunitas' },
  { value: 'kemitraan', label: 'Kemitraan Corporate' },
  { value: 'canvassing', label: 'Canvassing' },
  { value: 'customer', label: 'Customer Handling' },
] as const;
export const TASK_PRIORITY = ['tinggi', 'sedang', 'rendah'] as const;
export const TASK_STATUS = ['pending', 'overdue', 'done'] as const;

export type TaskRecord = {
  id: string;
  title: string;
  leadCompany?: string;
  product: string;
  aktivitas: string;
  aktivitasLabel: string;
  pic: string;
  dueDate: string;
  priority: string;
  status: string;
  catatan?: string;
  leadId?: number;
  createdAt: string;
  createdBy?: string;
  /** Target nilai (dari koordinator) */
  targetValue?: number;
  /** Satuan target (e.g. Konten, Kunjungan) */
  satuan?: string;
  /** Realisasi progress yang di-input staff */
  progressRealisasi?: number;
  /** Catatan progress terakhir */
  progressNote?: string;
  /** Link bukti (URL) yang di-attach staff */
  evidenceLinks?: string[];
  /** Catatan bukti */
  evidenceNote?: string;
  /** Waktu koordinator setuju / checklist */
  approvedAt?: string;
  /** User id koordinator yang approve */
  approvedBy?: string;
};

export function loadTasksFromStorage(): TaskRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasksToStorage(tasks: TaskRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}
