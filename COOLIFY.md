# Deploy ke Coolify

## 1. Unggah ke GitHub

1. Buat repository baru, misalnya `stifin-mulia-marketing-hub`.
2. Unggah seluruh isi folder proyek ini ke root repository.
3. Pastikan `Dockerfile`, `server.js`, `integrations.js`, `seed.js`, `package.json`, dan folder `public` terlihat di GitHub.
4. Jangan unggah file `.env` atau `data/database.json`.

## 2. Pilih mode deploy

### Mode A: Dockerfile tanpa Nginx tambahan

Mode ini direkomendasikan. Coolify sudah memiliki reverse proxy dan SSL.

1. Pilih **New Resource**.
2. Pilih **Public Repository** atau GitHub App jika repository bersifat privat.
3. Masukkan URL repository.
4. Pilih branch `main`.
5. Pilih build pack **Dockerfile**.
6. Isi port aplikasi dengan **3000**.

Port internal aplikasi adalah 3000. Tidak perlu mengubahnya menjadi 80. Coolify menerima trafik HTTPS pada domain lalu meneruskannya ke port 3000.

### Mode B: Docker Compose dengan Nginx

Gunakan mode ini hanya jika ingin Nginx berada di dalam stack aplikasi.

1. Pilih **New Resource** lalu **Docker Compose**.
2. Gunakan repository dan branch `main`.
3. Isi lokasi compose file dengan `/docker-compose.nginx.yml`.
4. Pilih service `nginx` sebagai service yang menerima domain.
5. Gunakan port **80** pada service `nginx`.
6. Jangan memasang domain pada service `app`.

Compose dapat dimuat sebelum environment diisi. Namun, isi seluruh environment variables sebelum menekan Deploy.

Alurnya menjadi: internet dan HTTPS Coolify, service Nginx port 80, lalu aplikasi Node.js port 3000.

## 3. Tambahkan environment variables

Salin isi `ENVIRONMENT-COOLIFY.txt` ke menu **Environment Variables**. Ganti nilai `APP_KEY`, `APP_ADMIN_EMAIL`, `APP_ADMIN_PASSWORD`, Device API Key StarSender, serta webhook secret. Pastikan `BUSINESS_WHATSAPP=081333362649`.

Untuk membuat `APP_KEY`, jalankan:

```bash
openssl rand -hex 32
```

Jangan mengganti `APP_ADMIN_PASSWORD` setelah basis data pertama dibuat dengan harapan password login ikut berubah. Setelah login pertama, ubah password melalui menu Profil.

## 4. Pasang persistent storage

Pada Mode A, buka menu Storage Coolify:

- Type: Volume
- Destination path: `/app/data`
- Name: `stifin-mulia-data`

Langkah ini wajib. Tanpa volume, data dapat hilang saat container dibuat ulang.

Pada Mode B, named volume `stifin_mulia_data` sudah didefinisikan di `docker-compose.nginx.yml`. Pastikan volume tersebut muncul setelah deployment.

## 5. Hubungkan domain

1. Tambahkan domain `https://app.stifinmulia.com` pada aplikasi.
2. Di pengelola DNS, buat record `A` untuk `app` menuju IP server Coolify. Jika penyedia memberi target CNAME, gunakan CNAME tersebut.
3. Aktifkan HTTPS melalui Coolify.
4. Deploy ulang setelah DNS tersambung.

SSL tidak perlu dikonfigurasi di dalam Nginx. Coolify menangani sertifikat HTTPS di reverse proxy terluar.

## 6. Pemeriksaan setelah deploy

- Buka `https://app.stifinmulia.com/health`. Hasil harus `{"ok":true}`.
- Login memakai `APP_ADMIN_EMAIL` dan `APP_ADMIN_PASSWORD`.
- Ganti password lewat Profil.
- Tambahkan satu data uji.
- Redeploy aplikasi.
- Pastikan data uji tetap ada. Ini membuktikan volume sudah benar.
- Hapus data uji jika sudah selesai.
- Buka `/forms/consultation` dan kirim satu lead uji.
- Buat satu kampanye lalu uji tautan `/go/KODE-KAMPANYE`.
- Pastikan webhook StarSender menampilkan pesan masuk pada Inbox WhatsApp.

## 7. Pembaruan berikutnya

Unggah perubahan ke branch `main`, lalu tekan **Redeploy**. Jika webhook GitHub aktif, Coolify dapat melakukan deploy otomatis.

## 8. Operasional rutin

- Unduh backup JSON setiap pekan.
- Buat akun terpisah untuk anggota tim.
- Berikan peran sesuai tugas.
- Jangan membagikan akun pemilik.
- Perbarui status lead dan tindak lanjut setiap hari.
- Tinjau bank konten setiap Senin.
