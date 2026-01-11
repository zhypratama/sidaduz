<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KlasifikasiSurat extends Model
{
    protected $fillable = ['kode', 'nama', 'deskripsi'];

    public function suratKeluars()
    {
        return $this->hasMany(SuratKeluar::class);
    }
}
