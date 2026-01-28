<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MoreTemplatesSeeder extends Seeder
{
    public function run()
    {
        // 1. Pengumuman (ID: 15)
        DB::table('surat_templates')->insert([
            'klasifikasi_surat_id' => 15,
            'nama' => 'Pengumuman Resmi Sekolah',
            'isi_surat' => '<p style="text-align: center;"><strong><u>PENGUMUMAN</u></strong></p><p style="text-align: center;">Nomor: [Nomor Surat Otomatis]</p><p><br></p><p>Diberitahukan kepada seluruh Bapak/Ibu Guru dan Siswa [NAMA INSTITUSI SEKOLAH], bahwa sehubungan dengan...</p><p><br></p><p>[Isi Pengumuman]</p><p><br></p><p>Demikian pengumuman ini kami sampaikan untuk menjadi perhatian.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Surat Tugas (ID: 16)
        DB::table('surat_templates')->insert([
            'klasifikasi_surat_id' => 16,
            'nama' => 'Surat Tugas Dinas',
            'isi_surat' => '<p style="text-align: center;"><strong><u>SURAT TUGAS</u></strong></p><p style="text-align: center;">Nomor: [Nomor Surat Otomatis]</p><p><br></p><p>Kepala [NAMA INSTITUSI SEKOLAH] dengan ini menugaskan kepada:</p><table style="width: 100%; border-collapse: collapse; border: none;"><tbody><tr><td style="width: 150px;">Nama</td><td>: ...</td></tr><tr><td>Jabatan</td><td>: ...</td></tr><tr><td>NIP/NIY</td><td>: ...</td></tr></tbody></table><p><br></p><p>Untuk melaksanakan tugas dalam rangka...</p><p><br></p><p>Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Surat Keputusan (ID: 17)
        DB::table('surat_templates')->insert([
            'klasifikasi_surat_id' => 17,
            'nama' => 'SK Penetapan Kegiatan',
            'isi_surat' => '<p><strong>MENIMBANG</strong> :</p><ol><li>Bahwa dalam rangka memperlancar pelaksanaan kegiatan..., maka dipandang perlu menetapkan panitia pelaksana.</li><li>Bahwa nama-nama yang tercantum dalam lampiran surat keputusan ini dianggap cakap dan mampu melaksanakan tugas tersebut.</li></ol><p><br></p><p><strong>MENGINGAT</strong> :</p><ol><li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.</li><li>Program Kerja [NAMA INSTITUSI SEKOLAH] Tahun Pelajaran ini.</li></ol><p><br></p><p style="text-align: center;"><strong>MEMUTUSKAN</strong></p><p><br></p><p><strong>MENETAPKAN</strong> :</p><p>Keputusan Kepala [NAMA INSTITUSI SEKOLAH] tentang Penetapan Panitia Kegiatan...</p><p><br></p><p><strong>PERTAMA</strong> :</p><p>Menetapkan susunan panitia sebagaimana tercantum dalam lampiran keputusan ini.</p><p><br></p><p><strong>KEDUA</strong> :</p><p>Segala biaya yang timbul akibat keputusan ini dibebankan pada anggaran sekolah.</p><p><br></p><p><strong>KETIGA</strong> :</p><p>Keputusan ini berlaku sejak tanggal ditetapkan.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Surat Keterangan (ID: 18)
        DB::table('surat_templates')->insert([
            'klasifikasi_surat_id' => 18,
            'nama' => 'Surat Keterangan Berkelakuan Baik',
            'isi_surat' => '<p style="text-align: center;"><strong><u>SURAT KETERANGAN</u></strong></p><p style="text-align: center;">Nomor: [Nomor Surat Otomatis]</p><p><br></p><p>Yang bertanda tangan di bawah ini Kepala [NAMA INSTITUSI SEKOLAH] menerangkan bahwa:</p><table style="width: 100%; border-collapse: collapse; border: none;"><tbody><tr><td style="width: 150px;">Nama</td><td>: ...</td></tr><tr><td>Tempat/Tgl Lahir</td><td>: ...</td></tr><tr><td>NIS/NISN</td><td>: ...</td></tr><tr><td>Kelas</td><td>: ...</td></tr></tbody></table><p><br></p><p>Adalah benar siswa kami yang berkelakuan baik dan tidak pernah terlibat pelanggaran berat selama menjadi siswa di [NAMA INSTITUSI SEKOLAH].</p><p><br></p><p>Demikian surat keterangan ini diperbuat untuk dapat dipergunakan seperlunya.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // 5. SKAM (ID: 19)
        DB::table('surat_templates')->insert([
            'klasifikasi_surat_id' => 19,
            'nama' => 'SKAM - Keterangan Aktif Mengajar',
            'isi_surat' => '<p style="text-align: center;"><strong><u>SURAT KETERANGAN AKTIF MENGAJAR</u></strong></p><p style="text-align: center;">Nomor: [Nomor Surat Otomatis]</p><p><br></p><p>Yang bertanda tangan di bawah ini:</p><table style="width: 100%; border-collapse: collapse; border: none;"><tbody><tr><td style="width: 150px;">Nama</td><td>: ...</td></tr><tr><td>Jabatan</td><td>: Kepala Sekolah</td></tr></tbody></table><p><br></p><p>Menerangkan dengan sesungguhnya bahwa:</p><table style="width: 100%; border-collapse: collapse; border: none;"><tbody><tr><td style="width: 150px;">Nama</td><td>: ...</td></tr><tr><td>NIP/NIY</td><td>: ...</td></tr><tr><td>Jabatan</td><td>: Guru Mapel ...</td></tr></tbody></table><p><br></p><p>Adalah benar guru tetap yang aktif mengajar di [NAMA INSTITUSI SEKOLAH] terhitung sejak tanggal ... sampai dengan saat ini.</p><p><br></p><p>Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    }
}
