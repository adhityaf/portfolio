# Adhitya Portfolio

Portfolio satu halaman berbasis Next.js App Router dan Tailwind CSS. Build menghasilkan static export di `out/`, dapat disajikan langsung, melalui nginx dalam Docker, atau melalui Vercel.

## Prasyarat

- Node.js 20.9 atau lebih baru
- npm
- Docker Desktop, hanya untuk menjalankan versi container

## Instalasi

```bash
npm ci --ignore-scripts
```

Gunakan `npm ci`, bukan `npm install`, agar versi dependency mengikuti `package-lock.json`.

## Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Hentikan server dengan `Ctrl+C`.

`next-env.d.ts` dibuat ulang oleh Next.js dan tidak dilacak Git. Baseline patch keamanan: Next.js 16.3.8 dan `source-map-js` 1.2.2 di `package-lock.json`.

### Tampilan mobile

Di bawah breakpoint `nav` (`43.75rem` / 700px), halaman memakai scroll dokumen biasa: Experience menampilkan seluruh highlight dengan tautan ke masing-masing perusahaan, sedangkan Projects memakai kartu satu kolom dan gambar rasio 16:9. Tidak ada panel scroll bersarang atau pergantian proyek berdasarkan posisi scroll. Header menampilkan AF di kiri serta satu tombol ganti tema tepat di kiri hamburger, dengan jarak antartombol 8px. Dropdown hanya berisi About, Experience, Projects, dan Contact; bagian aktif ditandai warna serta garis samping, termasuk saat reduced motion. Tinggi header tetap 66px saat menu dibuka, offset anchor 80px, dan target sentuh minimal 44px. Teks utama rata kiri memakai token `copy` agar terbaca pada kedua tema.

Tombol menu menyediakan `aria-expanded` dan `aria-controls`. Saat tertutup, isi dropdown tidak masuk urutan Tab. Escape menutup menu dan mengembalikan fokus ke tombol; memilih bagian atau logo menutup menu sebelum menuju tujuan. Perpindahan ke desktop mereset status menu agar tetap tertutup saat kembali ke mobile.

Tombol tema mobile bekerja sekali tekan: ikon matahari berarti beralih ke Nordic, ikon bulan berarti beralih ke Fintech, dengan label aksesibel sesuai tujuan. Pilihan tersimpan saat reload. Kontrol mobile dan selector dua tombol desktop memakai satu state serta jalur penyimpanan yang sama agar sinkron ketika ukuran layar berubah; posisi dan tampilan selector desktop tetap.

Tombol kontak mobile memakai grid dua kolom, tinggi seragam 48px, font 14px, dan ikon 18px. Padding horizontal 8px serta jarak ikon 6px menjaga seluruh label, termasuk Download CV, dalam satu baris tanpa memotong teks. Mulai 700px, padding 20px dan jarak 8px desktop dikembalikan.

Mulai 700px, presentasi sticky dan animasi desktop tetap digunakan. Preferensi reduced motion dan tampilan cetak tetap memakai konten statis. Copy, label Grok, pilihan tema, tautan kontak, dan PDF CV tidak berubah.

Preview lokal tanpa deployment:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3010
```

Periksa lebar 320, 375, 390, 430, 590, 699, dan 1440px: menu tertutup/terbuka, toggle tema berulang dan persistensi reload, sinkronisasi tema saat resize, Escape dan fokus, urutan Tab, reset breakpoint, navigasi bagian dan penanda aktif, tautan/kontrol Experience, seluruh proyek, kedua tema, label tombol kontak satu baris, salin email, unduh CV, overflow horizontal, dan error console.

## Static export

Build aplikasi:

```bash
npm run build
```

Hasil build berada di `out/`. Jalankan secara lokal:

```bash
python3 -m http.server 4173 --directory out
```

Buka [http://127.0.0.1:4173](http://127.0.0.1:4173). Hentikan server dengan `Ctrl+C`.

## Docker

Pastikan Docker Desktop aktif. Jalankan dengan Compose:

```bash
docker compose up --build
```

Buka [http://127.0.0.1:8080](http://127.0.0.1:8080). Hentikan dengan `Ctrl+C`, atau di terminal lain:

```bash
docker compose down
```

Tanpa Compose:

```bash
docker build -t adhitya-portfolio:local .
docker run --rm -p 8080:8080 adhitya-portfolio:local
```

## Pemeriksaan sebelum push

```bash
npm ci --ignore-scripts
npm audit --audit-level=high
npm run build
```

Semua perintah harus selesai tanpa error.

## Deployment

Workflow `.github/workflows/deploy.yml` berjalan pada push ke `main` atau pemanggilan manual. Workflow menginstal dependensi, mengaudit kerentanan high severity, membangun aplikasi sekali dengan Vercel CLI, lalu menerbitkan hasil prebuilt ke production Vercel.

Push ke `main` juga:

- membuat image Docker;
- mendorong image bertag `main` dan SHA commit ke GitHub Container Registry.

Workflow membutuhkan repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, dan `VERCEL_PROJECT_ID`. Project Vercel harus sudah ditautkan dan automatic deployment dinonaktifkan agar GitHub Actions menjadi satu-satunya jalur deployment production.

Push perubahan:

```bash
git add .
git commit -m "feat: convert portfolio to Next.js static export"
git push origin main
```

Pantau workflow **Deploy portfolio** melalui tab **Actions** dan deployment production melalui dashboard Vercel.

Jangan mengisi `candidate.portfolio_url` pada `profile.yml` sebelum URL tersebut aktif dan mengembalikan HTTP 200.

## Struktur utama

- `app/page.tsx`: halaman portfolio
- `app/layout.tsx`: root layout dan metadata
- `app/globals.css`: Tailwind dan token tema
- `next.config.ts`: konfigurasi static export
- `Dockerfile`: build multi-stage dan nginx unprivileged pada port 8080
- `docker-compose.yml`: build dan jalankan container lokal di port 8080
- `.github/workflows/deploy.yml`: audit, build dan deploy Vercel, serta publikasi GHCR

## Lisensi

Repository ini tersedia dengan [MIT License](LICENSE).
