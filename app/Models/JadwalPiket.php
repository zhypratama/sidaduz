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
    ];

    public function gtk()
    {
        return $this->belongsTo(Gtk::class);
    }
}
