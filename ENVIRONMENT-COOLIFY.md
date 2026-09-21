# Environment Coolify

Dokumen ini berisi variabel environment untuk **STIFIn Mulia Growth OS v1.4.0**.

## 1. Konfigurasi aplikasi

Salin blok berikut ke menu **Environment Variables** di Coolify.

```env
NODE_ENV=production
PORT=3000
APP_NAME=STIFIn Mulia Marketing Hub
APP_URL=https://app.stifinmulia.com
BUSINESS_WHATSAPP=081333362649
APP_KEY=WAJIB_GANTI_DENGAN_KUNCI_ACAK
APP_ADMIN_EMAIL=WAJIB_GANTI_DENGAN_EMAIL_PEMILIK
APP_ADMIN_PASSWORD=WAJIB_GANTI_DENGAN_PASSWORD_KUAT
COOKIE_SECURE=true
DATA_FILE=/app/data/database.json
BACKUP_DIR=/app/data/backups
BACKUP_INTERVAL_MINUTES=360
BACKUP_RETENTION=30
TZ=Asia/Jakarta
```

Gunakan perintah berikut untuk membuat `APP_KEY`:

```bash
openssl rand -hex 32
```

## 2. API STIFIn

Kode cabang telah diarahkan ke cabang STIFIn Mulia.

```env
STIFIN_API_BASE=https://apro.stifin.id/api
STIFIN_BRANCH_CODE=JML-CAB-62
INTEGRATION_TIMEOUT_MS=15000
```

Jika API STIFIn memerlukan autentikasi tambahan, gunakan:

```env
STIFIN_API_AUTH_HEADER=
STIFIN_API_AUTH_VALUE=
```

Biarkan kedua variabel tersebut kosong selama endpoint cabang dapat diakses tanpa autentikasi tambahan.

## 3. StarSender V3 Premium

Gunakan konfigurasi aman berikut pada tahap awal:

```env
STARSENDER_ENABLED=false
STARSENDER_SEND_URL=https://api.starsender.online/api/send
STARSENDER_API_KEY=WAJIB_ISI_DEVICE_API_KEY_DARI_MENU_DEVICE
STARSENDER_AUTH_HEADER=Authorization
STARSENDER_AUTH_SCHEME=
STARSENDER_WEBHOOK_SECRET=WAJIB_GANTI_DENGAN_TOKEN_ACAK
```

Buat token webhook menggunakan:

```bash
openssl rand -hex 32
```

Jangan menyimpan `STARSENDER_API_KEY` atau token webhook di GitHub. Nilai `STARSENDER_API_KEY` harus memakai **Device API Key** dari menu Device StarSender. StarSender V3 menerima kunci langsung pada header `Authorization`, sehingga `STARSENDER_AUTH_SCHEME` dibiarkan kosong.

## 4. Alamat webhook StarSender

Setelah `STARSENDER_WEBHOOK_SECRET` dibuat, masukkan alamat berikut pada pengaturan webhook StarSender:

```text
https://app.stifinmulia.com/webhooks/starsender/NILAI_STARSENDER_WEBHOOK_SECRET
```

Ganti bagian `NILAI_STARSENDER_WEBHOOK_SECRET` dengan nilai yang sama seperti di Coolify.

## 5. Aktivasi StarSender

Aktifkan integrasi setelah URL pengiriman, API key, dan device key telah terisi dan terverifikasi.

```env
STARSENDER_ENABLED=true
```

Lakukan **Redeploy** setelah mengubah environment. Pengiriman otomatis hanya berlaku untuk lead yang memiliki status **Izin menerima pesan WhatsApp = Ya**. Jika integrasi belum aktif, operator tetap dapat memakai tombol **Buka WhatsApp**.

## Pengaturan port Coolify

- Cara yang direkomendasikan: Docker Compose dengan file `/docker-compose.coolify.yml`, service `app`, dan internal port `3000`.
- Jika memakai `docker-compose.nginx.yml`, gunakan internal port `80`.
- Jika menjalankan aplikasi langsung dari `Dockerfile`, gunakan internal port `3000`.
- Pada mode Dockerfile, buat Persistent Storage dengan destination path `/app/data`. Tanpa pengaturan ini, data dapat hilang ketika container diganti.
- Domain utama dashboard: `https://app.stifinmulia.com`.
- Formulir konsultasi publik: `https://app.stifinmulia.com/forms/consultation`.
