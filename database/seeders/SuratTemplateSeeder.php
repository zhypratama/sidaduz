<?php

namespace Database\Seeders;

use App\Models\SuratTemplate;
use Illuminate\Database\Seeder;

class SuratTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'nama' => 'Undangan Rapat Dinas',
                'kategori' => 'Undangan',
                'isi_surat' => '<p>Dengan hormat,</p><p><br></p><p>Mengharap kehadiran Bapak/Ibu Guru dan Staf pada rapat dinas yang akan dilaksanakan pada:</p><ul><li>Hari/Tanggal: </li><li>Waktu: </li><li>Tempat: </li><li>Agenda: </li></ul><p><br></p><p>Demikian undangan ini kami sampaikan, atas perhatian dan kehadirannya diucapkan terima kasih.</p>'
            ],
            [
                'nama' => 'Surat Keterangan Aktif Siswa',
                'kategori' => 'Keterangan',
                'isi_surat' => '<p>Yang bertanda tangan di bawah ini Kepala Sekolah SMP AL-IRSYAD BOGOR menerangkan bahwa:</p><ul><li>Nama: </li><li>NISN: </li><li>Kelas: </li></ul><p><br></p><p>Adalah benar siswa aktif di sekolah kami pada tahun ajaran ini.</p><p>Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>'
            ]
        ];

        foreach ($templates as $t) {
            SuratTemplate::create($t);
        }
    }
}
