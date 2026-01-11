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
}
