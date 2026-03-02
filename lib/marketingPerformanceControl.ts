/**
 * Referensi: Marketing_Performance_Control_Board_Level.pdf
 * Board-Level Strategic KPI & Incentive Structure (5 PIC)
 * Semua aktivitas untuk 2 produk: MKASIR & DISIPLINKU.
 */

export type ChannelKey = 'digital' | 'komunitas' | 'kemitraan' | 'canvassing';

export interface ChannelKpiTarget {
  channel: string;
  channelKey: ChannelKey;
  leadTarget: number;
  demoTarget: number;
  proposalTarget: number;
  closingTarget: number;
  revenueTargetJt: number;
}

export const CHANNEL_KPI_TARGETS: ChannelKpiTarget[] = [
  { channel: 'Digital Marketing', channelKey: 'digital', leadTarget: 120, demoTarget: 30, proposalTarget: 15, closingTarget: 5, revenueTargetJt: 150 },
  { channel: 'Komunitas', channelKey: 'komunitas', leadTarget: 60, demoTarget: 20, proposalTarget: 10, closingTarget: 3, revenueTargetJt: 80 },
  { channel: 'Kemitraan Corporate', channelKey: 'kemitraan', leadTarget: 40, demoTarget: 15, proposalTarget: 8, closingTarget: 2, revenueTargetJt: 120 },
  { channel: 'Canvassing', channelKey: 'canvassing', leadTarget: 80, demoTarget: 25, proposalTarget: 12, closingTarget: 4, revenueTargetJt: 100 },
];

/** Bobot: Revenue 40%, Activity KPI 30%, Conversion KPI 30% */
export const KPI_WEIGHTS = { revenue: 0.4, activity: 0.3, conversion: 0.3 } as const;

/** Skor berdasarkan % target tercapai */
export function getScoreFromPct(pct: number): number {
  if (pct >= 100) return 100;
  if (pct >= 80) return 80;
  if (pct >= 60) return 60;
  return 40;
}

/** Insentif berdasarkan skor (referensi PDF) */
export const INCENTIVE_RULES = [
  { minScore: 90, label: 'Bonus 1.5x insentif standar', color: 'green' },
  { minScore: 80, label: 'Bonus 1x insentif', color: 'emerald' },
  { minScore: 70, label: 'Bonus 0.5x', color: 'amber' },
  { minScore: 0, label: 'Tidak ada bonus', color: 'red' },
] as const;

/** Weekly control: input harian di CRM, review meeting max 60 menit, review progress & corrective action */
export const WEEKLY_CONTROL = [
  'Setiap PIC wajib input aktivitas harian di CRM',
  'Weekly review meeting (maks 60 menit)',
  'Review: Lead, Demo, Proposal, Closing, Revenue Progress',
  'Identifikasi bottleneck conversion per channel',
  'Tentukan corrective action minggu berikutnya',
] as const;

/** Flow: Lead → CRM → Assign ke PIC → Follow-up maks 10 menit → Status → Onboarding → Renewal reminder */
export const FLOW_CONTROL = [
  'Lead masuk → CRM input otomatis',
  'Assign ke PIC sesuai channel',
  'Follow-up maksimal 10 menit',
  'Update status: Contacted → Demo → Proposal → Negotiation → Closing',
  'Customer onboarding → Caring & Retention Monitoring',
  'Renewal reminder otomatis sebelum jatuh tempo',
] as const;
