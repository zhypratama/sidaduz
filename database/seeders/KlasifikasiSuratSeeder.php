<?php

namespace Database\Seeders;

use App\Models\KlasifikasiSurat;
use Illuminate\Database\Seeder;

class KlasifikasiSuratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['kode' => 'Und', 'nama' => 'Undangan', 'deskripsi' => 'Surat undangan resmi'],
            ['kode' => 'Png', 'nama' => 'Pengumuman', 'deskripsi' => 'Surat pengumuman sekolah'],
            ['kode' => 'STg', 'nama' => 'Surat Tugas', 'deskripsi' => 'Surat penugasan GTK'],
            ['kode' => 'SK', 'nama' => 'Surat Keputusan', 'deskripsi' => 'Surat keputusan kepala sekolah'],
            ['kode' => 'S-Ket', 'nama' => 'Surat Keterangan', 'deskripsi' => 'Surat keterangan umum'],
            ['kode' => 'SKAM', 'nama' => 'Surat Keterangan Aktif Mengajar', 'deskripsi' => 'Untuk guru aktif'],
            ['kode' => 'SKS', 'nama' => 'Surat Keterangan Siswa', 'deskripsi' => 'Keterangan siswa aktif'],
        ];

        foreach ($data as $item) {
            KlasifikasiSurat::updateOrCreate(
                ['kode' => $item['kode']],
                $item
            );
        }
    }
}
