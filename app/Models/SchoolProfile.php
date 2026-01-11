<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolProfile extends Model
{
    protected $fillable = [
        'nama_sekolah',
        'npsn',
        'alamat',
        'rt',
        'rw',
        'kelurahan',
        'kecamatan',
        'ijin_nomenklatur',
        'akreditasi',
        'logo',
        'kepala_sekolah',
        'nip_kepala_sekolah',
        'no_telp_sekolah',
        'web_sekolah',
        'logo_sekolah',
        'kop_surat',
        'jam_masuk',
        'jam_pulang',
        'singkatan',
    ];
}
