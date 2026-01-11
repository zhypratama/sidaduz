<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTemplate extends Model
{
    protected $fillable = [
        'nama', 
        'kategori', 
        'isi_surat', 
        'klasifikasi_surat_id',
        'paper_size',
        'margins',
        'spacing'
    ];

    protected $casts = [
        'margins' => 'array',
        'spacing' => 'array',
    ];
    
    public function klasifikasi()
    {
        return $this->belongsTo(KlasifikasiSurat::class, 'klasifikasi_surat_id');
    }
}
