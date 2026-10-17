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

### Penyempurnaan visual dan animasi

- Intro desktop memakai grid dua kolom sejajar dengan frame Experience; nama, deskripsi rata kiri, dan keterampilan punya hierarki yang terpisah. Mobile tetap satu kolom.
- Token teks sekunder kedua tema memenuhi kontras baca; navigasi desktop memakai font 14px dan target minimal 44px. Fokus keyboard dan warna seleksi mengikuti tema.
- Inter variable disajikan lokal dari `public/fonts/`, dengan subset karakter portfolio dan bobot 400–800; lisensi SIL Open Font License ada di `public/fonts/OFL.txt`. Tidak ada permintaan Google Fonts saat runtime. `font-display: optional` mencegah pergantian font terlambat.
- Dua baris logo memakai animasi CSS transform, bukan penempatan setiap logo lewat JavaScript per frame. Hover/fokus menghentikan animasi; di luar viewport animasi berhenti. Reduced motion dan cetak menampilkan daftar statis. Logo asli tersedia dalam sprite SVG bersama; nama keterampilan tetap tersedia untuk pembaca layar.
- Highlight Experience berganti setiap tujuh detik hanya saat terlihat. Tombol Pause/Resume dan Next highlight memberi kontrol membaca. Transisi Projects tetap split-panel, dengan durasi 500ms dan easing keluar yang lebih tenang.
- Layout statis/mobile dan sticky/desktop dipilih oleh media query sejak HTML pertama, bukan mengganti seluruh struktur setelah hydration. Semua konten tetap ada untuk reduced motion/cetak. Scroll snap dokumen dihapus agar pergantian ukuran layout tidak menarik posisi baca.
- Gambar proyek memakai WebP 640/1200px, `srcSet`, dimensi eksplisit, lazy loading, dan decoding async. CSS Tailwind ringkas di-inline oleh opsi Next.js `experimental.inlineCss` untuk mengurangi waterfall kunjungan pertama; tradeoff: CSS tidak di-cache terpisah dari HTML.


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

### Lighthouse production build

Pengukuran memakai Lighthouse CLI **13.5.0**, Headless Chrome **155**, static export `npm run build`, profil bawaan mobile serta `--preset=desktop`. Semua kategori bawaan dijalankan; tidak ada override throttling, kategori, user agent, atau konten khusus audit.

Hasil lokal melalui HTTPS/HTTP2 + gzip (`https://127.0.0.1:4185/`), tiga pengukuran berurutan per profil:

| Profil | Run | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- | --- |
| Mobile | 1 | 100 | 100 | 100 | 100 |
| Mobile | 2 | 100 | 100 | 100 | 100 |
| Mobile | 3 | 100 | 100 | 100 | 100 |
| Desktop | 1 | 100 | 100 | 100 | 100 |
| Desktop | 2 | 100 | 100 | 100 | 100 |
| Desktop | 3 | 100 | 100 | 100 | 100 |

Median Performance: mobile **100**, desktop **100**. Mobile memakai simulasi RTT 150ms, 1638.4 Kbps, CPU 4×, viewport 412×823; desktop RTT 40ms, 10240 Kbps, CPU 1×, viewport 1350×940. CLI `--ignore-certificate-errors` hanya untuk sertifikat self-signed preview lokal, bukan mematikan audit Lighthouse. Tidak ada perubahan trust store atau deployment.

Keterbatasan penting: preview HTTP/1.1 + gzip (`http://127.0.0.1:4184/`) pada build yang sama menghasilkan mobile **97/97/97**, desktop **100/100/100**, kategori lain 100. Karena itu angka 100 bukan janji untuk setiap server: transport, kompresi, mesin, dan jaringan memengaruhi hasil. Preview Python sederhana di atas tidak menyediakan kompresi/HTTP2; gunakan server produksi saat membandingkan. Deployment Vercel/nginx tetap tidak diubah dan belum diaudit melalui URL publik.

Laporan mentah JSON/HTML, screenshot sebelum/sesudah, konfigurasi profil, dan runner disimpan di luar repo pada direktori bukti tugas `portfolio-impeccable-polish-v4`: `final-{mobile,desktop}-{1,2,3}.report.{json,html}`, `final-results.json`, `http1-final-*`, serta `lighthouse-final.py`. Pengukuran ulang: jalankan production export melalui server HTTP2 + gzip, lalu `npx lighthouse@13.5.0 <URL> --output=json --output=html --output-path=<direktori-bukti>/mobile-1 --chrome-flags="--headless"`; tambahkan `--preset=desktop` untuk desktop. Ulangi tiga kali tanpa mengganti profil. Audit browser `chrome-devtools-axi lighthouse` juga menghasilkan 100 untuk Accessibility, Best Practices, dan SEO di kedua tema pada desktop/mobile; alat itu tidak mengukur Performance.


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
