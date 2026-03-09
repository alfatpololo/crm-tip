'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import { useTeamMembers, teamMemberDisplay } from '@/lib/useTeamAndProducts';
import { supabase } from '@/lib/supabase/client';

type ContentPlanEntry = {
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

export default function ContentPlanDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { users } = useTeamMembers();
  const [plan, setPlan] = useState<ContentPlanEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const picUser = plan ? users.find((u) => u.email === plan.pic) : null;
  const picLabel = plan ? (picUser ? teamMemberDisplay(picUser) : (plan.pic?.split('@')[0] ?? plan.pic ?? '–')) : '';

  const fetchPlan = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`/api/content-planner/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Rencana tidak ditemukan');
        setPlan(null);
        return;
      }
      setPlan(json.plan);
    } catch {
      setError('Gagal memuat data');
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <i className="ri-loader-4-line animate-spin text-4xl text-amber-600"></i>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !plan) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Link href="/execution/content-planner" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
            <i className="ri-arrow-left-line"></i> Kembali ke Daftar
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
            {error ?? 'Rencana tidak ditemukan'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusLabel = plan.status ? plan.status.charAt(0).toUpperCase() + plan.status.slice(1) : '–';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/execution/content-planner" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
          <i className="ri-arrow-left-line"></i> Kembali ke Daftar
        </Link>

        <PageCard accent="amber" icon="ri-calendar-event-line" title="Detail Rencana Posting">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nama Aplikasi</dt>
              <dd className="mt-1 text-gray-900 font-medium">{plan.namaAplikasi}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rencana Posting</dt>
              <dd className="mt-1 text-gray-900">{plan.rencanaPosting}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-gray-900 capitalize">{statusLabel}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">PIC</dt>
              <dd className="mt-1 text-gray-900">{picLabel}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Topic</dt>
              <dd className="mt-1 text-gray-900">{plan.topic || '–'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Goals Content</dt>
              <dd className="mt-1 text-gray-900">{plan.goalsContent || '–'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Content Pillar</dt>
              <dd className="mt-1 text-gray-900">{plan.contentPillar || '–'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type of Content</dt>
              <dd className="mt-1 text-gray-900">{plan.typeOfContent || '–'}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Reference / Nama File</dt>
              <dd className="mt-1 text-gray-900">{plan.referenceFileName || '–'}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Link / Attachment</dt>
              <dd className="mt-1">
                {plan.link ? (
                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 underline break-all"
                  >
                    {plan.link}
                  </a>
                ) : (
                  <span className="text-gray-500">–</span>
                )}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Caption</dt>
              <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{plan.caption || '–'}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Revisi</dt>
              <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{plan.revisi || '–'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Acc to Posting</dt>
              <dd className="mt-1 text-gray-900">{plan.accToPosting ? 'Ya' : 'Tidak'}</dd>
            </div>
          </div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
