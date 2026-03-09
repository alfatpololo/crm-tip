'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import { useTeamMembers, teamMemberDisplay } from '@/lib/useTeamAndProducts';
import { useProducts } from '@/lib/useTeamAndProducts';

const CONTENT_PLANNER_KEY = 'crm-tip-content-planner';

const STATUS_OPTIONS = [
  { value: 'concept', label: 'Concept' },
  { value: 'scripting', label: 'Scripting' },
  { value: 'editing', label: 'Editing' },
  { value: 'revisi', label: 'Revisi' },
  { value: 'posting', label: 'Posting' },
];

const GOALS_OPTIONS = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'consideration', label: 'Consideration' },
  { value: 'conversion', label: 'Conversion' },
];

const PILLAR_OPTIONS = [
  { value: 'edukasi', label: 'Edukasi' },
  { value: 'entertaint', label: 'Entertaint' },
  { value: 'fitur', label: 'Fitur' },
  { value: 'testimoni', label: 'Testimoni' },
  { value: 'promosi', label: 'Promosi' },
];

const TYPE_OPTIONS = [
  { value: 'feed', label: 'Feed' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'reels', label: 'Reels' },
  { value: 'story', label: 'Story' },
];

export type ContentPlanEntry = {
  id: string;
  namaAplikasi: string;
  rencanaPosting: string;
  status: string;
  pic: string;
  topic: string;
  goalsContent: string;
  contentPillar: string;
  typeOfContent: string;
  referenceFileName?: string;
  link: string;
  caption: string;
  revisi: string;
  accToPosting: boolean;
  createdAt: string;
};

const defaultForm = (): Omit<ContentPlanEntry, 'id' | 'createdAt'> => ({
  namaAplikasi: '',
  rencanaPosting: new Date().toISOString().slice(0, 10),
  status: 'concept',
  pic: '',
  topic: '',
  goalsContent: 'awareness',
  contentPillar: 'edukasi',
  typeOfContent: 'feed',
  link: '',
  caption: '',
  revisi: '',
  accToPosting: false,
});

function loadPlans(): ContentPlanEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CONTENT_PLANNER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ContentPlannerPage() {
  const { users } = useTeamMembers();
  const { products } = useProducts();
  const [plans, setPlans] = useState<ContentPlanEntry[]>([]);
  const [form, setForm] = useState(defaultForm());

  const productOptions = useMemo(() => (products.length > 0 ? products : [{ key: 'mkasir', name: 'MKASIR' }, { key: 'disiplinku', name: 'DISIPLINKU' }]), [products]);
  const picOptions = useMemo(() => {
    if (users.length > 0) return users.map((u) => ({ value: u.email, label: teamMemberDisplay(u) }));
    return ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi'].map((name) => ({ value: name, label: name }));
  }, [users]);

  useEffect(() => {
    setPlans(loadPlans());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setPlans(loadPlans()), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaAplikasi || !form.pic) return;
    const entry: ContentPlanEntry = {
      ...form,
      id: `cp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...plans];
    setPlans(next);
    if (typeof window !== 'undefined') localStorage.setItem(CONTENT_PLANNER_KEY, JSON.stringify(next));
    setForm(defaultForm());
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Content Planner"
          subtitle="Rencana posting, status, PIC, topic, goals content, pillar, type of content."
          badge={{ icon: 'ri-calendar-event-line', text: 'Planner' }}
          variant="amber"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PageCard accent="amber" icon="ri-add-circle-line" title="Tambah Rencana">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
                  <select
                    value={form.namaAplikasi}
                    onChange={(e) => setForm((f) => ({ ...f, namaAplikasi: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Pilih</option>
                    {productOptions.map((p) => (
                      <option key={p.key} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Posting</label>
                  <input
                    type="date"
                    value={form.rencanaPosting}
                    onChange={(e) => setForm((f) => ({ ...f, rencanaPosting: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIC</label>
                  <select
                    value={form.pic}
                    onChange={(e) => setForm((f) => ({ ...f, pic: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Pilih PIC</option>
                    {picOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Topic konten"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goals Content</label>
                  <select
                    value={form.goalsContent}
                    onChange={(e) => setForm((f) => ({ ...f, goalsContent: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {GOALS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Pillar</label>
                  <select
                    value={form.contentPillar}
                    onChange={(e) => setForm((f) => ({ ...f, contentPillar: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {PILLAR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Content</label>
                  <select
                    value={form.typeOfContent}
                    onChange={(e) => setForm((f) => ({ ...f, typeOfContent: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Caption"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revisi</label>
                  <textarea
                    value={form.revisi}
                    onChange={(e) => setForm((f) => ({ ...f, revisi: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Catatan revisi"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="accToPosting"
                    checked={form.accToPosting}
                    onChange={(e) => setForm((f) => ({ ...f, accToPosting: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="accToPosting" className="text-sm font-medium text-gray-700">Acc to Posting</label>
                </div>
                <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm">
                  Simpan Rencana
                </button>
              </form>
            </PageCard>
          </div>

          <div className="lg:col-span-2">
            <PageCard accent="slate" icon="ri-calendar-check-line" title="Daftar Rencana Posting">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Tanggal</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Aplikasi</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Status</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">PIC</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Topic</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">Belum ada rencana. Isi form di kiri.</td>
                      </tr>
                    ) : (
                      plans.map((p) => (
                        <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                          <td className="py-2 px-2 text-gray-700">{p.rencanaPosting}</td>
                          <td className="py-2 px-2 font-medium text-gray-900">{p.namaAplikasi}</td>
                          <td className="py-2 px-2"><span className="capitalize">{p.status}</span></td>
                          <td className="py-2 px-2 text-gray-700">{picOptions.find((o) => o.value === p.pic)?.label ?? p.pic?.split('@')[0] ?? p.pic}</td>
                          <td className="py-2 px-2 text-gray-700 line-clamp-1">{p.topic || '–'}</td>
                          <td className="py-2 px-2 text-gray-600">{p.typeOfContent}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
