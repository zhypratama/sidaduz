# SIDADU (Sistem Database Terpadu)

**SIDADU** adalah platform Sistem Informasi Sekolah yang dirancang untuk memodernisasi administrasi akademik dan kesiswaan. Aplikasi ini mengintegrasikan data siswa, guru (GTK), dan persuratan dalam satu dashboard yang mudah digunakan.

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
*   **Validasi QR Code**: Setiap surat dilengkapi QR Code unik untuk memverifikasi keaslian tanda tangan (Basah/Digital) Kepala Sekolah, Gunakan untuk keperluan internal atau lingkungan pendidikan Sekolah. Tidak akan pernah Support TTE        dari BSRE.
*   **Penomoran Otomatis**: Sistem nomor surat yang terurut otomatis.

### 3. 👥 Manajemen GTK (Guru & Tenaga Kependidikan)
*   Database Profil Guru dan Staff.
*   Manajemen Akun Pengguna.

### 4. ⚙️ Pengaturan Sekolah
*    **Identitas Sekolah**: Konfigurasi Nama, Alamat, Logo, dan Kop Surat.
*    **Tanda Tangan**: Upload stempel dan tanda tangan kepala sekolah untuk dokumen digital.

---

## 💻 Teknologi yang Digunakan

Aplikasi ini dibangun denga stack modern untuk performa dan skalabilitas:

*   **Backend**: [Laravel 12](https://laravel.com) (PHP Framework)
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

AKUN DEFAULT : 
*   **Email**: `admin@sekolah.id`
*   **Password**: `password`

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan fork repository ini dan kirimkan Pull Request untuk fitur baru atau perbaikan bug.

---

## 📄 Lisensi

Copyright © 2026 Fanzhy Soft
All rights reserved.
