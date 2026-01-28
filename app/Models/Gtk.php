<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gtk extends Model
{
    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->hasOne(Kelas::class, 'wali_kelas_id');
    }

    public function jadwal_pikets()
    {
        return $this->hasMany(JadwalPiket::class);
    }

    protected function casts(): array
    {
        return [
            // PDP Encryption
            'nuptk' => 'encrypted',
            'nik' => 'encrypted',
            'no_kk' => 'encrypted',
            'npwp' => 'encrypted',
            'nomor_rekening_bank' => 'encrypted',
            'rekening_atas_nama' => 'encrypted',
            'bank' => 'encrypted',
            'telepon' => 'encrypted',
            'email' => 'encrypted',
            'nama_ibu_kandung' => 'encrypted',
            'nama_suami_istri' => 'encrypted',
            'nip_suami_istri' => 'encrypted',
        ];
    }
}
