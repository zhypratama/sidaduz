# Sistem Informasi Sekolah (SISKO) - SMP Al-Irsyad Bogor

Akan dikembangkan menjadi platform manajemen sekolah yang komprehensif, mencakup manajemen siswa, surat menyurat, dan administrasi akademik.

## Fitur Utama (Saat Ini)
- **Manajemen Siswa**:
  - Import Data Siswa dari Excel (Dapodik).
  - CRUD Data Siswa Lengkap (Pribadi, Orang Tua, Periodik, KIP/PIP).
  - Tampilan Grid & List dengan Pagination Dinamis.
  - Pencarian Real-time.
- **Manajemen Kelas**:
  - Integrasi Relasional antara Siswa dan Kelas.
  - Otomatisasi pembuatan kelas saat import siswa.
- **Surat Menyurat**:
  - Generator Surat Keterangan Aktif Sekolah.
  - Template Surat Dinamis.
  - QR Code Validasi Tanda Tangan.

## Instalasi
1.  Clone repository.
2.  `composer install`
3.  `npm install && npm run build`
4.  Copy `.env.example` to `.env` dan konfigurasi database.
5.  `php artisan migrate --seed`
6.  `php artisan key:generate`
7.  `php artisan serve`

## Teknologi
- Laravel 11
- Inertia.js (React)
- Tailwind CSS
- MySQL

