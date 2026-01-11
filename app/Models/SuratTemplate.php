<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTemplate extends Model
{
    protected $fillable = ['nama', 'kategori', 'isi_surat', 'klasifikasi_surat_id'];
    
    public function klasifikasi()
    {
        return $this->belongsTo(KlasifikasiSurat::class, 'klasifikasi_surat_id');
    }
}
