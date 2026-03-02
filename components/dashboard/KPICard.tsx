export default function KPICard({
  title,
  value,
  change,
  trend,
  subtitle,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  subtitle: string;
}) {
  const isUp = trend === 'up';
  return (
    <div
      className={`
        bg-white rounded-2xl p-6 border border-gray-200/90 border-l-4 shadow-md shadow-gray-200/40
        hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-200
        ${isUp ? 'border-l-emerald-500' : 'border-l-rose-500'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{value}</h3>
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div
          className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap
            ${isUp ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/50'}
          `}
        >
          <i className={`${isUp ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-sm`}></i>
          {change}
        </div>
      </div>
    </div>
  );
}