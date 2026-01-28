<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisPelanggaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rules = [
            // RINGAN (1-10 Poin)
            ['kategori' => 'Ringan', 'nama_pelanggaran' => 'Datang terlambat tanpa alasan yang sah', 'poin' => 5, 'tindakan_biasa' => 'Teguran lisan & dicatat'],
            ['kategori' => 'Ringan', 'nama_pelanggaran' => 'Tidak memakai atribut seragam lengkap (Dasi/Topi/Sabuk)', 'poin' => 5, 'tindakan_biasa' => 'Ditegur & melengkapi atribut'],
            ['kategori' => 'Ringan', 'nama_pelanggaran' => 'Membuang sampah sembarangan', 'poin' => 5, 'tindakan_biasa' => 'Memungut sampah & sanksi sosial'],
            ['kategori' => 'Ringan', 'nama_pelanggaran' => 'Rambut gondrong/tidak rapi (Siswa Putra)', 'poin' => 10, 'tindakan_biasa' => 'Potong rambut di sekolah'],
            ['kategori' => 'Ringan', 'nama_pelanggaran' => 'Memakai make-up/aksesoris berlebihan', 'poin' => 10, 'tindakan_biasa' => 'Disita & dibersihkan'],
            ['kategori' => 'Ringan', 'nama_pelanggaran' => 'Makan/Minum di dalam kelas saat pelajaran', 'poin' => 5, 'tindakan_biasa' => 'Teguran lisan'],
            
            // SEDANG (11-30 Poin)
            ['kategori' => 'Sedang', 'nama_pelanggaran' => 'Membuat kegaduhan/mengganggu KBM', 'poin' => 15, 'tindakan_biasa' => 'Teguran & tugas tambahan'],
            ['kategori' => 'Sedang', 'nama_pelanggaran' => 'Bolos pada jam pelajaran tertentu', 'poin' => 20, 'tindakan_biasa' => 'Panggilan Orang Tua (SPO)'],
            ['kategori' => 'Sedang', 'nama_pelanggaran' => 'Tidak masuk sekolah tanpa keterangan (Alpa) > 3 hari', 'poin' => 20, 'tindakan_biasa' => 'Panggilan Orang Tua'],
            ['kategori' => 'Sedang', 'nama_pelanggaran' => 'Merusak fasilitas sekolah (Ringan)', 'poin' => 25, 'tindakan_biasa' => 'Mengganti kerugian & SP 1'],
            ['kategori' => 'Sedang', 'nama_pelanggaran' => 'Menggunakan HP saat KBM tanpa izin', 'poin' => 15, 'tindakan_biasa' => 'HP disita sementara'],
            
            // BERAT (31-75 Poin)
            ['kategori' => 'Berat', 'nama_pelanggaran' => 'Merokok di lingkungan sekolah/berseragam', 'poin' => 50, 'tindakan_biasa' => 'Skorsing & SP 2'],
            ['kategori' => 'Berat', 'nama_pelanggaran' => 'Berkelahi di lingkungan sekolah', 'poin' => 50, 'tindakan_biasa' => 'Skorsing & Panggilan Ortu'],
            ['kategori' => 'Berat', 'nama_pelanggaran' => 'Melakukan bullying/perundungan (Fisik/Verbal)', 'poin' => 75, 'tindakan_biasa' => 'Skorsing berat & SP 3'],
            ['kategori' => 'Berat', 'nama_pelanggaran' => 'Membawa senjata tajam', 'poin' => 75, 'tindakan_biasa' => 'Skorsing & Lapor Pihak Berwajib'],
            
            // SANGAT BERAT (100 Poin - Dikeluarkan)
            ['kategori' => 'Sangat Berat', 'nama_pelanggaran' => 'Mengedarkan/mengkonsumsi Narkoba/Miras', 'poin' => 100, 'tindakan_biasa' => 'Dikembalikan ke Orang Tua'],
            ['kategori' => 'Sangat Berat', 'nama_pelanggaran' => 'Melakukan tindakan asusila/hamil/menghamili', 'poin' => 100, 'tindakan_biasa' => 'Dikembalikan ke Orang Tua'],
            ['kategori' => 'Sangat Berat', 'nama_pelanggaran' => 'Terlibat tindak pidana kriminal', 'poin' => 100, 'tindakan_biasa' => 'Dikembalikan ke Orang Tua'],
        ];

        foreach ($rules as $rule) {
            DB::table('jenis_pelanggarans')->insert(array_merge($rule, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
