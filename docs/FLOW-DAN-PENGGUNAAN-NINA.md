# Flow Web & Penggunaan untuk Nina (Koordinator) – Tools Laporan

## 1. Struktur Menu Saat Ini

- **Ringkasan Dashboard** — overview KPI, funnel, revenue, leads per channel/produk.
- **OPERASIONAL**
  - **Leads** — daftar lead, filter produk/saluran/stage/PIC, tambah lead.
  - **Aktivitas** — panduan aktivitas marketing (Digital, Komunitas, Canvassing, Customer) + **Input Laporan Pekerjaan** + KPI per section + **KPI per Orang per Tugas**.
  - **Sumber Saluran** — leads per saluran (IG, WA, Facebook, Email).
  - **Kategori Produk** — daftar produk (MKASIR & DISIPLINKU, varian).
  - **Tugas & Tindak Lanjut** — daftar tugas, filter status/produk/aktivitas/PIC, **tambah tugas** oleh staff, tandai selesai.
- **INTI KONTROL (CRM)**
  - **Papan Pipeline** — lead per tahap (Lead → Dihubungi → Demo → Proposal → Negosiasi → Closing).
  - **Detail Lead** — pilih lead, lihat detail.
  - **Performa Penjualan** — target vs realisasi per sales.
  - **Peramalan** — proyeksi pendapatan.

*(Menu Analitik Eksekutif & Manajemen sementara disembunyikan; halaman tetap bisa diakses lewat URL.)*

---

## 2. Alur Data & Siapa Input Apa

| Yang di-input | Di mana | Siapa | Disimpan |
|---------------|---------|--------|----------|
| **Laporan pekerjaan** (tanggal, PIC, tipe aktivitas, realisasi, catatan) | Halaman **Aktivitas** → form "Input Laporan Pekerjaan" | Semua PIC/staff | localStorage (`crm-tip-laporan-pekerjaan`) |
| **Tugas** (judul, lead/perusahaan, produk MKASIR/DISIPLINKU, aktivitas/KPI, PIC, jatuh tempo, prioritas) | Halaman **Tugas & Tindak Lanjut** → "Tambah Tugas" | Semua staff | localStorage (`crm-tip-tugas-tindak-lanjut`) |
| **Lead baru** | Halaman **Leads** → "Tambah Lead Baru" | Siapa saja yang kelola lead | Data statis di kode (belum pakai backend) |

**Produk & aktivitas:** Semua aktivitas untuk **2 produk (MKASIR & DISIPLINKU)**. Tugas dan laporan memakai **aktivitas/KPI channel**: Digital Marketing, Komunitas, Kemitraan Corporate, Canvassing, Customer Handling.

---

## 3. Flow untuk Laporan (Harian / Mingguan)

1. **PIC/staff input laporan harian**
   - Buka **Aktivitas** → scroll ke **Input Laporan Pekerjaan**.
   - Isi: Tanggal, PIC (nama sendiri), Tipe Aktivitas (dari daftar I–IV), Realisasi, Catatan → Simpan.
   - Entri muncul di **Daftar Laporan** di bawah; realisasi otomatis masuk ke tabel aktivitas (I. Digital, II. Komunitas, III. Canvassing, IV. Customer) dan ke **KPI per Orang per Tugas**.

2. **Nina (koordinator) lihat ringkasan**
   - **Aktivitas** → kartu **KPI Aktivitas Marketing** (4 section: % tercapai per section).
   - **Aktivitas** → section **KPI per Orang per Tugas** (per PIC: tugas, realisasi, target, % tercapai).
   - **Aktivitas** → **Daftar Laporan** (semua entri laporan pekerjaan).
   - **Tugas & Tindak Lanjut** → daftar tugas per PIC/produk/aktivitas/status.
   - **Ringkasan Dashboard** → KPI umum, leads per channel/produk.
   - **CRM** → Papan Pipeline, Detail Lead (untuk konteks penjualan).

3. **Tugas & follow-up**
   - Staff/Nina bisa **tambah tugas** di **Tugas & Tindak Lanjut** (dengan produk, aktivitas, PIC).
   - Bisa filter per PIC/status/produk/aktivitas dan tandai selesai.

Jadi flow laporan: **input laporan di Aktivitas** → **realisasi & KPI terhitung otomatis** → **Nina lihat di halaman yang sama (Aktivitas) + Tugas + Dashboard + CRM**.

---

## 4. Sudah Sesuai untuk Nina sebagai Koordinator?

**Yang sudah mendukung:**

- **Satu tempat input laporan:** Semua laporan pekerjaan (realisasi aktivitas) di **Aktivitas** → Input Laporan Pekerjaan; data dipakai untuk realisasi tabel dan KPI per orang per tugas.
- **KPI jelas:** KPI per section (I–IV) dan **KPI per Orang per Tugas** (per PIC) langsung terlihat di Aktivitas.
- **Tugas terstruktur:** Tugas punya produk (MKASIR/DISIPLINKU) dan aktivitas (sesuai KPI channel); bisa filter per PIC/status; staff bisa input dan update.
- **Role Nina:** Di data, Nina = Community Marketing Officer; bisa input laporan dan tugas seperti PIC lain, plus memakai halaman yang sama untuk **monitor** semua PIC (KPI per orang per tugas, daftar laporan).
- **Produk & standar:** Semua mengacu 2 produk (MKASIR & DISIPLINKU) dan aktivitas/KPI yang sama (referensi PDF jobdesc & control board).

**Yang masih kurang / perlu diperhatikan:**

1. **Penyimpanan hanya di browser (localStorage)**  
   Data laporan dan tugas hanya di perangkat yang dipakai. Ganti browser/device/hapus data = hilang. Untuk dipakai serius sebagai tools laporan, idealnya ada **backend + database** (dan login) supaya data satu sumber, aman, dan bisa diakses Nina dari mana saja.

2. **Belum ada “Laporan Mingguan” satu halaman**  
   Untuk weekly review, Nina harus buka beberapa tempat (Aktivitas untuk KPI & daftar laporan, Tugas, Dashboard, CRM). Belum ada satu halaman **“Ringkasan Laporan Mingguan”** (misalnya: periode, rekap realisasi per section, per PIC, tugas overdue, lead baru) yang siap disimpan/print.

3. **Ekspor laporan disembunyikan**  
   Menu **Ekspor Laporan** (Manajemen) saat ini disembunyikan. Kalau Nina butuh export Excel/PDF, menu itu bisa diaktifkan lagi atau ditambah link dari halaman Aktivitas/Dashboard.

4. **Leads masih data statis**  
   Lead di `lib/leadsData.ts` belum terhubung ke input laporan/tugas; tambah lead hanya di memori. Untuk laporan lengkap (lead + aktivitas + tugas), ke depan bisa disatukan dengan backend.

---

## 5. Kesimpulan Singkat

- **Flow web saat ini:**  
  Input laporan di **Aktivitas** → realisasi & KPI (per section dan per orang) ter-update → tugas di **Tugas & Tindak Lanjut** (dengan produk & aktivitas) → ringkasan di **Dashboard** dan **CRM**.

- **Untuk Nina sebagai koordinator:**  
  **Sudah cukup dipakai** untuk:  
  - mengumpulkan laporan pekerjaan (via form di Aktivitas),  
  - memantau KPI per section dan per orang,  
  - mengelola tugas per PIC/produk/aktivitas.  

  **Belum ideal** untuk dipakai sebagai **tools laporan resmi jangka panjang** karena: data hanya di localStorage, belum ada halaman “Laporan Mingguan” satu tempat, dan ekspor/management saat ini disembunyikan. Langkah berikut yang paling berguna: **backend + database** untuk laporan & tugas, lalu (opsional) **satu halaman Ringkasan Laporan Mingguan** dan **aktifkan/tegaskan akses Ekspor Laporan** untuk Nina.
