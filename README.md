# SIDADU (Sistem Database Terpadu) - [NAMA INSTITUSI SEKOLAH]

**SIDADU** adalah platform Sistem Informasi Sekolah yang dirancang untuk memodernisasi administrasi akademik dan kesiswaan di [NAMA INSTITUSI SEKOLAH]. Aplikasi ini mengintegrasikan data siswa, guru (GTK), dan persuratan dalam satu dashboard yang mudah digunakan.

![Dashboard Preview](public/images/dashboard-preview.png) *(Placeholder)*

## 🌟 Fitur Unggulan

### 1. 🎓 Manajemen Kesiswaan (Student Management)
*   **Database Terpusat**: Menyimpan data lengkap siswa (Profil, Orang Tua, Periodik, KIP/PIP).
*   **Import Data Dapodik**: Fitur import Excel yang cerdas, otomatis memetakan data siswa dan membuatkan Kelas/Rombel jika belum ada.
*   **Kelas & Rombel**: Relasi otomatis antara Siswa dan Kelas.
*   **Pencarian Cepat**: Cari siswa berdasarkan Nama atau NIPD secara real-time.
*   **Export/Import**: Dukungan penuh untuk migrasi data via Excel.

### 2. 📝 Persuratan & Administrasi (Letter System)
*   **Generator Surat Otomatis**: Membuat Surat Keterangan Aktif Sekolah, Surat Mutasi, dll., dalam format PDF siap cetak.
*   **Smart Template Editor**: Editor visual untuk membuat template surat dengan variabel dinamis (misal: `${nama_siswa}`, `${nipd}`).
*   **Validasi QR Code**: Setiap surat dilengkapi QR Code unik untuk memverifikasi keaslian tanda tangan (Basah/Digital).
*   **Penomoran Otomatis**: Sistem nomor surat yang terurut otomatis.

### 3. 👥 Manajemen GTK (Guru & Tenaga Kependidikan)
*   Database Profil Guru dan Staff.
*   Manajemen Akun Pengguna.

### 4. ⚙️ Pengaturan Sekolah
*    **Identitas Sekolah**: Konfigurasi Nama, Alamat, Logo, dan Kop Surat.
*   **Tanda Tangan**: Upload stempel dan tanda tangan kepala sekolah untuk dokumen digital.

---

## 💻 Teknologi yang Digunakan

Aplikasi ini dibangun denga stack modern untuk performa dan skalabilitas:

*   **Backend**: [Laravel 11](https://laravel.com) (PHP Framework)
*   **Frontend**: [Inertia.js](https://inertiajs.com) dengan [React](https://reactjs.org)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com)
*   **Database**: MySQL / MariaDB
*   **PDF Engine**: DomPDF / Browsershot

---

## 🛠️ Persyaratan Sistem (System Requirements)

Sebelum menginstal, pastikan server/komputer Anda memiliki:

*   PHP >= 8.2
*   Composer
*   Node.js >= 18.x & NPM
*   MySQL Database
*   Git

---

## 🚀 Panduan Instalasi (Langkah demi Langkah)

Ikuti langkah ini untuk menjalankan aplikasi di komputer lokal (Localhost):

### 1. Clone Repository
```bash
git clone https://github.com/zhypratama/sidadu-app.git
cd sidadu-app
```

### 2. Install Dependensi Backend (PHP)
```bash
composer install
```

### 3. Install Dependensi Frontend (JS)
```bash
npm install
```

### 4. Konfigurasi Environment
Buat file `.env` dari contoh yang ada:
```bash
cp .env.example .env
```
Buka file `.env` dan sesuaikan koneksi database:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sisko_app
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Generate Key & Link Storage
```bash
php artisan key:generate
php artisan storage:link
```

### 6. Migrasi Database & Seeding
Jalankan perintah ini untuk membuat tabel dan data awal (Admin default):
```bash
php artisan migrate --seed
```

### 7. Jalankan Aplikasi
Anda perlu membuka **dua terminal**:

**Terminal 1 (Backend Server):**
```bash
php artisan serve
```

**Terminal 2 (Frontend Builder):**
```bash
npm run dev
```

Akses aplikasi di browser melalui: `http://localhost:8000`

---

## 🔐 Akun Default (Untuk Testing)

Jika menggunakan `db:seed`, akun default yang tersedia:

*   **Email**: `admin@smpalirsyad.sch.id`
*   **Password**: `password`

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan fork repository ini dan kirimkan Pull Request untuk fitur baru atau perbaikan bug.

---

## 📄 Lisensi

Copyright © 2026 [NAMA INSTITUSI SEKOLAH].
All rights reserved.
