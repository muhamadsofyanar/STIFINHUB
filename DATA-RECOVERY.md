# Perlindungan dan Pemulihan Data

## Mengapa data pernah hilang

Database aplikasi berada di `/app/data/database.json`. Container Docker akan diganti setiap kali Coolify melakukan redeploy. Jika `/app/data` tidak terhubung ke persistent volume, container baru akan membuat database kosong.

## Konfigurasi yang direkomendasikan

Deploy sebagai **Docker Compose** dengan file:

```text
/docker-compose.coolify.yml
```

Pasang domain pada service `app` dengan internal port `3000`. Compose memakai volume tetap bernama `stifin-mulia-growth-os-data`. Nama ini tidak berubah walaupun Coolify membuat ulang container.

Jika tetap memakai build pack Dockerfile, buka menu **Storage** di resource Coolify lalu buat:

```text
Type: Volume
Name: stifin-mulia-growth-os-data
Destination path: /app/data
```

## Migrasi sebelum mengganti mode deployment

1. Buka menu **Integrasi**.
2. Klik **Unduh Cadangan**.
3. Simpan file JSON di komputer.
4. Pasang persistent volume.
5. Redeploy.
6. Tambahkan satu lead uji.
7. Redeploy sekali lagi.
8. Pastikan lead uji masih ada.

## Memulihkan cadangan dari dashboard

1. Masuk sebagai pemilik atau administrator.
2. Buka menu **Integrasi**.
3. Buka bagian **Pulihkan dari file cadangan**.
4. Pilih file JSON yang sebelumnya diunduh dari aplikasi.
5. Centang konfirmasi, lalu klik **Pulihkan Cadangan**.

Aplikasi memvalidasi struktur cadangan, memastikan akun pemilik aktif tersedia, dan membuat cadangan database aktif sebelum pemulihan. Jika validasi gagal, data aktif tidak berubah.

Jangan menghapus resource lama sebelum cadangan berhasil diunduh.

## Cadangan otomatis

Aplikasi membuat cadangan bergulir di `/app/data/backups`. Pengaturan standar:

```env
BACKUP_INTERVAL_MINUTES=360
BACKUP_RETENTION=30
```

Cadangan lokal membantu ketika file database rusak. Cadangan ini tetap membutuhkan persistent volume. Unduh cadangan lengkap secara rutin untuk menyimpan salinan di luar server.

## Mencari data lama

Jika data sudah hilang dari tampilan, volume container lama mungkin masih tersedia di server. Jangan hapus volume Docker. Dari terminal server, administrator dapat memeriksa:

```bash
docker volume ls
```

Cari volume lama milik resource STIFIn Mulia. Data yang dicari bernama `database.json`. Lakukan pemeriksaan hanya pada volume terkait dan salin file sebelum mengubah resource aktif.
