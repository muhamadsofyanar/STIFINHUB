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
- Sinkronisasi aman daftar promotor API STIFIn cabang `JML-CAB-62`
- Pemeriksaan saldo voucher promotor satu per satu
- Pusat pesan StarSender V3 dengan fallback WhatsApp manual
- Antrean tindak lanjut lead dan review promotor
- Log pengiriman, webhook tersanitasi, dan laporan integrasi

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
- `integrations.js`: konektor API STIFIn dan StarSender
- `seed.js`: 120 materi awal dan 16 skrip WhatsApp
- `public/`: CSS dan JavaScript antarmuka
- `data/`: basis data JSON persisten
- `COOLIFY.md`: panduan deploy lengkap
- `ENVIRONMENT-COOLIFY.txt`: variabel yang siap ditempel ke Coolify
- `docker-compose.nginx.yml`: opsi stack dengan Nginx
- `nginx/default.conf`: konfigurasi reverse proxy Nginx
- `DEPLOYMENT-CHECKLIST.md`: pemeriksaan sebelum dan sesudah deploy

## Backup

Pemilik dan administrator dapat membuka menu Laporan lalu memilih **Cadangan lengkap**. Simpan file backup secara berkala di tempat terpisah.

## Catatan penggunaan materi

Materi awal mengacu pada tema WSL 1, WSL 2, parenting, learning, teaching, profesi, bisnis, kepemimpinan, finansial, rezeki, pasangan, prosedur layanan tes, dan jaringan wilayah. Tim tetap perlu meninjau klaim, biaya, jadwal, dan ketentuan resmi sebelum menerbitkan konten.

## Integrasi StarSender

Masukkan API key hanya melalui Environment Variables Coolify. Jangan menaruh kunci di repository. Sampai `STARSENDER_ENABLED=true`, `STARSENDER_SEND_URL`, dan `STARSENDER_API_KEY` lengkap, Pusat Pesan tetap dapat membuka WhatsApp manual. Pengiriman otomatis hanya diizinkan untuk lead dengan kolom **Izin menerima pesan WhatsApp = Ya**.

Webhook dapat diarahkan ke:

```text
https://app.stifinmulia.com/webhooks/starsender/NILAI_STARSENDER_WEBHOOK_SECRET
```

Gunakan URL kirim dan format autentikasi resmi yang tampil pada akun StarSender V3 Premium Anda; aplikasi tidak menebak endpoint agar kunci dan pesan tidak terkirim ke alamat yang salah.
