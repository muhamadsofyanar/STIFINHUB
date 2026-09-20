# STIFIn Mulia Marketing Hub

Aplikasi internal untuk mengelola pemasaran dan operasional STIFIn Mulia. Aplikasi ini dipasang terpisah dari website publik pada `app.stifinmulia.com`.

## Modul

- Dashboard ringkas dan aktivitas tim
- Bank konten 120 materi awal
- Kalender publikasi
- CRM calon peserta tes
- Jalur calon promotor dari tes, WSL 1, WSL 2, sampai aktivasi
- Pendampingan kinerja promotor
- Rujukan peserta lintas wilayah berdasarkan persetujuan
- 16 skrip WhatsApp siap pakai
- Laporan konversi dan distribusi data
- Ekspor CSV dan backup JSON
- Pengguna tim dengan peran pemilik, admin, konten, CRM, dan viewer

## Menjalankan di komputer

Syarat: Node.js 20 atau lebih baru.

```bash
cp .env.example .env
npm start
```

Buka `http://localhost:3000`.

Saat pengembangan:

```bash
npm run dev
```

## Keamanan awal

Sebelum deploy, ubah nilai berikut:

- `APP_KEY`: rangkaian acak minimal 32 karakter
- `APP_ADMIN_EMAIL`: email pemilik
- `APP_ADMIN_PASSWORD`: password kuat minimal 10 karakter

Gunakan perintah berikut untuk membuat `APP_KEY`:

```bash
openssl rand -hex 32
```

Data aplikasi tersimpan dalam `data/database.json`. File tersebut tidak masuk Git. Pada Coolify, pasang persistent storage ke `/app/data`.

## Pengujian

```bash
npm test
```

Pengujian memeriksa login, 120 bank konten, penyimpanan lead, ekspor CSV, dan backup.

## Struktur

- `server.js`: server, autentikasi, CRUD, laporan, dan antarmuka
- `seed.js`: 120 materi awal dan 16 skrip WhatsApp
- `public/`: CSS dan JavaScript antarmuka
- `data/`: basis data JSON persisten
- `COOLIFY.md`: panduan deploy lengkap

## Backup

Pemilik dan administrator dapat membuka menu Laporan lalu memilih **Cadangan lengkap**. Simpan file backup secara berkala di tempat terpisah.

## Catatan penggunaan materi

Materi awal mengacu pada tema WSL 1, WSL 2, parenting, learning, teaching, profesi, bisnis, kepemimpinan, finansial, rezeki, pasangan, prosedur layanan tes, dan jaringan wilayah. Tim tetap perlu meninjau klaim, biaya, jadwal, dan ketentuan resmi sebelum menerbitkan konten.
