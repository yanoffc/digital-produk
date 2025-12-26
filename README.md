# Landing Page Digital Payment - WhatsApp Chat

Landing page modern untuk jualan produk digital payment dengan dukungan chat WhatsApp manual.

## 🚀 Fitur

- ✅ Design modern dan responsive
- ✅ Chat WhatsApp terintegrasi
- ✅ Animasi smooth dan interaktif
- ✅ Mobile-friendly
- ✅ SEO-friendly
- ✅ Fast loading

## 📁 Struktur File

```
.
├── index.html      # File HTML utama
├── style.css       # File CSS styling
├── script.js       # File JavaScript untuk interaktivitas
├── .nojekyll       # File untuk GitHub Pages
└── README.md       # Dokumentasi
```

## 🔧 Setup untuk GitHub Pages

### Cara 1: Menggunakan GitHub Pages (Recommended)

1. **Buat repository baru di GitHub**
   - Login ke GitHub
   - Klik "New repository"
   - Beri nama repository (contoh: `digital-payment-landing`)
   - Pilih Public
   - Jangan centang "Initialize with README"
   - Klik "Create repository"

2. **Upload file ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Landing page digital payment"
   git branch -M main
   git remote add origin https://github.com/USERNAME/digital-payment-landing.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages**
   - Buka repository di GitHub
   - Klik Settings
   - Scroll ke bagian "Pages"
   - Di "Source", pilih "Deploy from a branch"
   - Pilih branch "main" dan folder "/ (root)"
   - Klik "Save"
   - Tunggu beberapa menit, website akan tersedia di: `https://USERNAME.github.io/digital-payment-landing/`

### Cara 2: Menggunakan GitHub Desktop

1. Download GitHub Desktop
2. File > Add Local Repository
3. Pilih folder project ini
4. Commit dan Push ke GitHub
5. Aktifkan GitHub Pages di Settings repository

## ⚙️ Konfigurasi

### Mengganti Nomor WhatsApp

1. Buka file `index.html`
2. Cari semua `6281234567890` (nomor contoh)
3. Ganti dengan nomor WhatsApp Anda
4. Format: `62` + nomor tanpa `0` di depan
   - Contoh: `081234567890` → `6281234567890`

### Mengganti Konten

- Edit teks langsung di `index.html`
- Edit styling di `style.css`
- Edit animasi/interaksi di `script.js`

## 🎨 Kustomisasi

### Mengganti Warna

Edit variabel CSS di `style.css`:

```css
:root {
    --primary-color: #25D366;    /* Warna utama (hijau WhatsApp) */
    --primary-dark: #128C7E;     /* Warna utama gelap */
    --secondary-color: #075E54;  /* Warna sekunder */
}
```

### Menambah/Mengurangi Section

1. Copy struktur section yang ada di `index.html`
2. Sesuaikan konten
3. Tambahkan styling di `style.css` jika perlu

## 📱 Testing

1. Buka `index.html` di browser untuk testing lokal
2. Test di berbagai ukuran layar (mobile, tablet, desktop)
3. Test semua link WhatsApp
4. Pastikan animasi berjalan dengan baik

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Catatan

- Pastikan semua link WhatsApp menggunakan format: `https://wa.me/62XXXXXXXXXX`
- File `.nojekyll` diperlukan agar GitHub Pages tidak memproses file dengan Jekyll
- Semua resource external (fonts, icons) menggunakan CDN yang reliable

## 🐛 Troubleshooting

### Website tidak muncul di GitHub Pages
- Pastikan file `.nojekyll` ada di root folder
- Pastikan branch yang digunakan adalah `main` atau `master`
- Tunggu 5-10 menit setelah aktivasi GitHub Pages

### Styling tidak muncul
- Pastikan path file CSS benar: `href="style.css"`
- Pastikan file `style.css` ada di folder yang sama dengan `index.html`

### JavaScript tidak bekerja
- Buka Console browser (F12) untuk melihat error
- Pastikan file `script.js` ada di folder yang sama
- Pastikan path di HTML: `src="script.js"`

## 📄 License

Free to use for personal and commercial projects.

## 👤 Support

Jika ada pertanyaan atau butuh bantuan, silakan hubungi melalui WhatsApp yang tertera di website.

---

**Happy Coding! 🚀**

