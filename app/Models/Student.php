<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'nis', 'nisn', 'nik', 'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
        'agama', 'alamat', 'rt', 'rw', 'desa_kelurahan', 'kecamatan', 'kode_pos', 'no_telp', 'email',
        'nama_ayah', 'pekerjaan_ayah', 'no_telp_ayah',
        'nama_ibu', 'pekerjaan_ibu', 'no_telp_ibu',
        'nama_wali', 'pekerjaan_wali', 'no_telp_wali',
        'kelas_temp', 'status', 'foto', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];
}
