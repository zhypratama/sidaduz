<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratMasuk extends Model
{
    protected $fillable = [
        'no_surat_pengirim',
        'pengirim',
        'perihal',
        'tanggal_surat',
        'tanggal_diterima',
        'tujuan_divisi',
        'file_scan',
    ];

    public function disposisi()
    {
        return $this->hasMany(DisposisiSurat::class);
    }
}
