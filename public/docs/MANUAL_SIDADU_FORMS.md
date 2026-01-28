# PANDUAN PENGGUNAAN FITUR FORMULIR ONLINE SIDADU

## 1. PENDAHULUAN
Fitur **Formulir Online** pada aplikasi SIDADU memungkinkan sekolah untuk membuat formulir digital interaktif (seperti Google Forms) yang terintegrasi langsung dengan database sekolah. Fitur ini dapat digunakan untuk berbagai keperluan, seperti:
- Pendaftaran Ekstrakurikuler
- Survei Kepuasan Wali Murid
- Pengumpulan Data Siswa/GTK
- Pendaftaran Event Sekolah

Keunggulan utama fitur ini adalah data tersimpan aman di server sekolah sendiri dan file yang diupload tidak membebani penyimpanan pihak ketiga.

---

## 2. HAK AKSES PENGGUNA

| Tipe User | Hak Akses |
| :--- | :--- |
| **Super Admin / Admin Sekolah** | Membuat, Mengedit, Menghapus Formulir, Melihat Jawaban, Mengunduh File Upload. |
| **Guru / Siswa (Login)** | Mengisi formulir (Jawaban terecord dengan User ID). |
| **Publik (Tanpa Login)** | Mengisi formulir (Jika formulir diset "Akses Publik"). Jawaban terecord dengan IP Address. |

---

## 3. PANDUAN UNTUK ADMIN (PENGELOLA)

### A. Mengakses Menu Formulir
1. Login ke aplikasi SIDADU sebagai Admin.
2. Pada Sidebar sebelah kiri, gulir ke bagian **Formulir Online**.
3. Klik menu tersebut untuk masuk ke halaman daftar formulir.

*(Tempatkan Screenshot Sidebar dengan menu 'Formulir Online' disorot disini)*

### B. Membuat Formulir Baru
1. Pada halaman daftar formulir, klik tombol **"+ Buat Formulir Baru"** di pojok kanan atas.
2. Muncul jendela *popup*. Isi **Judul Formulir** (wajib) dan **Deskripsi Singkat** (opsional).
3. Klik tombol **Buat Formulir**. Anda akan diarahkan ke halaman **Form Builder**.

*(Tempatkan Screenshot Modal 'Buat Formulir Baru' disini)*

### C. Mendesain Formulir (Form Builder)
Di halaman ini, Anda menyusun pertanyaan-pertanyaan.

1. **Menambah Pertanyaan**:
   Di sidebar sebelah kiri, klik salah satu tipe pertanyaan:
   - **Teks Singkat**: Untuk nama, alamat pendek, dll.
   - **Paragraf**: Untuk alasan, saran, cerita panjang.
   - **Pilihan Ganda**: *Dropdown* menu.
   - **Pilihan (Radio)**: Pilihan tunggal yang terlihat semua opsinya.
   - **Checkbox**: Responden bisa memilih lebih dari satu jawaban.
   - **Upload File**: Responden bisa mengupload foto/dokumen (PDF/JPG/PNG).
   - **Tanggal**: Input tanggal khusus.

*(Tempatkan Screenshot Halaman Form Builder disini)*

2. **Mengedit Pertanyaan**:
   - Klik teks pertanyaan untuk mengubah labelnya.
   - Klik checkbox **"Wajib Diisi*"** jika pertanyaan tersebut harus dijawab.
   - Untuk tipe Pilihan/Checkbox, tambahkan opsi jawaban dengan mengklik **"+ Tambah Opsi Lain"** atau hapus opsi dengan ikon tempat sampah.

3. **Mengatur Urutan**:
   Gunakan tombol panah **Atas/Bawah** di samping setiap pertanyaan untuk mengubah urutannya.

4. **Menyimpan Perubahan**:
   Jangan lupa klik tombol **"Simpan Perubahan"** (ikon disket) di pojok kanan atas setiap kali selesai mengedit struktur formulir.

### D. Pengaturan Formulir (Penting!)
Klik tab **"Pengaturan"** di sidebar kiri (di bawah tombol Builder).

1. **Status Aktif**: Centang agar formulir bisa diakses. Jika tidak dicentang (Draft), orang lain tidak bisa membukanya.
2. **Akses Publik Tanpa Login**:
   - Jika **Dicentang**: Siapapun yang punya link bisa mengisi (cocok untuk PPDB/Survei Wali Murid).
   - Jika **Tidak Dicentang**: Hanya user yang login (Guru/Siswa) yang bisa mengisi.
3. **Batas Waktu**: Anda bisa mengatur tanggal mulai dan tanggal berakhir formulir otomatis dibuka/ditutup.

### E. Membagikan Formulir
1. Kembali ke halaman daftar formulir (`/forms`).
2. Pada kartu formulir yang diinginkan, klik ikon **Link/Tautan** di bagian bawah.
3. Link akan otomatis tersalin. Contoh: `https://sekolah.sch.id/sidadu/form/pendaftaran-ekskul`.
4. Bagikan link tersebut via WhatsApp Group atau Website Sekolah.

---

## 4. PANDUAN MELIHAT & MENGELOLA JAWABAN

### A. Melihat Respon Masuk
1. Di halaman daftar formulir, klik tombol ikon **Grafik (Chart)** berwarna ungu pada kartu formulir.
2. Anda akan melihat tabel berisi semua jawaban yang masuk.
   - Kolom "User / IP" menunjukkan siapa pengisinya.
   - Jika ada file upload, klik link "Lihat File" untuk membuka/mengunduhnya.

*(Tempatkan Screenshot Tabel Data Respon disini)*

### B. Menghapus Formulir
1. Untuk menghapus formulir dan SELURUH JAWABANNYA, klik ikon **Tempat Sampah** berwarna merah.
2. Konfirmasi penghapusan. **Peringatan**: Data yang dihapus tidak bisa dikembalikan.

---

## 5. PANDUAN UNTUK PENGGUNA (RESPONDEN)

### Cara Mengisi Formulir
1. Klik tautan formulir yang dibagikan oleh Admin.
2. Halaman formulir akan terbuka. Baca deskripsi dengan teliti.
3. Isi semua kolom yang bertanda bintang merah (*).
4. Jika ada kolom upload file, klik area kotak putus-putus untuk memilih file dari HP/Laptop Anda.
5. Klik tombol **"KIRIM JAWABAN"**.
6. Tunggu hingga muncul pesan "Sukses! Form berhasil disubmit".

*(Tempatkan Screenshot Tampilan Formulir Publik disini)*
