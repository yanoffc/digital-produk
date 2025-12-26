# 🔐 Kredensial Admin - RifalosID

## ⚠️ INFORMASI PENTING - JANGAN SHARE FILE INI!

File ini berisi kredensial admin yang sangat sensitif. Simpan dengan aman dan jangan share ke siapapun!

---

## 👤 Akun Admin

### Username
```
RifalosID
```

### Password (Enhanced Security)
```
Admin2024!@#Secure
```

⚠️ **PENTING**: 
- Password baru dengan keamanan tingkat tinggi
- Minimal 12 karakter dengan kombinasi huruf, angka, dan simbol
- Password di-hash dengan salt untuk keamanan maksimal
- Untuk ganti password, edit file `advanced-auth.js` bagian password

---

## 🔒 Fitur Keamanan yang Diterapkan

### 1. Password Hashing
- Password di-hash menggunakan SHA-256
- Tidak ada password yang disimpan dalam bentuk plain text
- Double encryption untuk data admin

### 2. Rate Limiting
- Maksimal 5 percobaan login
- Lockout selama 15 menit setelah 5 percobaan gagal
- Counter reset setelah login berhasil

### 3. Session Management
- Session timeout: 2 jam
- Auto-logout setelah 30 menit tidak aktif
- Token-based authentication
- Session validation setiap request

### 4. XSS Protection
- Semua input di-sanitize
- HTML encoding untuk output
- Validasi input ketat

### 5. CSRF Protection
- Token-based CSRF protection
- Token validation untuk setiap form submission

### 6. Data Encryption
- Sensitive data di-encrypt sebelum disimpan
- Double encryption untuk admin accounts
- Integrity checksum untuk verifikasi data

### 7. Security Logging
- Log semua percobaan login
- Log aktivitas mencurigakan
- Track session activities

### 8. Input Validation
- Validasi semua input user
- Sanitization untuk mencegah injection
- Format validation (email, phone, dll)

---

## 🛡️ Cara Menggunakan

### Login
1. Buka `login.html`
2. Masukkan username: `RifalosID`
3. Masukkan password: `Rifalos2024!@#Secure`
4. Klik "Masuk"

### Keamanan Tambahan
- Jangan share kredensial ini ke siapapun
- Ganti password secara berkala
- Logout setelah selesai menggunakan admin panel
- Jangan simpan password di browser
- Gunakan di perangkat yang aman

---

## 🔄 Mengganti Password

Jika ingin mengganti password:

1. Buka file `auth.js`
2. Cari fungsi `initializeAdminAccounts()`
3. Ubah baris:
   ```javascript
   const password = 'Rifalos2024!@#Secure';
   ```
4. Ganti dengan password baru Anda
5. Simpan file
6. Clear localStorage browser (F12 → Application → Clear Storage)
7. Login dengan password baru

**Catatan**: Password baru akan otomatis di-hash saat pertama kali login.

---

## 🚨 Jika Lupa Password

Jika lupa password, Anda perlu:

1. Buka file `auth.js`
2. Cari fungsi `initializeAdminAccounts()`
3. Set password baru
4. Clear localStorage browser
5. Login dengan password baru

**Atau** reset dengan menghapus:
- `localStorage.removeItem('adminAccounts')`
- `localStorage.removeItem('adminChecksum')`

Kemudian set password baru di `auth.js`.

---

## 📝 Catatan Keamanan

1. **Jangan commit file ini ke Git!**
   - Tambahkan ke `.gitignore`:
     ```
     CREDENTIALS_*.md
     ```

2. **Backup kredensial dengan aman**
   - Simpan di password manager
   - Jangan simpan di plain text
   - Gunakan enkripsi untuk backup

3. **Monitor aktivitas**
   - Cek security logs secara berkala
   - Waspada terhadap aktivitas mencurigakan
   - Segera ganti password jika ada indikasi breach

4. **Best Practices**
   - Gunakan password yang kuat (sudah diterapkan)
   - Jangan gunakan password yang sama di tempat lain
   - Aktifkan 2FA jika memungkinkan (untuk production)
   - Update sistem secara berkala

---

## 🔍 Troubleshooting

### Tidak bisa login
1. Pastikan username dan password benar (case-sensitive)
2. Cek apakah account tidak terkunci (tunggu 15 menit)
3. Clear browser cache dan localStorage
4. Coba di browser lain atau incognito mode

### Session expired
- Normal setelah 2 jam atau 30 menit tidak aktif
- Login ulang untuk melanjutkan

### Account locked
- Tunggu 15 menit setelah 5 percobaan gagal
- Atau clear localStorage untuk reset (tidak disarankan untuk production)

---

**⚠️ PENTING: Simpan file ini dengan aman dan jangan share ke siapapun!**

---

*Generated: 2024*
*For: RifalosID*
*Security Level: High*

