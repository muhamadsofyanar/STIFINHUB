# Deploy ke Coolify

## 1. Unggah ke GitHub

1. Buat repository baru, misalnya `stifin-mulia-marketing-hub`.
2. Unggah seluruh isi folder proyek ini ke root repository.
3. Pastikan `Dockerfile`, `server.js`, `seed.js`, `package.json`, dan folder `public` terlihat di GitHub.
4. Jangan unggah file `.env` atau `data/database.json`.

## 2. Buat aplikasi di Coolify

1. Pilih **New Resource**.
2. Pilih **Public Repository** atau GitHub App jika repository bersifat privat.
3. Masukkan URL repository.
4. Pilih branch `main`.
5. Pilih build pack **Dockerfile**.
6. Isi port aplikasi dengan **3000**.

Port internal aplikasi adalah 3000. Tidak perlu mengubahnya menjadi 80. Coolify menerima trafik HTTPS pada domain lalu meneruskannya ke port 3000.

## 3. Tambahkan environment variables

```text
NODE_ENV=production
PORT=3000
APP_NAME=STIFIn Mulia Marketing Hub
APP_URL=https://app.stifinmulia.com
APP_KEY=hasil-openssl-rand-hex-32
APP_ADMIN_EMAIL=email-pemilik
APP_ADMIN_PASSWORD=password-kuat
COOKIE_SECURE=true
DATA_FILE=/app/data/database.json
TZ=Asia/Jakarta
```

Jangan mengganti `APP_ADMIN_PASSWORD` setelah basis data pertama dibuat dengan harapan password login ikut berubah. Setelah login pertama, ubah password melalui menu Profil.

## 4. Pasang persistent storage

Pada menu Storage Coolify:

- Type: Volume
- Destination path: `/app/data`
- Name: `stifin-mulia-data`

Langkah ini wajib. Tanpa volume, data dapat hilang saat container dibuat ulang.

## 5. Hubungkan domain

1. Tambahkan domain `https://app.stifinmulia.com` pada aplikasi.
2. Di pengelola DNS, buat record `A` untuk `app` menuju IP server Coolify. Jika penyedia memberi target CNAME, gunakan CNAME tersebut.
3. Aktifkan HTTPS melalui Coolify.
4. Deploy ulang setelah DNS tersambung.

## 6. Pemeriksaan setelah deploy

- Buka `https://app.stifinmulia.com/health`. Hasil harus `{"ok":true}`.
- Login memakai `APP_ADMIN_EMAIL` dan `APP_ADMIN_PASSWORD`.
- Ganti password lewat Profil.
- Tambahkan satu data uji.
- Redeploy aplikasi.
- Pastikan data uji tetap ada. Ini membuktikan volume sudah benar.
- Hapus data uji jika sudah selesai.

## 7. Pembaruan berikutnya

Unggah perubahan ke branch `main`, lalu tekan **Redeploy**. Jika webhook GitHub aktif, Coolify dapat melakukan deploy otomatis.

## 8. Operasional rutin

- Unduh backup JSON setiap pekan.
- Buat akun terpisah untuk anggota tim.
- Berikan peran sesuai tugas.
- Jangan membagikan akun pemilik.
- Perbarui status lead dan tindak lanjut setiap hari.
- Tinjau bank konten setiap Senin.
