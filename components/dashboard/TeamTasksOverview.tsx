'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTasksFromStorage, type TaskRecord } from '@/lib/tasksData';

const MAX_PENDING = 10;

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return s;
  }
}

export default function TeamTasksOverview() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);

  useEffect(() => {
    const list = loadTasksFromStorage();
    setTasks(list);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(loadTasksFromStorage());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'overdue');
  const overdue = tasks.filter((t) => t.status === 'overdue');
  const toShow = pending.slice(0, MAX_PENDING);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-md shadow-gray-200/40 overflow-hidden border-l-4 border-l-amber-500">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50/80 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center ring-2 ring-white/80 shadow-sm">
              <i className="ri-task-line text-2xl text-amber-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Tugas Tim</h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Tugas pending & tindak lanjut per PIC · {overdue.length > 0 && <span className="text-red-600 font-medium">{overdue.length} terlambat</span>}
              </p>
            </div>
          </div>
          <Link
            href="/execution/tasks"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 whitespace-nowrap"
          >
            Kelola tugas <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
      <div className="p-4">
        {toShow.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            <i className="ri-checkbox-circle-line text-3xl text-gray-300 block mb-2"></i>
            Tidak ada tugas pending. Tambah tugas di <Link href="/execution/tasks" className="text-amber-600 hover:underline">Tugas & Tindak Lanjut</Link>.
          </div>
        ) : (
          <ul className="space-y-2 max-h-[280px] overflow-y-auto">
            {toShow.map((t) => (
              <li
                key={t.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 border border-transparent hover:border-gray-100"
              >
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {t.pic.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="text-amber-700 font-medium">{t.pic}</span>
                    {' · '}{t.product} · {t.aktivitasLabel} · Jatuh tempo {formatDate(t.dueDate)}
                    {t.status === 'overdue' && <span className="text-red-600 font-medium ml-1">· Terlambat</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
