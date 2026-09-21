# Checklist Deploy Produksi

## Sebelum deploy

- [ ] Repository GitHub berisi seluruh file proyek
- [ ] File `.env` tidak masuk repository
- [ ] `APP_KEY` sudah dibuat dengan `openssl rand -hex 32`
- [ ] Email pemilik sudah ditentukan
- [ ] Password awal minimal 10 karakter dan tidak dipakai di layanan lain
- [ ] `BUSINESS_WHATSAPP` berisi `081333362649`
- [ ] Device API Key StarSender diisi tanpa awalan `Bearer`
- [ ] `STARSENDER_AUTH_SCHEME` dibiarkan kosong
- [ ] DNS `app.stifinmulia.com` mengarah ke server Coolify

## Konfigurasi Coolify

- [ ] Build pack sesuai mode yang dipilih
- [ ] Port layanan benar
- [ ] Semua environment variables sudah diisi
- [ ] Persistent volume terpasang pada `/app/data`
- [ ] Volume menggunakan nama tetap `stifin-mulia-growth-os-data`
- [ ] Domain memakai `https://app.stifinmulia.com`
- [ ] SSL aktif
- [ ] Health check berhasil

## Setelah deploy

- [ ] `/health` menghasilkan `{"ok":true}`
- [ ] Login pemilik berhasil
- [ ] Password awal sudah diganti melalui Profil
- [ ] Satu lead uji berhasil disimpan
- [ ] Redeploy tidak menghapus lead uji
- [ ] Menu Integrasi menampilkan penyimpanan dapat ditulis dan ID instalasi tetap sama setelah redeploy
- [ ] Cadangan manual berhasil dibuat sebelum pembaruan besar
- [ ] Backup JSON berhasil diunduh
- [ ] Backup JSON dapat dipilih pada formulir pemulihan tanpa pesan kesalahan
- [ ] Growth CRM dapat dibuka
- [ ] Form `/forms/consultation` berhasil membuat lead
- [ ] Tautan kampanye mencatat klik
- [ ] Pesan masuk webhook tampil di Inbox WhatsApp
- [ ] Copywriting Lab menghasilkan enam format
- [ ] Akun tim dibuat sesuai peran
- [ ] Lead uji sudah dihapus
