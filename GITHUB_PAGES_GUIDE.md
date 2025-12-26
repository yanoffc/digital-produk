# 🚀 Panduan Deploy ke GitHub Pages

## 📋 Langkah-langkah Deploy ke GitHub.io

### 1. Persiapan File

Pastikan semua file sudah siap:
- ✅ index.html
- ✅ login.html
- ✅ admin.html
- ✅ payment-page.html
- ✅ payment-success.html
- ✅ callback.html
- ✅ style.css / app.min.css
- ✅ script.js / app.min.js
- ✅ admin.js
- ✅ admin.css
- ✅ tripay.js
- ✅ payment.js
- ✅ auth.js
- ✅ .nojekyll (penting!)

### 2. Buat Repository di GitHub

1. Login ke GitHub: https://github.com
2. Klik tombol **"+"** di kanan atas → **"New repository"**
3. Isi:
   - **Repository name**: `digital-payment` (atau nama lain)
   - **Description**: Landing page digital payment
   - **Visibility**: Public (wajib untuk GitHub Pages gratis)
   - Jangan centang "Initialize with README"
4. Klik **"Create repository"**

### 3. Upload File ke GitHub

#### Cara 1: Menggunakan GitHub Desktop (Paling Mudah)

1. Download GitHub Desktop: https://desktop.github.com
2. Install dan login dengan akun GitHub
3. File → Clone Repository
4. Pilih repository yang baru dibuat
5. Copy semua file ke folder repository
6. Di GitHub Desktop:
   - Klik "Changes"
   - Isi commit message: "Initial commit: Landing page digital payment"
   - Klik "Commit to main"
   - Klik "Push origin"

#### Cara 2: Menggunakan Git Command Line

```bash
# 1. Buka terminal/command prompt di folder project
cd C:\Users\Administrator\Downloads\web

# 2. Initialize git
git init

# 3. Add semua file
git add .

# 4. Commit
git commit -m "Initial commit: Landing page digital payment"

# 5. Add remote repository (ganti USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/USERNAME/digital-payment.git

# 6. Push ke GitHub
git branch -M main
git push -u origin main
```

#### Cara 3: Upload Manual via Web

1. Buka repository di GitHub
2. Klik **"uploading an existing file"**
3. Drag & drop semua file
4. Isi commit message
5. Klik **"Commit changes"**

### 4. Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **"Settings"** (di menu atas)
3. Scroll ke bagian **"Pages"** (sidebar kiri)
4. Di **"Source"**, pilih:
   - Branch: **main** (atau master)
   - Folder: **/ (root)**
5. Klik **"Save"**
6. Tunggu beberapa menit (1-5 menit)

### 5. Akses Website

Website akan tersedia di:
```
https://USERNAME.github.io/digital-payment/
```

Ganti:
- `USERNAME` = username GitHub Anda
- `digital-payment` = nama repository Anda

**Contoh:**
```
https://rifalosid.github.io/digital-payment/
```

---

## ⚙️ Konfigurasi Penting

### File .nojekyll

Pastikan file `.nojekyll` ada di root repository. File ini penting untuk:
- Mencegah Jekyll processing
- Memastikan semua file di-serve dengan benar
- File sudah ada di project

### Custom Domain (Opsional)

Jika punya domain sendiri:

1. Di Settings → Pages
2. Masukkan domain di **"Custom domain"**
3. Tambahkan file `CNAME` di root dengan isi:
   ```
   yourdomain.com
   ```
4. Setup DNS di domain provider:
   - Type: CNAME
   - Name: @ atau www
   - Value: USERNAME.github.io

---

## 🔧 Troubleshooting

### Website tidak muncul

1. **Cek Settings → Pages**
   - Pastikan branch "main" dan folder "/ (root)" sudah dipilih
   - Status harus "Your site is live at..."

2. **Tunggu beberapa menit**
   - GitHub Pages butuh waktu 1-5 menit untuk deploy
   - Refresh halaman Settings → Pages

3. **Cek file .nojekyll**
   - Pastikan file `.nojekyll` ada di root
   - File ini penting untuk GitHub Pages

4. **Cek nama file**
   - Pastikan `index.html` ada di root
   - Nama file case-sensitive

### Error 404

1. **Cek URL**
   - Pastikan URL benar: `https://USERNAME.github.io/REPO-NAME/`
   - Ganti `REPO-NAME` dengan nama repository

2. **Cek file path**
   - Semua file harus di root repository
   - Jangan ada folder tambahan

3. **Clear browser cache**
   - Ctrl + Shift + Delete
   - Clear cache dan reload

### Login tidak bekerja

1. **Cek localStorage**
   - GitHub Pages menggunakan HTTPS
   - localStorage bekerja dengan baik

2. **Cek console error**
   - F12 → Console
   - Lihat apakah ada error

3. **Test di browser lain**
   - Coba di Chrome, Firefox, dll

---

## 📝 Tips & Best Practices

### 1. Update Website

Setelah mengubah file:

```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

Website akan otomatis update dalam 1-5 menit.

### 2. Backup

- Semua file sudah di GitHub (backup otomatis)
- Bisa download ZIP dari GitHub

### 3. Version Control

- Gunakan commit message yang jelas
- Commit setiap perubahan penting

### 4. Security

- Jangan commit file sensitif (password, API key)
- Gunakan Settings di admin panel untuk API key
- File `.gitignore` sudah mengabaikan file sensitif

---

## 🎯 Quick Start

**Langkah Cepat:**

1. ✅ Buat repository di GitHub (Public)
2. ✅ Upload semua file (via GitHub Desktop atau web)
3. ✅ Settings → Pages → Pilih branch "main" → Save
4. ✅ Tunggu 1-5 menit
5. ✅ Akses: `https://USERNAME.github.io/REPO-NAME/`

**Selesai! Website sudah online! 🎉**

---

## 📞 Support

Jika ada masalah:
1. Cek console browser (F12)
2. Cek GitHub Pages status di Settings
3. Pastikan semua file sudah di-upload
4. Pastikan file `.nojekyll` ada

---

**Selamat! Website Anda sudah online di GitHub Pages! 🚀**

