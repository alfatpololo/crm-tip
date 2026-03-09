/**
 * Data progress produk per produk & per PIC (Target Register, New Customer, Repeat Customer, Revenue).
 * localStorage key: crm-tip-progress-produk
 */

export type ProgressByPic = {
  targetRegister: number;
  newCustomer: number;
  repeatCustomer: number;
  revenue: number;
};

export type ProductProgress = {
  targetRegister: number;
  newCustomer: number;
  repeatCustomer: number;
  revenue: number;
  byPic?: Record<string, ProgressByPic>;
};

export type ProgressProdukMap = Record<string, ProductProgress>;

const STORAGE_KEY = 'crm-tip-progress-produk';

function getDummyProgress(): ProgressProdukMap {
  return {
    mkasir_fb: {
      targetRegister: 25,
      newCustomer: 18,
      repeatCustomer: 12,
      revenue: 42500000,
      byPic: {
        Alfath: { targetRegister: 6, newCustomer: 4, repeatCustomer: 3, revenue: 10500000 },
        Nina: { targetRegister: 5, newCustomer: 4, repeatCustomer: 2, revenue: 9000000 },
        Ilham: { targetRegister: 5, newCustomer: 3, repeatCustomer: 3, revenue: 8000000 },
        Jemi: { targetRegister: 4, newCustomer: 4, repeatCustomer: 2, revenue: 7500000 },
      },
    },
    mkasir_persewaan: {
      targetRegister: 15,
      newCustomer: 10,
      repeatCustomer: 6,
      revenue: 28000000,
      byPic: {
        Ilham: { targetRegister: 5, newCustomer: 3, repeatCustomer: 2, revenue: 10000000 },
        Roby: { targetRegister: 5, newCustomer: 4, repeatCustomer: 2, revenue: 9000000 },
        Radi: { targetRegister: 5, newCustomer: 3, repeatCustomer: 2, revenue: 9000000 },
      },
    },
    mkasir_retail: {
      targetRegister: 40,
      newCustomer: 28,
      repeatCustomer: 20,
      revenue: 72000000,
      byPic: {
        Roby: { targetRegister: 10, newCustomer: 7, repeatCustomer: 5, revenue: 18000000 },
        Radi: { targetRegister: 10, newCustomer: 7, repeatCustomer: 5, revenue: 18000000 },
        Jemi: { targetRegister: 10, newCustomer: 7, repeatCustomer: 5, revenue: 18000000 },
        Ilham: { targetRegister: 10, newCustomer: 7, repeatCustomer: 5, revenue: 18000000 },
      },
    },
    disiplinku: {
      targetRegister: 20,
      newCustomer: 14,
      repeatCustomer: 9,
      revenue: 36000000,
      byPic: {
        Nina: { targetRegister: 5, newCustomer: 4, repeatCustomer: 2, revenue: 9000000 },
        Roby: { targetRegister: 5, newCustomer: 3, repeatCustomer: 2, revenue: 9000000 },
        Radi: { targetRegister: 5, newCustomer: 4, repeatCustomer: 3, revenue: 9000000 },
        Alfath: { targetRegister: 5, newCustomer: 3, repeatCustomer: 2, revenue: 9000000 },
      },
    },
  };
}

export function loadProgressProduk(): ProgressProdukMap {
  if (typeof window === 'undefined') return getDummyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDummyProgress();
    const parsed = JSON.parse(raw) as ProgressProdukMap;
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    //
  }
  return getDummyProgress();
}

export function saveProgressProduk(data: ProgressProdukMap): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function formatRevenue(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`;
  return `Rp ${n}`;
}
