<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembelajaran extends Model
{
    protected $fillable = [
        'school_id',
        'kelas_id',
        'mata_pelajaran_id',
        'gtk_id',
        'status',
        'sk_mengajar',
        'tanggal_sk'
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mataPelajaran()
    {
        return $this->belongsTo(MataPelajaran::class);
    }

    public function guru()
    {
        return $this->belongsTo(Gtk::class, 'gtk_id');
    }

    public function nilaiHarians()
    {
        return $this->hasMany(NilaiHarian::class);
    }
}
