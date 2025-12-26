# 🌐 Panduan Setup untuk SEMUA Webhosting

Website ini **100% kompatibel** dengan semua jenis webhosting!

## ✅ Webhosting yang Didukung

### Control Panel:
- ✅ **cPanel** (Linux/Windows)
- ✅ **Plesk** (Linux/Windows)
- ✅ **DirectAdmin**
- ✅ **Webmin/Virtualmin**
- ✅ **ISPConfig**
- ✅ **aaPanel**
- ✅ **CyberPanel**

### Server Types:
- ✅ **Apache** (mod_rewrite, mod_headers)
- ✅ **Nginx**
- ✅ **LiteSpeed**
- ✅ **IIS/Windows**
- ✅ **CloudLinux**
- ✅ **Shared Hosting**
- ✅ **VPS/Dedicated Server**
- ✅ **Cloud Hosting** (AWS, Google Cloud, Azure)

---

## 🔐 Kredensial Admin

### Default Login:
```
URL: https://yourdomain.com/login.html
Username: RifalosID
Password: admin123
```

⚠️ **PENTING**: Ganti password setelah pertama kali login!

---

## 📤 Cara Upload ke Webhosting

### Metode 1: File Manager (Semua Control Panel)

1. **Login ke Control Panel** hosting Anda
2. **Buka File Manager**
3. **Masuk ke folder root:**
   - cPanel: `public_html` atau `www`
   - Plesk: `httpdocs`
   - DirectAdmin: `public_html`
   - IIS: `wwwroot` atau `inetpub/wwwroot`
4. **Upload semua file** ke folder tersebut
5. **Set permissions:**
   - Files: `644`
   - Folders: `755`

### Metode 2: FTP/SFTP

**FTP Settings:**
```
Host: yourdomain.com atau IP server
Port: 21 (FTP) atau 22 (SFTP)
Username: [cPanel/Plesk username]
Password: [cPanel/Plesk password]
Protocol: FTP atau SFTP
```

**Upload ke:**
- `/public_html/` (cPanel)
- `/httpdocs/` (Plesk)
- `/www/` (DirectAdmin)

### Metode 3: Git (VPS/Dedicated)

```bash
cd /var/www/html  # atau path sesuai server
git clone your-repo-url .
```

---

## ⚙️ Konfigurasi per Webhosting

### cPanel
1. Upload semua file ke `public_html`
2. File `.htaccess` akan otomatis aktif
3. Set permissions: Files `644`, Folders `755`
4. Selesai!

### Plesk
1. Upload semua file ke `httpdocs`
2. File `.htaccess` akan otomatis aktif
3. Atau gunakan `nginx.conf` jika menggunakan Nginx
4. Set permissions: Files `644`, Folders `755`

### DirectAdmin
1. Upload semua file ke `public_html`
2. File `.htaccess` akan otomatis aktif
3. Set permissions via File Manager
4. Selesai!

### Nginx (VPS/Dedicated)
1. Upload semua file ke `/var/www/html` atau sesuai konfigurasi
2. Copy isi `nginx.conf` ke server block Nginx
3. Reload Nginx: `sudo nginx -s reload`
4. Selesai!

### IIS/Windows
1. Upload semua file ke `wwwroot` atau `inetpub/wwwroot`
2. File `web.config` akan otomatis aktif
3. Pastikan IIS Rewrite Module terinstall
4. Selesai!

### LiteSpeed
1. Upload semua file ke `public_html`
2. File `.htaccess` akan otomatis aktif
3. LiteSpeed kompatibel dengan Apache .htaccess
4. Selesai!

---

## 🔒 Setup SSL (HTTPS)

### Let's Encrypt (Gratis)

**cPanel:**
1. SSL/TLS → Let's Encrypt
2. Pilih domain → Issue
3. Uncomment HTTPS redirect di `.htaccess`

**Plesk:**
1. SSL/TLS Certificates → Let's Encrypt
2. Install certificate
3. Aktifkan "Redirect from HTTP to HTTPS"

**DirectAdmin:**
1. SSL Certificates → Let's Encrypt
2. Install certificate
3. Aktifkan HTTPS redirect

**Nginx:**
1. Install certbot: `sudo apt install certbot python3-certbot-nginx`
2. Generate: `sudo certbot --nginx -d yourdomain.com`
3. Auto-renewal sudah setup

---

## 📝 File Konfigurasi

### Apache/cPanel/Plesk/DirectAdmin
- Gunakan file: **`.htaccess`**
- Otomatis aktif di semua Apache-based hosting

### Nginx
- Gunakan file: **`nginx.conf`**
- Copy ke server block Nginx

### IIS/Windows
- Gunakan file: **`web.config`**
- Otomatis aktif di IIS

### Universal
- File `.htaccess` kompatibel dengan:
  - Apache
  - LiteSpeed
  - CloudLinux
  - Semua shared hosting

---

## ✅ Checklist Setup

Setelah upload, pastikan:

- [ ] Semua file sudah terupload
- [ ] File `.htaccess` ada di root (untuk Apache)
- [ ] File `web.config` ada (untuk IIS)
- [ ] Permissions sudah benar (644/755)
- [ ] Website bisa diakses: `http://yourdomain.com`
- [ ] Login admin berfungsi: `http://yourdomain.com/login.html`
- [ ] SSL aktif (disarankan)
- [ ] Semua CSS/JS load dengan benar

---

## 🐛 Troubleshooting

### Website Tidak Muncul

**Problem:** Halaman kosong atau 404

**Solution:**
1. Cek file `index.html` ada di root folder
2. Cek default document di control panel
3. Cek error log di control panel
4. Clear browser cache

### CSS/JS Tidak Load

**Problem:** Styling hilang

**Solution:**
1. Cek semua file `.css` dan `.js` sudah terupload
2. Cek path di HTML (harus relatif)
3. Cek browser console (F12) untuk error
4. Cek MIME types di `.htaccess`

### Login Tidak Bisa

**Problem:** Tidak bisa login

**Solution:**
1. Clear browser localStorage: `F12 → Application → Clear Storage`
2. Cek file `auth.js` dan `login.html` sudah terupload
3. Cek browser console untuk error
4. Coba di browser lain atau incognito

**Default Credentials:**
```
Username: RifalosID
Password: admin123
```

### .htaccess Tidak Bekerja

**Problem:** Redirect atau security headers tidak aktif

**Solution:**
1. Cek permission `.htaccess`: `644`
2. Cek mod_rewrite enabled (kontak support hosting)
3. Untuk Nginx, gunakan `nginx.conf`
4. Untuk IIS, gunakan `web.config`

### Nginx Configuration

**Problem:** Website di Nginx tidak berfungsi

**Solution:**
1. Copy isi `nginx.conf` ke server block
2. Sesuaikan `server_name` dan `root` path
3. Test config: `sudo nginx -t`
4. Reload: `sudo nginx -s reload`

---

## 🔐 Keamanan

### Setelah Setup:

1. **Ganti Password Admin:**
   - Login sebagai admin
   - Edit file `auth.js`
   - Ubah `ADMIN_CREDENTIALS.password`
   - Clear localStorage browser

2. **Aktifkan SSL:**
   - Install SSL certificate
   - Uncomment HTTPS redirect
   - Test di: `https://yourdomain.com`

3. **Backup Berkala:**
   - Backup semua file via File Manager
   - Download ke komputer lokal

4. **Monitor:**
   - Cek error log secara berkala
   - Monitor aktivitas mencurigakan

---

## 📞 Support

Jika masih ada masalah:

1. **Cek Error Log:**
   - Di control panel hosting
   - Browser console (F12)

2. **Test di Browser Lain:**
   - Chrome, Firefox, Safari
   - Incognito/Private mode

3. **Kontak Support Hosting:**
   - Jika masalah server-side
   - Atau masalah konfigurasi

---

## 🎯 Quick Start

**Langkah Cepat:**

1. Upload semua file ke `public_html` (atau sesuai hosting)
2. Set permissions: Files `644`, Folders `755`
3. Buka: `http://yourdomain.com`
4. Login: `http://yourdomain.com/login.html`
   - Username: `RifalosID`
   - Password: `admin123`
5. Selesai! 🎉

---

**Website Anda sekarang kompatibel dengan SEMUA webhosting! 🚀**

