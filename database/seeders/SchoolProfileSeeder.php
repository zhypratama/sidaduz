<?php

namespace Database\Seeders;

use App\Models\SchoolProfile;
use Illuminate\Database\Seeder;

class SchoolProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SchoolProfile::create([
            'nama_sekolah' => '[NAMA INSTITUSI SEKOLAH]',
            'npsn' => '00000000',
            'nama_kepala_sekolah' => 'Nama Kepala Sekolah, S.Pd.',
            'alamat_sekolah' => 'Alamat Lengkap Sekolah',
            'email_sekolah' => 'admin@sekolah.id',
            'no_telp_sekolah' => '021-000000',
            'web_sekolah' => 'https://sekolah.id',
            'jam_masuk' => '07:00',
            'jam_pulang' => '15:00',
        ]);
    }
}
