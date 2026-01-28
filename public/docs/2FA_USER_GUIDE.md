# 🔐 Two-Factor Authentication (2FA) - User Guide

**SIDADU System**  
**Last Updated**: 20 Januari 2026

---

## 📖 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Cara Mengaktifkan 2FA](#cara-mengaktifkan-2fa)
3. [Cara Login dengan 2FA](#cara-login-dengan-2fa)
4. [Recovery Codes](#recovery-codes)
5. [Cara Menonaktifkan 2FA](#cara-menonaktifkan-2fa)
6. [Troubleshooting](#troubleshooting)

---

## 🛡️ Pengenalan

### Apa itu 2FA?

Two-Factor Authentication (2FA) adalah lapisan keamanan tambahan yang mengharuskan Anda memberikan **dua bukti identitas** saat login:
1. **Password** (yang Anda tahu)
2. **Kode OTP** dari aplikasi authenticator (yang Anda miliki)

### Mengapa Perlu 2FA?

✅ **Perlindungan Ekstra**: Meski password bocor, akun tetap aman  
✅ **Mencegah Akses Tidak Sah**: Hacker tidak bisa login tanpa phone Anda  
✅ **Kepatuhan Keamanan**: Standar untuk akun admin/super admin  
✅ **Peace of Mind**: Tidur lebih nyenyak 😴  

### Siapa yang Sebaiknya Menggunakan 2FA?

- ✅ **WAJIB**: Super Admin
- ✅ **SANGAT DIREKOMENDASIKAN**: Admin Sekolah, Kepala Sekolah
- ⚠️ **OPSIONAL**: Guru, Staff (tergantung kebijakan sekolah)

---

## 📱 Cara Mengaktifkan 2FA

### Step 1: Install Aplikasi Authenticator

Download salah satu aplikasi berikut di smartphone Anda:

**Android**:
- Google Authenticator ([Download](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2))
- Microsoft Authenticator
- Authy

**iOS**:
- Google Authenticator ([Download](https://apps.apple.com/us/app/google-authenticator/id388497605))
- Microsoft Authenticator
- Authy

### Step 2: Buka Halaman Setup 2FA

1. Login ke SIDADU
2. Klik **Profile** di pojok kanan atas
3. Pilih **"Two-Factor Authentication"**

### Step 3: Scan QR Code

1. Di halaman 2FA, Anda akan melihat **QR Code**
2. Buka aplikasi authenticator di phone
3. Tap tombol **"+"** atau **"Add Account"**
4. Pilih **"Scan QR Code"**
5. Scan QR code yang muncul di layar

### Step 4: Verifikasi Kode

1. Aplikasi authenticator akan menampilkan kode 6 digit
2. Masukkan kode tersebut ke kolom verifikasi
3. Klik **"Enable 2FA"**

### Step 5: Simpan Recovery Codes ⚠️

**PENTING**: Setelah 2FA aktif, Anda akan melihat **8 recovery codes**.

```
A1B2C3D4E5
F6G7H8I9J0
K1L2M3N4O5
...
```

**WAJIB DISIMPAN!** Codes ini untuk mengakses akun jika:
- Phone hilang/rusak
- Uninstall aplikasi authenticator
- Ganti HP baru

#### Cara Menyimpan Recovery Codes:

✅ **Klik tombol "Download"** → Simpan file `sidadu-recovery-codes.txt`  
✅ Simpan di tempat aman (password manager, safe deposit)  
✅ Screenshot dan simpan di cloud/email terenkripsi  
✅ Cetak dan taruh di brankas  

❌ **JANGAN**:
- Share ke orang lain
- Simpan di tempat yang mudah diakses hacker
- Lupa menyimpan sama sekali

---

## 🔑 Cara Login dengan 2FA

### Login Normal:

1. Masukkan **email** dan **password** seperti biasa
2. Klik **"Login"**
3. Anda akan diarah ke halaman **"2FA Challenge"**
4. Buka aplikasi authenticator di phone
5. Lihat kode 6 digit untuk SIDADU
6. Masukkan kode tersebut
7. Klik **"Verify"**
8. ✅ Login berhasil!

**Catatan**: Kode berubah setiap 30 detik. Jika expired, gunakan kode yang baru.

###  Login dengan Recovery Code:

Jika phone hilang/tidak ada akses ke authenticator:

1. Login normal (email + password)
2. Di halaman 2FA Challenge, klik **"Use recovery code"**
3. Masukkan salah satu recovery code
4. Klik **"Verify"**
5. ✅ Login berhasil!

**⚠️ WARNING**: Setiap recovery code **hanya bisa digunakan 1x**. Setelah login, segera:
- Regenerate recovery codes baru
- Atau disable 2FA dan setup ulang jika sudah dapat phone baru

---

## 🔄 Recovery Codes

### Regenerate Recovery Codes

Jika Anda sudah menggunakan beberapa recovery codes atau khawatir bocor:

1. Masuk ke **Profile > Two-Factor Authentication**
2. Di panel "Recovery Codes", klik **"Regenerate"**
3. Masukkan password Anda
4. Codes lama akan **tidak valid**
5. Simpan codes yang baru

### Download Recovery Codes

Klik tombol **"Download"** di panel Recovery Codes untuk mendapatkan file `.txt`.

---

## ❌ Cara Menonaktifkan 2FA

**Catatan**: Menonaktifkan 2FA akan menurunkan keamanan akun Anda.

1. Masuk ke **Profile > Two-Factor Authentication**
2. Di panel "2FA Enabled", masukkan **password** Anda
3. Klik **"Disable 2FA"**
4. Konfirmasi keputusan Anda
5. 2FA berhasil dinonaktifkan

---

## 🆘 Troubleshooting

### ❓ "Invalid authentication code" terus muncul

**Penyebab umum**:
- Waktu phone tidak sinkron

**Solusi**:
1. Pastikan phone Anda terhubung internet
2. Setting phone → Date & Time → **Enable "Automatic date & time"**
3. Restart aplikasi authenticator
4. Gunakan kode yang terbaru

### ❓ Phone hilang/rusak, tidak punya recovery codes

**Solusi**:
1. Hubungi **Super Admin** sekolah Anda
2. Minta mereka untuk **disable 2FA** langsung dari database
3. Setelah bisa login, setup 2FA ulang dengan phone baru

**Query untuk Admin** (hanya untuk keadaan darurat):
```sql
UPDATE users 
SET two_factor_secret = NULL, 
    two_factor_recovery_codes = NULL, 
    two_factor_confirmed_at = NULL 
WHERE email = 'user@sekolah.sch.id';
```

### ❓ Kode autentikasi tidak muncul di app

**Solusi**:
1. Buka aplikasi authenticator
2. Cari "SIDADU System" di daftar akun
3. Jika tidak ada, setup ulang:
   - Disable 2FA di web
   - Enable lagi dan scan QR code baru

### ❓ QR Code tidak bisa di-scan

**Solusi alternatif**:
1. Gunakan **manual entry** di aplikator app
2. Copy kode rahasia (contoh: `ABCD1234EFGH5678`)
3. Di aplikasi authenticator:
   - Tap "Enter a setup key"
   - Account name: SIDADU System
   - Your key: [paste kode rahasia]
   - Time-based: YES
4. Tap "Add"

---

## 🔒 Tips Keamanan

1. ✅ Jangan share screenshot QR code atau secret key
2. ✅ Gunakan password manager (Bitwarden, 1Password) untuk simpan recovery codes
3. ✅ Regenerate recovery codes setelah menggunakannya
4. ✅ Backup recovery codes di 2 tempat berbeda (cloud + fisik)
5. ✅ Jangan disable 2FA kecuali benar-benar perlu

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **Kontak IT Support Sekolah**
2. **Email**: it-support@sekolah.sch.id (example)
3. **WhatsApp**: +62 xxx-xxxx-xxxx (example)

---

**© 2026 SIDADU System** - Developed with ❤️ for Better School Administration
