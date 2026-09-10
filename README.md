# Adhitya Portfolio

Portfolio satu halaman berbasis Next.js App Router dan Tailwind CSS. Build menghasilkan static export di `out/`, dapat disajikan langsung, melalui nginx dalam Docker, atau melalui GitHub Pages.

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

Workflow `.github/workflows/deploy.yml` berjalan pada pull request ke `main`, push ke `main`, atau pemanggilan manual.

Pull request menjalankan build dan audit. Push ke `main` juga:

- menerbitkan static export ke GitHub Pages;
- membuat image Docker;
- mendorong image bertag `main` dan SHA commit ke GitHub Container Registry.

Sebelum deployment pertama, buka **Settings → Pages** pada repository GitHub dan pilih **GitHub Actions** sebagai source.

Push perubahan:

```bash
git add .
git commit -m "feat: convert portfolio to Next.js static export"
git push origin main
```

Pantau workflow **Deploy portfolio** melalui tab **Actions**. URL GitHub Pages biasanya:

```text
https://<username>.github.io/<repository>/
```

Jangan mengisi `candidate.portfolio_url` pada `profile.yml` sebelum URL tersebut aktif dan mengembalikan HTTP 200.

## Struktur utama

- `app/page.tsx`: halaman portfolio
- `app/layout.tsx`: root layout dan metadata
- `app/globals.css`: Tailwind dan token tema
- `next.config.ts`: konfigurasi static export dan base path GitHub Pages
- `Dockerfile`: build multi-stage dan nginx unprivileged pada port 8080
- `docker-compose.yml`: build dan jalankan container lokal di port 8080
- `.github/workflows/deploy.yml`: audit, build, GitHub Pages, dan GHCR

## Lisensi

Repository ini tersedia dengan [MIT License](LICENSE).
