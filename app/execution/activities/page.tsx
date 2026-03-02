'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ActivityTable, { type ActivityRow } from '@/components/marketing/ActivityTable';
import InputLaporanPekerjaan, { type ActivityOption, type LaporanPekerjaan, LAPORAN_STORAGE_KEY } from '@/components/marketing/InputLaporanPekerjaan';

const digitalRows: ActivityRow[] = [
  { no: '1', namaKegiatan: 'Optimalisasi Social Media MKASIR', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Instagram', uraian: 'Meningkatkan followers Instagram', targetMin: 5, targetBln: 20, satuan: 'Followers', pic: 'Ilham', isSub: true, realisasi: 6 },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Instagram (Selasa, Rabu, Jumat)', targetMin: 3, targetBln: 12, satuan: 'Konten', pic: '', isSub: true, realisasi: 3 },
  { no: 'b.', namaKegiatan: 'Facebook', uraian: 'Meningkatkan followers Facebook', targetMin: 5, targetBln: 20, satuan: 'Followers', pic: 'Ilham', isSub: true, realisasi: 4 },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Facebook (Selasa, Rabu, Jumat)', targetMin: 3, targetBln: 12, satuan: 'Konten', pic: '', isSub: true, realisasi: 4 },
  { no: 'c.', namaKegiatan: 'Threads', uraian: 'Meningkatkan followers Threads', targetMin: 3, targetBln: 12, satuan: 'Followers', pic: 'Nina', isSub: true, realisasi: 3 },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Threads (Selasa, Rabu, Jumat)', targetMin: 3, targetBln: 12, satuan: 'Konten', pic: '', isSub: true, realisasi: 2 },
  { no: 'd.', namaKegiatan: 'TikTok', uraian: 'Meningkatkan followers Tiktok', targetMin: 5, targetBln: 20, satuan: 'Followers', pic: 'Nina', isSub: true, realisasi: 7 },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten TikTok (Rabu, Jumat)', targetMin: 2, targetBln: 8, satuan: 'Konten', pic: '', isSub: true, realisasi: 2 },
  { no: 'e.', namaKegiatan: 'Youtube', uraian: 'Meningkatkan subscribers Youtube', targetMin: 5, targetBln: 20, satuan: 'Subscribers', pic: 'Alfath', isSub: true, realisasi: 5 },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Youtube (Rabu, Jumat)', targetMin: 2, targetBln: 8, satuan: 'Konten', pic: '', isSub: true, realisasi: 2 },
  { no: 'f.', namaKegiatan: 'WhatsApp Group', uraian: 'Upload Konten di WhatsApp Group Keluarga/Teman', targetMin: 5, targetBln: 20, satuan: 'Konten', pic: 'Nina, Ilham, Jemi', isSub: true, realisasi: 6 },
  { no: '2', namaKegiatan: 'Optimalisasi Social Media DISIPLINKU', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Instagram', uraian: 'Meningkatkan followers Instagram', targetMin: 5, targetBln: 10, satuan: 'Followers', pic: 'Robby', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Instagram (Selasa, Rabu, Jumat)', targetMin: 3, targetBln: 6, satuan: 'Konten', pic: '', isSub: true },
  { no: 'b.', namaKegiatan: 'Facebook', uraian: 'Meningkatkan followers Facebook', targetMin: 5, targetBln: 10, satuan: 'Followers', pic: 'Robby', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Facebook (Selasa, Rabu, Jumat)', targetMin: 3, targetBln: 6, satuan: 'Konten', pic: '', isSub: true },
  { no: 'c.', namaKegiatan: 'Threads', uraian: 'Meningkatkan followers Threads', targetMin: 3, targetBln: 6, satuan: 'Followers', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Threads (Selasa, Rabu, Jumat)', targetMin: 3, targetBln: 6, satuan: 'Konten', pic: '', isSub: true },
  { no: 'd.', namaKegiatan: 'TikTok', uraian: 'Meningkatkan followers Tiktok', targetMin: 5, targetBln: 10, satuan: 'Followers', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten TikTok (Rabu, Jumat)', targetMin: 2, targetBln: 4, satuan: 'Konten', pic: '', isSub: true },
  { no: 'e.', namaKegiatan: 'Youtube', uraian: 'Meningkatkan subscribers Youtube', targetMin: 5, targetBln: 10, satuan: 'Subscribers', pic: 'Alfath', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Upload Konten Youtube (Rabu, Jumat)', targetMin: 2, targetBln: 4, satuan: 'Konten', pic: '', isSub: true },
  { no: 'f.', namaKegiatan: 'WhatsApp Group', uraian: 'Upload Konten di WhatsApp Group Keluarga/Teman', targetMin: 5, targetBln: 10, satuan: 'Konten', pic: 'Nina, Robby, Radi', isSub: true },
  { no: '3', namaKegiatan: 'Bank Konten MKASIR', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Foto', uraian: 'Edukasi: Pengelolaan usaha UMKM, berita UMKM', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Ilham', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Tips: Operasional harian', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Ilham', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Pain Point: Permasalahan utama kasir', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Testimoni: Screenshot Voice of Customer', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Promo: Diskon event', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Alfath', isSub: true },
  { no: 'b.', namaKegiatan: 'Video', uraian: 'Demo produk: tutorial dengan format short', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina/Alfath', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Penjelasan edukasi: Buat konten edukasi pakai ai', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina/Alfath', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Testimoni: MKAREVIEW/Entertainment', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Ilham', isSub: true },
  { no: '4', namaKegiatan: 'Bank Konten DISIPLINKU', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Foto', uraian: 'Edukasi: Budaya kerja&HR', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Ilham', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Tips: Absensi dan operasional', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Ilham', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Pain Point: Permasalahan utama manajemen karyawan', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Testimoni: Screenshot Voice of Customer', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Promo: Diskon event', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Alfath', isSub: true },
  { no: 'b.', namaKegiatan: 'Video', uraian: 'Demo produk: tutorial dengan format short', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina/Alfath', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Penjelasan edukasi: Buat konten edukasi pakai ai', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Nina/Alfath', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Testimoni/Entertainment', targetMin: 1, targetBln: 4, satuan: 'Konten', pic: 'Ilham', isSub: true },
  { no: '5', namaKegiatan: 'Optimalisasi Landing Page MKASIR', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Artikel', uraian: 'Membuat artikel di Landing Page', targetMin: 5, targetBln: 20, satuan: 'Artikel', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Membuat thumbnail artikel di Landing Page', targetMin: 5, targetBln: 20, satuan: 'Konten', pic: 'Nina', isSub: true },
  { no: '6', namaKegiatan: 'Optimalisasi Landing Page DISIPLINKU', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Artikel', uraian: 'Membuat artikel di Landing Page', targetMin: 5, targetBln: 20, satuan: 'Artikel', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Membuat thumbnail artikel di Landing Page', targetMin: 5, targetBln: 20, satuan: 'Konten', pic: 'Nina', isSub: true },
  { no: '7', namaKegiatan: 'Iklan dan Promosi', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Meta Ads-Instagram', uraian: 'Reach', targetMin: 3000, targetBln: '', satuan: 'akun', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Impression', targetMin: 5000, targetBln: '', satuan: 'tayangan', pic: 'Nina', isSub: true },
  { no: 'b.', namaKegiatan: 'Meta Ads-Facebook', uraian: 'Reach', targetMin: 3000, targetBln: '', satuan: 'akun', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Impression', targetMin: 5000, targetBln: '', satuan: 'tayangan', pic: 'Nina', isSub: true },
  { no: 'c.', namaKegiatan: 'TikTok Ads', uraian: 'Reach', targetMin: 5000, targetBln: '', satuan: 'akun', pic: 'Nina', isSub: true },
  { no: '', namaKegiatan: '', uraian: 'Impression', targetMin: 1000, targetBln: '', satuan: 'profile views', pic: 'Nina', isSub: true },
  { no: 'd.', namaKegiatan: 'Google Ads', uraian: 'Closing', targetMin: 10, targetBln: '', satuan: 'customer', pic: 'Nina', isSub: true },
];

const communityRows: ActivityRow[] = [
  { no: '1', namaKegiatan: 'Community Activation MKASIR', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Join Group UMKM', uraian: 'Posting konten existing di Facebook', targetMin: 5, targetBln: 20, satuan: 'Grup', pic: 'Jemi', isSub: true, realisasi: 6 },
  { no: 'b.', namaKegiatan: 'Duta Merchant', uraian: 'Menentukan merchant pelanggan loyal', targetMin: 1, targetBln: '', satuan: 'Customer', pic: 'Nina', isSub: true, realisasi: 1 },
  { no: '2', namaKegiatan: 'Community Activation DISIPLINKU', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Join Group Bisnis Kecil-Menengah', uraian: 'Posting konten existing di Facebook', targetMin: 5, targetBln: 20, satuan: 'Grup', pic: 'Radi', isSub: true, realisasi: 4 },
  { no: '3', namaKegiatan: 'Kolaborasi Asosiasi & UMKM', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Forum Alumni Karang Taruna Serdang (FAKTA)', uraian: 'Canvassing dan Upload Konten', targetMin: 2, targetBln: 6, satuan: 'Customer', pic: 'Nina', isSub: true, realisasi: 2 },
  { no: '', namaKegiatan: '', uraian: 'Review dan Update Kegiatan setiap hari Rabu', targetMin: '', targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: '4', namaKegiatan: 'Event & Brand Experience', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Karang Taruna', uraian: 'Mengikuti Kegiatan Karang Taruna', targetMin: 1, targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: 'b.', namaKegiatan: 'MKASIR Goes to School', uraian: 'Membangun awareness, membuka peluang kerja sama komunitas sekolah', targetMin: 1, targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: 'c.', namaKegiatan: 'Event UMKM', uraian: 'Menghadiri kegiatan EXPO untuk memperkenalkan MKASIR', targetMin: 1, targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: 'd.', namaKegiatan: 'Event HR', uraian: 'Menghadiri kegiatan EXPO untuk memperkenalkan DISIPLINKU', targetMin: 1, targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: '5', namaKegiatan: 'Referral & Loyalty Program', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Bonus Referral', uraian: 'Mempercepat pertumbuhan pengguna lewat kekuatan rekomendasi mulut ke mulut.', targetMin: '', targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: 'b.', namaKegiatan: 'Loyalty Point System', uraian: 'Sistem poin diberikan kepada pengguna yang aktif bertransaksi, memperbarui langganan, atau mengikuti campaign tertentu', targetMin: '', targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: '6', namaKegiatan: 'CSR & Edukasi Sosial', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Sponsor kegiatan sosial', uraian: 'Kegiatannya mencakup kolaborasi dengan komunitas lokal, dokumentasi aktivitas, dan pelaporan hasil kegiatan.', targetMin: '', targetBln: '', satuan: '', pic: 'Nina', isSub: true },
  { no: 'b.', namaKegiatan: 'Gerakan sosial', uraian: 'Memberikan dampak sosial yang nyata, meningkatkan awareness terhadap isu yang relevan, dan menumbuhkan brand affinity di tengah masyarakat.', targetMin: '', targetBln: '', satuan: '', pic: 'Nina', isSub: true },
];

const canvassingRows: ActivityRow[] = [
  { no: '1', namaKegiatan: 'MKASIR RETAIL', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: '', namaKegiatan: 'Potential Demand Visit (Canvassing)', uraian: 'Mengunjungi potential demand di Depok/Bogor dan sekitarnya', targetMin: 10, targetBln: 40, satuan: 'Kunjungan', pic: 'Robby, Radi', isSub: true, realisasi: 11 },
  { no: '', namaKegiatan: '', uraian: 'Memiliki prospek atau target lead', targetMin: 2, targetBln: 8, satuan: 'Lead', pic: 'Robby, Radi', isSub: true, realisasi: 3 },
  { no: '2', namaKegiatan: 'DISIPLINKU', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: '', namaKegiatan: 'Potential Demand Visit (Canvassing)', uraian: 'Mengunjungi potential demand di Depok/Bogor dan sekitarnya', targetMin: 10, targetBln: 40, satuan: 'Kunjungan', pic: 'Robby, Radi', isSub: true, realisasi: 8 },
  { no: '', namaKegiatan: '', uraian: 'Memiliki prospek atau target lead', targetMin: 2, targetBln: 8, satuan: 'Lead', pic: 'Robby, Radi', isSub: true, realisasi: 2 },
];

const customerHandlingRows: ActivityRow[] = [
  { no: '1', namaKegiatan: 'MKASIR', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Caring', uraian: 'Customer baru diarahkan untuk berbayar', targetMin: 100, targetBln: 400, satuan: 'Customer', pic: 'Jemi', isSub: true, realisasi: 95 },
  { no: '', namaKegiatan: '', uraian: 'Customer churn tanya experience', targetMin: 50, targetBln: 100, satuan: 'Customer', pic: 'Jemi', isSub: true, realisasi: 48 },
  { no: '', namaKegiatan: '', uraian: 'Customer baru diarahkan untuk berbayar', targetMin: 100, targetBln: 400, satuan: 'Customer', pic: 'Ilham', isSub: true, realisasi: 102 },
  { no: '', namaKegiatan: '', uraian: 'Customer churn tanya experience', targetMin: 50, targetBln: 100, satuan: 'Customer', pic: 'Ilham', isSub: true, realisasi: 52 },
  { no: 'b.', namaKegiatan: 'Handling Complain', uraian: 'Complain', targetMin: 5, targetBln: 20, satuan: 'Customer', pic: 'Nina', isSub: true, realisasi: 6 },
  { no: '', namaKegiatan: '', uraian: 'Informasi', targetMin: 5, targetBln: 20, satuan: 'Customer', pic: 'Nina', isSub: true, realisasi: 5 },
  { no: '', namaKegiatan: '', uraian: 'Lain-lain', targetMin: 5, targetBln: 20, satuan: 'Customer', pic: 'Nina', isSub: true, realisasi: 4 },
  { no: '2', namaKegiatan: 'DISIPLINKU', uraian: '', targetMin: '', targetBln: '', satuan: '', pic: '', isSub: false },
  { no: 'a.', namaKegiatan: 'Caring', uraian: 'Menawarkan aplikasi dan membuat janji temu untuk demo', targetMin: 10, targetBln: 40, satuan: 'Perusahaan', pic: 'Robby', isSub: true, realisasi: 12 },
  { no: '', namaKegiatan: '', uraian: 'Memiliki prospek atau target lead', targetMin: 2, targetBln: 8, satuan: 'Perusahaan', pic: 'Robby', isSub: true, realisasi: 2 },
  { no: '', namaKegiatan: '', uraian: 'Menawarkan aplikasi dan membuat janji temu untuk demo', targetMin: 10, targetBln: 40, satuan: 'Perusahaan', pic: 'Radi', isSub: true, realisasi: 9 },
  { no: '', namaKegiatan: '', uraian: 'Memiliki prospek atau target lead', targetMin: 2, targetBln: 8, satuan: 'Perusahaan', pic: 'Radi', isSub: true, realisasi: 2 },
  { no: 'b.', namaKegiatan: 'Handling Complain', uraian: 'Complain', targetMin: 5, targetBln: 20, satuan: 'Perusahaan', pic: 'Nina', isSub: true, realisasi: 5 },
  { no: '', namaKegiatan: '', uraian: 'Informasi', targetMin: 5, targetBln: 20, satuan: 'Perusahaan', pic: 'Nina', isSub: true, realisasi: 6 },
  { no: '', namaKegiatan: '', uraian: 'Lain-lain', targetMin: 5, targetBln: 20, satuan: 'Perusahaan', pic: 'Nina', isSub: true, realisasi: 3 },
];

const SECTIONS = [
  { id: 'idigitalmarketing', label: 'I. Digital', icon: 'ri-megaphone-line', color: 'blue' },
  { id: 'iimarketingkomunitas', label: 'II. Komunitas', icon: 'ri-group-line', color: 'emerald' },
  { id: 'iiicanvassing', label: 'III. Canvassing', icon: 'ri-map-pin-user-line', color: 'amber' },
  { id: 'ivcustomerhandling', label: 'IV. Customer', icon: 'ri-customer-service-2-line', color: 'violet' },
];

function hitungKpiSection(rows: ActivityRow[]): { totalTarget: number; totalRealisasi: number; pct: number; jumlahItem: number } {
  let totalTarget = 0;
  let totalRealisasi = 0;
  let jumlahItem = 0;
  rows.forEach((row) => {
    const target = typeof row.targetMin === 'number' ? row.targetMin : typeof row.targetBln === 'number' ? (row.targetBln as number) / 12 : null;
    const real = row.realisasi;
    if (target != null && real != null && target > 0) {
      totalTarget += target;
      totalRealisasi += real;
      jumlahItem += 1;
    }
  });
  const pct = totalTarget > 0 ? Math.round((totalRealisasi / totalTarget) * 100) : 0;
  return { totalTarget, totalRealisasi, pct, jumlahItem };
}

/** 5 PIC sesuai Jobdesc_Marketing_5_PIC_Detail.pdf */
const TEAM = [
  { name: 'Alfath', role: 'Digital Marketing Specialist', initial: 'AF' },
  { name: 'Nina', role: 'Community Marketing Officer', initial: 'NA' },
  { name: 'Ilham', role: 'Corporate Partnership Officer', initial: 'IH' },
  { name: 'Roby', role: 'Field Canvasing Executive', initial: 'RB' },
  { name: 'Radi', role: 'Marketing Control & Customer Caring', initial: 'RD' },
  { name: 'Jemi', role: 'Sales Support', initial: 'JM' },
];

function buildActivityOptions(): ActivityOption[] {
  const out: ActivityOption[] = [];
  const sections: { id: string; label: string; rows: ActivityRow[] }[] = [
    { id: 'idigital', label: 'I. Digital', rows: digitalRows },
    { id: 'iikomunitas', label: 'II. Komunitas', rows: communityRows },
    { id: 'iiicanvassing', label: 'III. Canvassing', rows: canvassingRows },
    { id: 'ivcustomer', label: 'IV. Customer', rows: customerHandlingRows },
  ];
  sections.forEach(({ id, label, rows }) => {
    rows.forEach((row, i) => {
      if (!row.isSub) return;
      const activityLabel = (row.uraian || row.namaKegiatan || '').trim();
      if (!activityLabel) return;
      out.push({
        value: `${id}-${i}`,
        sectionLabel: label,
        activityLabel,
        satuan: (row.satuan || '–').trim() || '–',
      });
    });
  });
  return out;
}

function loadLaporanFromStorage(): LaporanPekerjaan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function computeRealisasiByKey(laporan: LaporanPekerjaan[]): Record<string, number> {
  const out: Record<string, number> = {};
  laporan.forEach((lp) => {
    const key = lp.tipeAktivitas;
    out[key] = (out[key] || 0) + lp.realisasi;
  });
  return out;
}

function getTargetFromRow(row: ActivityRow): number | null {
  const tMin = typeof row.targetMin === 'number' ? row.targetMin : null;
  const tBln = typeof row.targetBln === 'number' ? row.targetBln : null;
  if (tMin != null && tMin > 0) return tMin;
  if (tBln != null && tBln > 0) return tBln / 12;
  return null;
}

function buildTargetByActivityKey(): Record<string, number> {
  const out: Record<string, number> = {};
  const sections: { id: string; rows: ActivityRow[] }[] = [
    { id: 'idigital', rows: digitalRows },
    { id: 'iikomunitas', rows: communityRows },
    { id: 'iiicanvassing', rows: canvassingRows },
    { id: 'ivcustomer', rows: customerHandlingRows },
  ];
  sections.forEach(({ id, rows }) => {
    rows.forEach((row, i) => {
      const t = getTargetFromRow(row);
      if (t != null) out[`${id}-${i}`] = t;
    });
  });
  return out;
}

type KpiPerTugasItem = {
  activityKey: string;
  activityLabel: string;
  sectionLabel: string;
  realisasi: number;
  target: number;
  pct: number | null;
};

function buildKpiPerOrangPerTugas(
  laporan: LaporanPekerjaan[],
  targetByActivityKey: Record<string, number>,
  activityOptions: ActivityOption[]
): { pic: string; items: KpiPerTugasItem[] }[] {
  const byPic: Record<string, Record<string, number>> = {};
  laporan.forEach((lp) => {
    if (!byPic[lp.pic]) byPic[lp.pic] = {};
    byPic[lp.pic][lp.tipeAktivitas] = (byPic[lp.pic][lp.tipeAktivitas] || 0) + lp.realisasi;
  });
  const targetMap = targetByActivityKey;
  const optMap = Object.fromEntries(activityOptions.map((o) => [o.value, o]));
  const result: { pic: string; items: KpiPerTugasItem[] }[] = [];
  const orderedPics = TEAM.map((t) => t.name).filter((name) => byPic[name]);
  const otherPics = Object.keys(byPic).filter((name) => !orderedPics.includes(name));
  [...orderedPics, ...otherPics].forEach((pic) => {
    const tasks = byPic[pic] || {};
    const items: KpiPerTugasItem[] = Object.entries(tasks).map(([activityKey, realisasi]) => {
      const target = targetMap[activityKey] ?? 0;
      const opt = optMap[activityKey];
      const pct = target > 0 ? Math.round((realisasi / target) * 100) : null;
      return {
        activityKey,
        activityLabel: opt?.activityLabel ?? activityKey,
        sectionLabel: opt?.sectionLabel ?? '–',
        realisasi,
        target,
        pct,
      };
    });
    items.sort((a, b) => a.sectionLabel.localeCompare(b.sectionLabel) || a.activityLabel.localeCompare(b.activityLabel));
    result.push({ pic, items });
  });
  return result;
}

export default function ActivitiesPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [laporanList, setLaporanList] = useState<LaporanPekerjaan[]>([]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const activityOptions = useMemo(() => buildActivityOptions(), []);
  const teamNames = useMemo(() => TEAM.map((t) => t.name), []);

  useEffect(() => {
    setLaporanList(loadLaporanFromStorage());
  }, []);

  const realisasiByKey = useMemo(() => computeRealisasiByKey(laporanList), [laporanList]);
  const targetByActivityKey = useMemo(() => buildTargetByActivityKey(), []);
  const kpiPerOrangPerTugas = useMemo(
    () => buildKpiPerOrangPerTugas(laporanList, targetByActivityKey, activityOptions),
    [laporanList, targetByActivityKey, activityOptions]
  );

  const handleLaporanChange = useCallback((list: LaporanPekerjaan[]) => {
    setLaporanList(list);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            setActiveSection((prev) => (prev === id ? prev : id));
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Hero header */}
        <div className="relative rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-700 text-white overflow-hidden mb-8 shadow-lg ring-1 ring-black/5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDYiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTAgNDBMNDAgMEgyMEwwIDIwbTIwIDIwVjIwTDIwIDQwIi8+PC9nPjwvc3ZnPg==')] opacity-80" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative px-8 py-8 md:py-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-white text-sm font-medium mb-2">
                  <i className="ri-calendar-check-line"></i>
                  <span>Aturan & Target</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Aktivitas Marketing</h1>
                <p className="mt-2 text-white text-base max-w-2xl">
                  Semua aktivitas marketing untuk 2 produk: MKASIR & DISIPLINKU. Panduan: Digital, Komunitas, Canvassing, Customer Handling.
                </p>
              </div>
              {/* Tim card */}
              <div className="flex flex-col gap-4">
                <a
                  href="#input-laporan"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors w-fit"
                >
                  <i className="ri-file-edit-line text-lg"></i>
                  Input Laporan Pekerjaan
                </a>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-5 min-w-[280px]">
                <p className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Tim Marketing</p>
                <div className="flex flex-wrap gap-2">
                  {TEAM.map((t) => (
                    <div
                      key={t.name}
                      className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 border border-white/10"
                    >
                      <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                        {t.initial}
                      </span>
                      <span>
                        <span className="font-semibold text-white">{t.name}</span>
                        <span className="text-white text-xs ml-1 opacity-90">({t.role})</span>
                      </span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Laporan Pekerjaan — tambah laporan, lalu entri muncul di tabel di bawah dan realisasi tabel I–IV ter-update */}
        <div id="input-laporan" className="scroll-mt-6">
          <InputLaporanPekerjaan
            activityOptions={activityOptions}
            teamMembers={teamNames}
            onLaporanChange={handleLaporanChange}
          />
        </div>

        {/* Referensi Jobdesc 5 PIC — sesuai Jobdesc_Marketing_5_PIC_Detail.pdf */}
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-slate-50 to-white p-5 mb-8 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-2 mb-3">
            <i className="ri-file-list-3-line text-xl text-indigo-600"></i>
            <span className="font-semibold text-gray-900">Referensi Jobdesc 5 PIC</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Semua aktivitas untuk 2 produk: MKASIR & DISIPLINKU. Struktur tim: Digital, Komunitas, Kemitraan Corporate, Canvassing, Marketing Control & Customer Caring. Aktivitas wajib tercatat di CRM; target & insentif lihat Dashboard KPI.</p>
          <div className="flex flex-wrap gap-2">
            {TEAM.slice(0, 5).map((t) => (
              <span key={t.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{t.initial}</span>
                <span className="font-medium text-gray-800">{t.name}</span>
                <span className="text-gray-500 text-xs hidden sm:inline">— {t.role}</span>
              </span>
            ))}
          </div>
          <Link href="/analytics/kpi" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Lihat Marketing Performance Control Board <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        {/* KPI Ringkasan Aktivitas Marketing */}
        <div className="mb-4 flex items-center justify-between mt-10">
          <h2 className="text-lg font-semibold text-gray-900">KPI Aktivitas Marketing</h2>
          <Link
            href="/analytics/kpi"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Lihat Dashboard KPI <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'I. Digital', rows: digitalRows, sectionId: 'idigital', icon: 'ri-megaphone-line', color: 'blue' as const },
            { label: 'II. Komunitas', rows: communityRows, sectionId: 'iikomunitas', icon: 'ri-group-line', color: 'emerald' as const },
            { label: 'III. Canvassing', rows: canvassingRows, sectionId: 'iiicanvassing', icon: 'ri-map-pin-user-line', color: 'amber' as const },
            { label: 'IV. Customer', rows: customerHandlingRows, sectionId: 'ivcustomer', icon: 'ri-customer-service-2-line', color: 'violet' as const },
          ].map(({ label, rows, sectionId, icon, color }) => {
            const rowsWithRealisasi = rows.map((row, i) => ({
              ...row,
              realisasi: realisasiByKey[`${sectionId}-${i}`] ?? row.realisasi,
            }));
            const kpi = hitungKpiSection(rowsWithRealisasi);
            const colorClass = {
              blue: 'border-l-blue-500 bg-blue-50/50',
              emerald: 'border-l-emerald-500 bg-emerald-50/50',
              amber: 'border-l-amber-500 bg-amber-50/50',
              violet: 'border-l-violet-500 bg-violet-50/50',
            }[color];
            const pctColor = kpi.pct >= 100 ? 'text-green-700' : kpi.pct >= 70 ? 'text-amber-700' : 'text-red-700';
            return (
              <div
                key={label}
                className={`rounded-xl border border-gray-200 bg-white p-5 border-l-4 ${colorClass} shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <i className={`${icon} text-xl text-gray-600`}></i>
                  <span className="font-semibold text-gray-900">{label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.pct}%</p>
                <p className="text-xs text-gray-500 mt-0.5">Rata-rata tercapai ({kpi.jumlahItem} item)</p>
                <p className={`text-sm font-semibold mt-2 ${pctColor}`}>
                  {kpi.pct >= 100 ? 'Target tercapai' : kpi.pct >= 70 ? 'On track' : 'Perlu perhatian'}
                </p>
              </div>
            );
          })}
        </div>

        {/* KPI per Orang per Tugas */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI per Orang per Tugas</h2>
          {kpiPerOrangPerTugas.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-5">
              Belum ada data laporan. Input laporan pekerjaan di atas agar KPI per orang per tugas tampil di sini.
            </p>
          ) : (
            <div className="space-y-6">
              {kpiPerOrangPerTugas.map(({ pic, items }) => (
                <div
                  key={pic}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
                >
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                      {TEAM.find((t) => t.name === pic)?.initial ?? pic.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-semibold text-gray-900">{pic}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                          <th className="py-2.5 px-5 font-medium">Tugas / Aktivitas</th>
                          <th className="py-2.5 px-5 font-medium">Section</th>
                          <th className="py-2.5 px-5 text-right font-medium">Realisasi</th>
                          <th className="py-2.5 px-5 text-right font-medium">Target</th>
                          <th className="py-2.5 px-5 text-right font-medium">% Tercapai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it) => (
                          <tr key={it.activityKey} className="border-b border-gray-50 last:border-0">
                            <td className="py-2.5 px-5 text-gray-900">{it.activityLabel}</td>
                            <td className="py-2.5 px-5 text-gray-600">{it.sectionLabel}</td>
                            <td className="py-2.5 px-5 text-right tabular-nums font-medium">{it.realisasi}</td>
                            <td className="py-2.5 px-5 text-right tabular-nums text-gray-600">{it.target}</td>
                            <td className="py-2.5 px-5 text-right">
                              {it.pct != null ? (
                                <span
                                  className={`inline-flex min-w-[3rem] justify-center px-2 py-0.5 rounded-lg text-xs font-bold tabular-nums ${
                                    it.pct >= 100 ? 'bg-green-100 text-green-800' : it.pct >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {it.pct}%
                                </span>
                              ) : (
                                <span className="text-gray-400">–</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky section nav */}
        <div className="sticky top-0 z-10 -mx-6 px-6 py-3 mb-6 bg-gray-50/95 backdrop-blur-md border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${activeSection === s.id
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <i className={s.icon}></i>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10 pb-12">
          <ActivityTable
            title="I. Digital Marketing"
            subtitle="Optimalisasi social media MKASIR & DISIPLINKU, bank konten, landing page, iklan"
            rows={digitalRows}
            icon="ri-megaphone-line"
            accentColor="blue"
            sectionId="idigital"
            realisasiByKey={realisasiByKey}
          />
          <ActivityTable
            title="II. Marketing Komunitas"
            subtitle="Community activation, kolaborasi asosiasi & UMKM, event, referral, CSR"
            rows={communityRows}
            icon="ri-group-line"
            accentColor="emerald"
            sectionId="iikomunitas"
            realisasiByKey={realisasiByKey}
          />
          <ActivityTable
            title="III. Canvassing"
            subtitle="Potential demand visit MKASIR Retail & DISIPLINKU (Depok/Bogor dan sekitarnya)"
            rows={canvassingRows}
            icon="ri-map-pin-user-line"
            accentColor="amber"
            sectionId="iiicanvassing"
            realisasiByKey={realisasiByKey}
          />
          <ActivityTable
            title="IV. Customer Handling"
            subtitle="Caring & handling complain MKASIR dan DISIPLINKU"
            rows={customerHandlingRows}
            icon="ri-customer-service-2-line"
            accentColor="violet"
            sectionId="ivcustomer"
            realisasiByKey={realisasiByKey}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
