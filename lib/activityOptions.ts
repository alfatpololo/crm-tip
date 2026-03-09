/**
 * Opsi aktivitas untuk Input Task KPI (tanpa angka romawi di label).
 */

export type ActivityOption = {
  value: string;
  sectionLabel: string;
  activityLabel: string;
  satuan: string;
};

/** Hapus prefix romawi (I. II. III. IV.) saja, jangan sampai "Customer" jadi "ustomer" karena C ke-strip. */
function chanelLabel(section: string): string {
  return section.replace(/^(I{1,3}|IV|VI{0,3}|IX|XI{0,3})\.?\s*/i, '').trim() || section;
}

export function getActivityOptionsForInputTask(): ActivityOption[] {
  const sections = [
    { id: 'digital', label: 'Digital', rows: [
      { uraian: 'Upload Konten Instagram', satuan: 'Konten' },
      { uraian: 'Followers Instagram', satuan: 'Followers' },
      { uraian: 'Upload Konten Facebook', satuan: 'Konten' },
      { uraian: 'Upload Konten TikTok', satuan: 'Konten' },
      { uraian: 'Upload Konten Youtube', satuan: 'Konten' },
      { uraian: 'Subscribers Youtube', satuan: 'Subscribers' },
    ]},
    { id: 'komunitas', label: 'Komunitas', rows: [
      { uraian: 'Join Group UMKM', satuan: 'Grup' },
      { uraian: 'Duta Merchant', satuan: 'Customer' },
      { uraian: 'Join Group Bisnis', satuan: 'Grup' },
      { uraian: 'FAKTA / Karang Taruna', satuan: 'Kegiatan' },
    ]},
    { id: 'canvassing', label: 'Canvassing', rows: [
      { uraian: 'Kunjungan MKASIR Retail', satuan: 'Kunjungan' },
      { uraian: 'Lead MKASIR Retail', satuan: 'Lead' },
      { uraian: 'Kunjungan DISIPLINKU', satuan: 'Kunjungan' },
      { uraian: 'Lead DISIPLINKU', satuan: 'Lead' },
    ]},
    { id: 'customer', label: 'Customer', rows: [
      { uraian: 'Customer baru berbayar MKASIR', satuan: 'Customer' },
      { uraian: 'Customer churn MKASIR', satuan: 'Customer' },
      { uraian: 'Handling Complain/Info', satuan: 'Customer' },
      { uraian: 'Caring DISIPLINKU', satuan: 'Perusahaan' },
    ]},
  ];
  const out: ActivityOption[] = [];
  sections.forEach(({ id, label, rows }) => {
    const sectionLabel = chanelLabel(label);
    rows.forEach((row, i) => {
      out.push({
        value: `${id}-${i}`,
        sectionLabel,
        activityLabel: row.uraian,
        satuan: row.satuan,
      });
    });
  });
  return out;
}
