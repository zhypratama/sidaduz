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
        'login_image',
        'kepala_sekolah',
        'nip_kepala_sekolah',
        'nuptk',
        'no_telp_sekolah',
        'web_sekolah',
        'logo_sekolah',
        'kop_surat',
        'jam_masuk',
        'jam_pulang',
        'singkatan',
        'kota',
        'propinsi',
        'email_sekolah',
        'stempel',
        'ttd_kepala_sekolah',
        'ttd_stempel_gabungan',
        'tata_tertib_kartu',
        'is_online_mode',
    ];

    protected $casts = [
        'is_online_mode' => 'boolean',
    ];
}
