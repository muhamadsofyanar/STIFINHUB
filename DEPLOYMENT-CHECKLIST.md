# Checklist Deploy Produksi

## Sebelum deploy

- [ ] Repository GitHub berisi seluruh file proyek
- [ ] File `.env` tidak masuk repository
- [ ] `APP_KEY` sudah dibuat dengan `openssl rand -hex 32`
- [ ] Email pemilik sudah ditentukan
- [ ] Password awal minimal 10 karakter dan tidak dipakai di layanan lain
- [ ] DNS `app.stifinmulia.com` mengarah ke server Coolify

## Konfigurasi Coolify

- [ ] Build pack sesuai mode yang dipilih
- [ ] Port layanan benar
- [ ] Semua environment variables sudah diisi
- [ ] Persistent volume terpasang pada `/app/data`
- [ ] Domain memakai `https://app.stifinmulia.com`
- [ ] SSL aktif
- [ ] Health check berhasil

## Setelah deploy

- [ ] `/health` menghasilkan `{"ok":true}`
- [ ] Login pemilik berhasil
- [ ] Password awal sudah diganti melalui Profil
- [ ] Satu lead uji berhasil disimpan
- [ ] Redeploy tidak menghapus lead uji
- [ ] Backup JSON berhasil diunduh
- [ ] Akun tim dibuat sesuai peran
- [ ] Lead uji sudah dihapus
