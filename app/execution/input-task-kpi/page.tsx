'use client';

import { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import InputLaporanPekerjaan, { type ActivityOption } from '@/components/marketing/InputLaporanPekerjaan';
import { useTeamMembers, teamMemberDisplay, useProducts } from '@/lib/useTeamAndProducts';
import { getActivityOptionsForInputTask } from '@/lib/activityOptions';

export default function InputTaskKPIPage() {
  const { users } = useTeamMembers();
  const { products } = useProducts();
  const activityOptions = useMemo(() => getActivityOptionsForInputTask(), []);
  const teamMemberOptions = useMemo(() => users.map((u) => teamMemberDisplay(u)), [users]);
  const productOptions = useMemo(
    () => (products.length > 0 ? products.map((p) => ({ value: p.name, label: p.name })) : [{ value: 'MKASIR', label: 'MKASIR' }, { value: 'DISIPLINKU', label: 'DISIPLINKU' }]),
    [products]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Input Task KPI"
          subtitle="Input laporan pekerjaan harian: pilih PIC, produk, tipe aktivitas (chanel), dan realisasi."
          badge={{ icon: 'ri-checkbox-circle-line', text: 'Task KPI' }}
          variant="blue"
        />

        <InputLaporanPekerjaan
          activityOptions={activityOptions as ActivityOption[]}
          teamMembers={teamMemberOptions.length > 0 ? teamMemberOptions : ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi']}
          products={productOptions}
        />
      </div>
    </DashboardLayout>
  );
}
