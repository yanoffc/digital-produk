# 🚀 Panduan Setup cPanel Hosting

## 📋 Daftar Isi
1. [Persiapan File](#persiapan-file)
2. [Upload ke cPanel](#upload-ke-cpanel)
3. [Konfigurasi](#konfigurasi)
4. [Setup SSL](#setup-ssl)
5. [Login Admin](#login-admin)
6. [Troubleshooting](#troubleshooting)

---

## 📦 Persiapan File

### File yang Harus Diupload:
```
public_html/
├── index.html              (Landing page utama)
├── login.html              (Halaman login admin)
├── admin.html              (Admin panel)
├── payment-success.html    (Halaman sukses pembayaran)
├── download.html           (Halaman download)
├── cpanel-setup.html       (Panduan setup)
│
├── style.css               (Styling utama)
├── script.js               (JavaScript utama)
├── admin.css               (Styling admin)
├── admin.js                (JavaScript admin)
├── auth.js                 (Sistem autentikasi)
├── security.js             (Security utilities)
├── tripay.js               (Integrasi Tripay)
├── payment.js              (Handler pembayaran)
│
├── .htaccess               (Konfigurasi Apache)
├── web.config              (Konfigurasi IIS/Windows)
├── .nojekyll               (Untuk GitHub Pages)
├── .gitignore              (Git ignore)
│
└── README.md               (Dokumentasi)
```

---

## 📤 Upload ke cPanel

### Metode 1: File Manager (Recommended)

1. **Login ke cPanel**
   - Buka: `https://yourdomain.com/cpanel`
   - Login dengan kredensial hosting

2. **Buka File Manager**
   - Cari icon **"File Manager"** di cPanel
   - Pilih **"public_html"** atau **"www"**

3. **Upload File**
   - Klik **"Upload"** di toolbar
   - Pilih semua file website
   - Tunggu hingga upload selesai

4. **Extract ZIP (jika perlu)**
   - Jika file dalam format ZIP
   - Klik kanan file ZIP → **"Extract"**
   - Pindahkan file ke folder root

### Metode 2: FTP/SFTP

1. **Gunakan FTP Client** (FileZilla, WinSCP, dll)
2. **Koneksi ke server:**
   ```
   Host: yourdomain.com atau IP server
   Username: cPanel username
   Password: cPanel password
   Port: 21 (FTP) atau 22 (SFTP)
   ```
3. **Upload semua file ke `/public_html/`**

### Metode 3: Git (Advanced)

1. **SSH ke server:**
   ```bash
   ssh username@yourdomain.com
   ```

2. **Clone repository:**
   ```bash
   cd public_html
   git clone your-repo-url .
   ```

---

## ⚙️ Konfigurasi

### 1. Set File Permissions

Di File Manager cPanel:

- **Files**: `644`
- **Folders**: `755`
- **.htaccess**: `644`

**Cara set:**
1. Pilih file/folder
2. Klik kanan → **"Change Permissions"**
3. Set sesuai di atas
4. Klik **"Change Permissions"**

### 2. Pastikan .htaccess Aktif

1. Buka File Manager
2. Cek file `.htaccess` ada di root
3. Pastikan permission: `644`
4. Jika tidak ada, buat file baru dengan nama `.htaccess`
5. Copy isi dari file `.htaccess` yang sudah disediakan

### 3. Set Default Document

Di cPanel:
1. Buka **"Indexes"** atau **"Directory Index"**
2. Pastikan `index.html` ada di list
3. Jika tidak, tambahkan `index.html`

---

## 🔒 Setup SSL (HTTPS)

### Menggunakan Let's Encrypt (Gratis)

1. **Di cPanel:**
   - Buka **"SSL/TLS"**
   - Klik **"Let's Encrypt"**

2. **Install Certificate:**
   - Pilih domain
   - Klik **"Issue"**
   - Tunggu hingga selesai

3. **Aktifkan HTTPS:**
   - Buka file `.htaccess` di File Manager
   - Uncomment baris HTTPS:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

4. **Test:**
   - Buka: `https://yourdomain.com`
   - Pastikan ada icon gembok di browser

---

## 👤 Login Admin

### Kredensial Default:

```
Username: RifalosID
Password: Rifalos2024!@#Secure
```

### Cara Login:

1. **Via Menu:**
   - Buka website: `https://yourdomain.com`
   - Klik menu **"Admin Login"**
   - Atau langsung: `https://yourdomain.com/login.html`

2. **Masukkan Kredensial:**
   - Username: `RifalosID`
   - Password: `Rifalos2024!@#Secure`
   - Klik **"Masuk"**

3. **Setelah Login:**
   - Anda akan diarahkan ke Admin Panel
   - Mulai setup produk dan settings

### ⚠️ PENTING:
- **Ganti password** setelah pertama kali login!
- Jangan share kredensial ke siapapun
- Simpan kredensial dengan aman

---

## 🔧 Troubleshooting

### Website Tidak Muncul

**Problem:** Halaman kosong atau 404

**Solution:**
1. Cek file `index.html` ada di `public_html`
2. Cek permission file: `644`
3. Cek default document di cPanel
4. Clear browser cache
5. Cek error log di cPanel → **"Errors"**

### CSS/JS Tidak Load

**Problem:** Styling hilang atau JavaScript error

**Solution:**
1. Cek semua file `.css` dan `.js` sudah terupload
2. Cek path file di HTML (harus relatif: `style.css` bukan `/style.css`)
3. Cek browser console (F12) untuk error
4. Pastikan MIME types benar di `.htaccess`

### Login Tidak Bisa

**Problem:** Tidak bisa login atau redirect loop

**Solution:**
1. Clear browser localStorage dan sessionStorage
2. Cek file `auth.js` dan `login.html` sudah terupload
3. Cek browser console untuk error
4. Pastikan JavaScript enabled di browser
5. Coba di browser lain atau incognito mode

### .htaccess Tidak Bekerja

**Problem:** Redirect atau security headers tidak aktif

**Solution:**
1. Cek permission `.htaccess`: `644`
2. Pastikan mod_rewrite enabled di server
3. Cek Apache error log
4. Kontak support hosting jika perlu

### SSL Error

**Problem:** Certificate error atau mixed content

**Solution:**
1. Pastikan SSL sudah terinstall
2. Pastikan semua resource menggunakan HTTPS
3. Cek mixed content di browser console
4. Update semua link internal ke HTTPS

---

## 📝 Checklist Setup

Gunakan checklist ini untuk memastikan semua sudah benar:

- [ ] Semua file sudah terupload ke `public_html`
- [ ] File permissions sudah diset (644 untuk file, 755 untuk folder)
- [ ] File `.htaccess` ada dan permission 644
- [ ] Domain sudah terhubung ke cPanel
- [ ] SSL certificate sudah terinstall (disarankan)
- [ ] Website bisa diakses: `https://yourdomain.com`
- [ ] Landing page muncul dengan benar
- [ ] CSS dan JavaScript load dengan benar
- [ ] Bisa akses login page: `https://yourdomain.com/login.html`
- [ ] Bisa login dengan kredensial admin
- [ ] Admin panel berfungsi dengan baik

---

## 🆘 Support

Jika masih ada masalah:

1. **Cek Error Log:**
   - cPanel → **"Errors"**
   - Lihat error terbaru

2. **Cek Browser Console:**
   - Tekan F12
   - Lihat tab Console untuk JavaScript error
   - Lihat tab Network untuk failed requests

3. **Kontak Support:**
   - Support hosting Anda
   - Atau buka issue di repository

---

## 🔐 Keamanan Tambahan

### Setelah Setup:

1. **Ganti Password Admin:**
   - Login sebagai admin
   - Edit file `auth.js` untuk ganti password
   - Clear localStorage browser

2. **Backup Berkala:**
   - Backup semua file via File Manager
   - Download backup ke komputer lokal

3. **Monitor Logs:**
   - Cek error log secara berkala
   - Monitor aktivitas mencurigakan

4. **Update Secara Berkala:**
   - Update file jika ada patch security
   - Keep dependencies updated

---

**Selamat! Website Anda sudah siap digunakan! 🎉**

