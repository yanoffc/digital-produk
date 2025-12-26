# Panduan Admin Panel - Digital Payment Landing Page

## 🔐 Sistem Autentikasi Admin

### Login Admin
- **URL**: `login.html`
- **Default Username**: `admin`
- **Default Password**: `admin123`

**⚠️ PENTING**: Ganti password default setelah pertama kali login!

### Cara Mengganti Password
1. Buka file `login.html`
2. Cari bagian JavaScript di bagian bawah
3. Ubah `DEFAULT_ADMIN` object:
```javascript
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'password-baru-anda'
};
```

## ⚙️ Pengaturan (Settings)

### Akses Settings
1. Login sebagai admin
2. Klik tombol **"Settings"** di header admin panel
3. Isi semua field yang diperlukan

### Pengaturan WhatsApp
- **Nomor WhatsApp**: Format `62XXXXXXXXXX` (tanpa + atau 0 di depan)
- Contoh: `081234567890` → `6281234567890`
- Nomor ini akan otomatis digunakan di semua link WhatsApp di landing page

### Pengaturan Tripay

#### 1. Daftar di Tripay
- Kunjungi: https://tripay.co.id
- Daftar akun merchant
- Verifikasi akun Anda

#### 2. Dapatkan API Credentials
1. Login ke dashboard Tripay: https://dashboard.tripay.co.id
2. Masuk ke menu **"API"** atau **"Pengaturan"**
3. Salin:
   - **API Key**
   - **Private Key**
   - **Merchant Code**

#### 3. Konfigurasi di Admin Panel
1. Login ke admin panel
2. Buka **Settings**
3. Isi:
   - **Tripay API Key**: Paste API Key dari dashboard
   - **Tripay Private Key**: Paste Private Key dari dashboard
   - **Tripay Merchant Code**: Paste Merchant Code dari dashboard
   - **Mode Tripay**: 
     - **Sandbox**: Untuk testing (disarankan untuk pertama kali)
     - **Production**: Untuk live/real transaction

#### 4. Testing Payment
- Gunakan mode **Sandbox** untuk testing
- Tripay menyediakan nomor virtual account untuk testing
- Setelah yakin semua berfungsi, ubah ke mode **Production**

## 📦 Manajemen Produk

### Tambah Produk
1. Klik **"Tambah Produk Baru"**
2. Isi form:
   - **Nama Produk**: Nama produk yang akan ditampilkan
   - **Kategori**: Pilih kategori produk
   - **Harga**: Harga produk (dalam Rupiah)
   - **Stok**: Jumlah stok tersedia
   - **Deskripsi**: Deskripsi produk (opsional)
   - **Batas Stok Menipis**: Produk akan ditandai jika stok di bawah nilai ini
3. Klik **"Simpan"**

### Edit Produk
1. Klik tombol **"Edit"** pada produk yang ingin diubah
2. Ubah data yang diperlukan
3. Klik **"Simpan"**

### Hapus Produk
1. Klik tombol **"Hapus"** pada produk
2. Konfirmasi penghapusan
3. Produk akan dihapus permanen

### Update Stok
- Edit produk yang ingin diupdate stoknya
- Ubah nilai **Stok**
- Simpan perubahan

## 💳 Sistem Pembayaran Tripay

### Cara Kerja
1. Buyer memilih produk di landing page
2. Klik **"Beli Sekarang"**
3. Isi data customer (Nama, Email, WhatsApp)
4. Sistem membuat transaksi di Tripay
5. Buyer diarahkan ke halaman pembayaran Tripay
6. Setelah pembayaran berhasil, buyer diarahkan ke halaman sukses

### Payment Methods yang Didukung
Tripay mendukung berbagai metode pembayaran:
- **QRIS** (QR Code)
- **Virtual Account** (Bank Transfer)
- **E-Wallet** (OVO, DANA, LinkAja, dll)
- **Credit Card**

### Callback & Webhook
- **Callback URL**: Otomatis di-set ke `/callback.html`
- **Return URL**: Otomatis di-set ke `/payment-success.html`
- Untuk production, pastikan URL ini accessible dari internet

## 🔒 Keamanan

### Proteksi Admin Panel
- Admin panel hanya bisa diakses setelah login
- Session disimpan di `sessionStorage` (hilang saat tutup browser)
- Buyer tidak bisa akses admin panel tanpa login

### Rekomendasi Keamanan
1. **Ganti password default** segera setelah setup
2. **Jangan share** kredensial admin
3. **Gunakan HTTPS** untuk production
4. **Backup data** secara berkala (export dari localStorage)

## 📊 Fitur Dashboard

### Statistik
- **Total Produk**: Jumlah semua produk
- **Total Stok**: Total stok semua produk
- **Stok Menipis**: Produk dengan stok di bawah threshold

### Pencarian
- Gunakan search box untuk mencari produk
- Pencarian berdasarkan nama atau kategori

## 🛠️ Troubleshooting

### Admin tidak bisa login
- Pastikan username dan password benar
- Clear browser cache dan localStorage
- Cek console browser untuk error

### Tripay tidak bekerja
- Pastikan API Key, Private Key, dan Merchant Code benar
- Cek mode (Sandbox/Production) sesuai kebutuhan
- Pastikan koneksi internet stabil
- Cek console browser untuk error detail

### Produk tidak muncul di landing page
- Pastikan produk memiliki stok > 0
- Refresh halaman landing page
- Cek apakah produk sudah disimpan di admin panel

### WhatsApp link tidak update
- Pastikan nomor WhatsApp sudah di-set di Settings
- Refresh halaman landing page
- Clear browser cache

## 📝 Catatan Penting

1. **Data disimpan di localStorage browser**
   - Data akan hilang jika clear browser data
   - Backup data secara berkala
   - Untuk production, pertimbangkan menggunakan database

2. **Tripay API**
   - Sandbox: https://tripay.co.id/api-sandbox
   - Production: https://tripay.co.id/api
   - Dokumentasi lengkap: https://tripay.co.id/developer

3. **Testing**
   - Selalu test di mode Sandbox terlebih dahulu
   - Pastikan semua fitur bekerja sebelum go live
   - Test berbagai metode pembayaran

## 🆘 Support

Jika ada masalah atau pertanyaan:
1. Cek dokumentasi Tripay: https://tripay.co.id/developer
2. Hubungi support Tripay jika masalah terkait payment gateway
3. Review kode dan console browser untuk error

---

**Selamat menggunakan Admin Panel! 🚀**

