# STIFIn Mulia Growth OS

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
- Growth CRM berbentuk Kanban dengan lead scoring dan rekomendasi tindakan
- Communication Center untuk percakapan pribadi dan grup dari webhook StarSender
- Sinkronisasi daftar grup, balasan grup, status belum dibaca, label CRM, dan catatan internal
- Kampanye dengan tautan pelacakan, sumber lead, dan konversi booking
- Formulir konsultasi publik dengan persetujuan WhatsApp dan perlindungan spam
- Copywriting Lab yang mengubah satu materi menjadi enam format konten
- Persistent storage dengan identitas instalasi dan pemeriksaan tulis
- Cadangan lokal bergulir serta pemulihan otomatis saat database rusak
- Pemulihan cadangan JSON dari dashboard dengan validasi dan cadangan pengaman

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

Data aplikasi tersimpan dalam `data/database.json`. File tersebut tidak masuk Git. Pada Coolify, pasang persistent storage ke `/app/data`. Gunakan `docker-compose.coolify.yml` agar aplikasi selalu memakai volume tetap `stifin-mulia-growth-os-data`.

## Pengujian

```bash
npm test
```

Pengujian memeriksa login, 120 bank konten, penyimpanan lead, restart aplikasi, pemulihan database rusak, ekspor CSV, dan backup.

## Struktur

- `server.js`: server, autentikasi, CRUD, laporan, dan antarmuka
- `integrations.js`: konektor API STIFIn dan StarSender
- `seed.js`: 120 materi awal dan 16 skrip WhatsApp
- `public/`: CSS dan JavaScript antarmuka
- `data/`: basis data JSON persisten
- `COOLIFY.md`: panduan deploy lengkap
- `ENVIRONMENT-COOLIFY.txt`: variabel yang siap ditempel ke Coolify
- `docker-compose.nginx.yml`: opsi stack dengan Nginx
- `docker-compose.coolify.yml`: konfigurasi produksi yang direkomendasikan untuk Coolify
- `DATA-RECOVERY.md`: panduan perlindungan dan pencarian data lama
- `nginx/default.conf`: konfigurasi reverse proxy Nginx
- `DEPLOYMENT-CHECKLIST.md`: pemeriksaan sebelum dan sesudah deploy

## Backup

Pemilik dan administrator dapat membuka menu Integrasi untuk melihat status penyimpanan, membuat cadangan lokal, mengunduh cadangan lengkap, atau memulihkan file cadangan JSON. Sebelum pemulihan, aplikasi otomatis membuat salinan database aktif. Aplikasi juga menyimpan maksimal 30 cadangan bergulir di `/app/data/backups`. Simpan salinan unduhan di tempat terpisah.

## Catatan penggunaan materi

Materi awal mengacu pada tema WSL 1, WSL 2, parenting, learning, teaching, profesi, bisnis, kepemimpinan, finansial, rezeki, pasangan, prosedur layanan tes, dan jaringan wilayah. Tim tetap perlu meninjau klaim, biaya, jadwal, dan ketentuan resmi sebelum menerbitkan konten.

## Integrasi StarSender

Masukkan API key hanya melalui Environment Variables Coolify. Jangan menaruh kunci di repository. Gunakan **Device API Key** dari menu Device StarSender sebagai `STARSENDER_API_KEY`. Endpoint resmi pengiriman pribadi adalah `https://api.starsender.online/api/send`, daftar grup `https://api.starsender.online/api/whatsapp/groups`, dan pengiriman grup `https://api.starsender.online/api/send/grup`. `STARSENDER_AUTH_SCHEME` harus kosong karena kunci dikirim langsung pada header `Authorization`. Sampai integrasi lengkap, Communication Center tetap dapat membuka WhatsApp manual untuk percakapan pribadi. Pengiriman otomatis pribadi hanya diizinkan untuk lead dengan kolom **Izin menerima pesan WhatsApp = Ya**.

Webhook dapat diarahkan ke:

```text
https://app.stifinmulia.com/webhooks/starsender/NILAI_STARSENDER_WEBHOOK_SECRET
```

Aktifkan webhook Premium atau Group agar pesan baru masuk ke Communication Center. Aplikasi menyimpan percakapan mulai sejak webhook aktif, bukan mengambil seluruh riwayat lama dari WhatsApp. Daftar grup dapat dimuat lewat tombol **Sinkronkan Grup**.

## Growth CRM dan kampanye

Menu **Growth CRM** menampilkan lead dalam pipeline Kanban. Skor lead dihitung dari kelengkapan kebutuhan, izin WhatsApp, rencana layanan, kesiapan biaya, dan tahap CRM. Skor membantu menentukan prioritas, tetapi keputusan akhir tetap dilakukan oleh tim.

Setiap kampanye memiliki tautan publik:

```text
https://app.stifinmulia.com/go/KODE-KAMPANYE
```

Klik dicatat tanpa menyimpan alamat IP mentah. Jika URL tujuan tidak diisi, pengunjung diarahkan ke formulir konsultasi publik. Nomor layanan formulir dibaca dari `BUSINESS_WHATSAPP`.

## Copywriting Lab

Copywriting Lab menggunakan data yang sudah ada di Bank Konten. Satu materi dapat diturunkan menjadi headline, caption panjang, pesan WhatsApp, carousel tujuh slide, skrip Reels, dan outline artikel SEO. Tim tetap harus meninjau klaim, konteks, biaya, jadwal, serta ketentuan resmi sebelum publikasi.
