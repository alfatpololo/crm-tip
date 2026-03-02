'use client';

type HeroVariant = 'slate' | 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'teal' | 'indigo' | 'cyan';

type PageHeroProps = {
  title: string;
  subtitle?: string;
  badge?: { icon: string; text: string };
  variant?: HeroVariant;
  children?: React.ReactNode;
};

const heroVariants: Record<HeroVariant, { gradient: string; badge: string; pattern: string }> = {
  slate: {
    gradient: 'from-slate-700 via-slate-600 to-slate-800',
    badge: 'text-slate-300',
    pattern: '0.04',
  },
  blue: {
    gradient: 'from-blue-600 via-blue-500 to-indigo-700',
    badge: 'text-blue-100',
    pattern: '0.06',
  },
  emerald: {
    gradient: 'from-emerald-600 via-emerald-500 to-teal-700',
    badge: 'text-emerald-100',
    pattern: '0.06',
  },
  violet: {
    gradient: 'from-violet-600 via-violet-500 to-purple-700',
    badge: 'text-violet-100',
    pattern: '0.06',
  },
  amber: {
    gradient: 'from-amber-500 via-orange-500 to-amber-700',
    badge: 'text-amber-100',
    pattern: '0.06',
  },
  rose: {
    gradient: 'from-rose-500 via-pink-500 to-rose-700',
    badge: 'text-rose-100',
    pattern: '0.06',
  },
  teal: {
    gradient: 'from-teal-600 via-cyan-500 to-teal-700',
    badge: 'text-teal-100',
    pattern: '0.06',
  },
  indigo: {
    gradient: 'from-indigo-600 via-indigo-500 to-violet-700',
    badge: 'text-indigo-100',
    pattern: '0.06',
  },
  cyan: {
    gradient: 'from-cyan-600 via-sky-500 to-blue-700',
    badge: 'text-cyan-100',
    pattern: '0.06',
  },
};

export default function PageHero({ title, subtitle, badge, variant = 'slate', children }: PageHeroProps) {
  const v = heroVariants[variant];
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${v.gradient} text-white overflow-hidden mb-8 shadow-lg ring-1 ring-black/5`}
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='${v.pattern}' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20m40 20V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative px-8 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            {badge && (
              <div className={`flex items-center gap-2 ${v.badge} text-sm font-medium mb-2`}>
                <i className={badge.icon}></i>
                <span>{badge.text}</span>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm">{title}</h1>
            {subtitle && <p className={`mt-2 ${v.badge} text-base max-w-2xl opacity-95`}>{subtitle}</p>}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
}
