'use client';

type Accent = 'blue' | 'emerald' | 'amber' | 'violet' | 'slate' | 'rose' | 'cyan' | 'fuchsia' | 'indigo';

type PageCardProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  accent?: Accent;
  className?: string;
};

const accentStyles: Record<Accent, { border: string; headerBg: string; iconBg: string; iconText: string }> = {
  blue: {
    border: 'border-l-blue-500',
    headerBg: 'bg-gradient-to-r from-blue-50 via-sky-50/80 to-white',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  emerald: {
    border: 'border-l-emerald-500',
    headerBg: 'bg-gradient-to-r from-emerald-50 via-green-50/80 to-white',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
  },
  amber: {
    border: 'border-l-amber-500',
    headerBg: 'bg-gradient-to-r from-amber-50 via-yellow-50/80 to-white',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  violet: {
    border: 'border-l-violet-500',
    headerBg: 'bg-gradient-to-r from-violet-50 via-purple-50/80 to-white',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
  },
  slate: {
    border: 'border-l-slate-500',
    headerBg: 'bg-gradient-to-r from-slate-50 to-white',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-600',
  },
  rose: {
    border: 'border-l-rose-500',
    headerBg: 'bg-gradient-to-r from-rose-50 via-pink-50/80 to-white',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
  },
  cyan: {
    border: 'border-l-cyan-500',
    headerBg: 'bg-gradient-to-r from-cyan-50 via-sky-50/80 to-white',
    iconBg: 'bg-cyan-100',
    iconText: 'text-cyan-600',
  },
  fuchsia: {
    border: 'border-l-fuchsia-500',
    headerBg: 'bg-gradient-to-r from-fuchsia-50 via-pink-50/80 to-white',
    iconBg: 'bg-fuchsia-100',
    iconText: 'text-fuchsia-600',
  },
  indigo: {
    border: 'border-l-indigo-500',
    headerBg: 'bg-gradient-to-r from-indigo-50 via-violet-50/80 to-white',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
  },
};

export default function PageCard({
  children,
  title,
  subtitle,
  icon,
  accent = 'slate',
  className = '',
}: PageCardProps) {
  const style = accentStyles[accent];

  return (
    <div
      className={`rounded-2xl border border-gray-200/90 bg-white shadow-md shadow-gray-200/50 overflow-hidden ${style.border} border-l-4 hover:shadow-lg hover:shadow-gray-200/60 transition-shadow duration-200 ${className}`}
    >
      {(title || subtitle) && (
        <div className={`${style.headerBg} px-6 py-5 border-b border-gray-100/80`}>
          <div className="flex items-start gap-4">
            {icon && (
              <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 ring-2 ring-white/80 shadow-sm`}>
                <i className={`${icon} text-2xl ${style.iconText}`}></i>
              </div>
            )}
            <div>
              {title && <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className={title || subtitle ? 'px-6 pb-6' : 'p-0'}>{children}</div>
    </div>
  );
}
