<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalPiket extends Model
{
    protected $fillable = [
        'gtk_id',
        'hari',
        'tahun_ajaran',
        'semester',
        'jam_mulai',
        'jam_selesai',
    ];

    public function gtk()
    {
        return $this->belongsTo(Gtk::class);
    }
}
