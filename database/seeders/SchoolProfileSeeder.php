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
            'nama_sekolah' => 'SMP Al-Irsyad Bogor',
            'npsn' => '20220397',
            'nama_kepala_sekolah' => 'Muhammad, S.Pd, M.Pd.',
            'alamat_sekolah' => 'Jl. Raya Bogor KM. 40, Cibinong, Bogor',
            'email_sekolah' => 'info@smpalirsyadbogor.sch.id',
            'no_telp_sekolah' => '021-8751234',
            'web_sekolah' => 'https://smpalirsyadbogor.sch.id',
            'jam_masuk' => '07:00',
            'jam_pulang' => '15:00',
        ]);
    }
}
