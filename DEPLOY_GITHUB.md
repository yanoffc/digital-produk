# 🚀 Quick Deploy ke GitHub Pages

## ⚡ Cara Cepat (5 Menit)

### 1. Buat Repository GitHub
```
1. Login ke github.com
2. Klik "+" → New repository
3. Nama: digital-payment (atau nama lain)
4. Public → Create repository
```

### 2. Upload File

**Opsi A: GitHub Desktop (Termudah)**
```
1. Download: desktop.github.com
2. Login → Clone repository
3. Copy semua file ke folder repo
4. Commit & Push
```

**Opsi B: Upload via Web**
```
1. Buka repository di GitHub
2. Klik "uploading an existing file"
3. Drag & drop semua file
4. Commit changes
```

**Opsi C: Git Command**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/digital-payment.git
git branch -M main
git push -u origin main
```

### 3. Aktifkan GitHub Pages
```
1. Settings → Pages
2. Source: main branch, / (root)
3. Save
4. Tunggu 1-5 menit
```

### 4. Akses Website
```
https://USERNAME.github.io/digital-payment/
```

---

## ✅ File yang Harus Diupload

**Wajib:**
- index.html
- login.html
- admin.html
- payment-page.html
- payment-success.html
- callback.html
- app.min.css (atau style.css + admin.css)
- app.min.js (atau semua .js files)
- tripay.js
- payment.js
- auth.js
- admin.js
- .nojekyll ⚠️ PENTING!

**Opsional:**
- README.md
- GITHUB_PAGES_GUIDE.md
- Dokumentasi lainnya

---

## 🔧 Troubleshooting

**Website tidak muncul?**
- Tunggu 1-5 menit
- Cek Settings → Pages status
- Pastikan file .nojekyll ada
- Pastikan repository Public

**Error 404?**
- Cek URL: https://USERNAME.github.io/REPO-NAME/
- Pastikan semua file di root
- Clear browser cache

**Login tidak bekerja?**
- Cek console (F12)
- Pastikan localStorage enabled
- Test di browser lain

---

**Selesai! Website online di GitHub Pages! 🎉**

