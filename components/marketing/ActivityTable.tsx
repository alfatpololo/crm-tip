'use client';

export type ActivityRow = {
  no?: string;
  namaKegiatan: string;
  uraian: string;
  targetMin: string | number;
  targetBln: string | number;
  satuan: string;
  pic: string;
  isSub?: boolean;
  /** Realisasi (pencapaian aktual) untuk hitungan KPI */
  realisasi?: number;
};

type ActivityTableProps = {
  title: string;
  subtitle?: string;
  rows: ActivityRow[];
  icon?: string;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'violet';
  /** Id section untuk mapping realisasi dari laporan (contoh: idigital). Dipakai dengan realisasiByKey. */
  sectionId?: string;
  /** Realisasi per baris dari input laporan: key = sectionId + '-' + index baris. */
  realisasiByKey?: Record<string, number>;
};

const accentStyles = {
  blue: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-500/5',
    headerBg: 'bg-gradient-to-r from-blue-50 to-white',
    badge: 'bg-blue-100 text-blue-800',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  emerald: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-500/5',
    headerBg: 'bg-gradient-to-r from-emerald-50 to-white',
    badge: 'bg-emerald-100 text-emerald-800',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
  },
  amber: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-500/5',
    headerBg: 'bg-gradient-to-r from-amber-50 to-white',
    badge: 'bg-amber-100 text-amber-800',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  violet: {
    border: 'border-l-violet-500',
    bg: 'bg-violet-500/5',
    headerBg: 'bg-gradient-to-r from-violet-50 to-white',
    badge: 'bg-violet-100 text-violet-800',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
  },
};

export default function ActivityTable({
  title,
  subtitle,
  rows,
  icon = 'ri-file-list-3-line',
  accentColor = 'blue',
  sectionId,
  realisasiByKey,
}: ActivityTableProps) {
  const style = accentStyles[accentColor];

  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden ${style.border} border-l-4`}
      id={title.replace(/[.\s]/g, '').toLowerCase()}
    >
      <div className={`${style.headerBg} px-6 py-5 border-b border-gray-100`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
            <i className={`${icon} text-2xl ${style.iconText}`}></i>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600 mt-1 max-w-2xl">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">No</th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[160px]">Nama Kegiatan</th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[220px]">Uraian</th>
              <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Target Min</th>
              <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Target Bln</th>
              <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Realisasi</th>
              <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">% Tercapai</th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Satuan</th>
              <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">PIC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => {
              const realisasiFromLaporan = sectionId && realisasiByKey ? realisasiByKey[`${sectionId}-${i}`] : undefined;
              const displayRealisasi = realisasiFromLaporan !== undefined ? realisasiFromLaporan : row.realisasi;
              return (
              <tr
                key={i}
                className={`
                  transition-colors
                  ${row.isSub ? `${style.bg} hover:bg-opacity-80` : 'bg-white hover:bg-gray-50/50'}
                  ${!row.namaKegiatan && row.uraian ? 'border-l-2 border-l-gray-200' : ''}
                `}
              >
                <td className="py-3.5 px-5 text-sm text-gray-500 font-medium tabular-nums">{row.no || '–'}</td>
                <td className={`py-3.5 px-5 text-sm ${row.isSub ? 'pl-8 text-gray-800' : 'font-semibold text-gray-900'}`}>
                  {row.namaKegiatan || (row.uraian ? '—' : '')}
                </td>
                <td className="py-3.5 px-5 text-sm text-gray-600 leading-snug">{row.uraian}</td>
                <td className="py-3.5 px-5 text-right">
                  {row.targetMin !== '' && row.targetMin !== undefined ? (
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 font-semibold text-sm tabular-nums">
                      {String(row.targetMin)}
                    </span>
                  ) : (
                    <span className="text-gray-400">–</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  {row.targetBln !== '' && row.targetBln !== undefined ? (
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 font-semibold text-sm tabular-nums">
                      {String(row.targetBln)}
                    </span>
                  ) : (
                    <span className="text-gray-400">–</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  {displayRealisasi !== undefined && displayRealisasi !== null ? (
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-semibold text-sm tabular-nums">
                      {String(displayRealisasi)}
                    </span>
                  ) : (
                    <span className="text-gray-400">–</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  {(() => {
                    const target = typeof row.targetMin === 'number' ? row.targetMin : typeof row.targetBln === 'number' ? (row.targetBln as number) / 12 : null;
                    const real = displayRealisasi;
                    if (target == null || real == null || target === 0) return <span className="text-gray-400">–</span>;
                    const pct = Math.round((real / target) * 100);
                    const ok = pct >= 100;
                    const warn = pct >= 70 && pct < 100;
                    return (
                      <span className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded-lg text-xs font-bold tabular-nums ${ok ? 'bg-green-100 text-green-800' : warn ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                        {pct}%
                      </span>
                    );
                  })()}
                </td>
                <td className="py-3.5 px-5 text-sm text-gray-600">{row.satuan || '–'}</td>
                <td className="py-3.5 px-5">
                  {row.pic ? (
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${style.badge}`}>
                      {row.pic}
                    </span>
                  ) : (
                    <span className="text-gray-400">–</span>
                  )}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
