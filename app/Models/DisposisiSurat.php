<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisposisiSurat extends Model
{
    protected $fillable = [
        'surat_masuk_id',
        'pemberi_disposisi_id',
        'penerima_disposisi_id',
        'instruksi',
        'catatan',
        'batas_waktu',
        'status',
        'tanggal_disposisi',
    ];

    protected $casts = [
        'batas_waktu' => 'date',
        'tanggal_disposisi' => 'datetime',
    ];

    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class);
    }

    public function pemberi()
    {
        return $this->belongsTo(User::class, 'pemberi_disposisi_id');
    }

    public function penerima()
    {
        return $this->belongsTo(User::class, 'penerima_disposisi_id');
    }
}
