<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JurnalGuru extends Model
{
    use HasFactory;

    protected $fillable = [
        'pembelajaran_id',
        'tanggal',
        'jam_ke',
        'materi',
        'catatan',
        'foto_kegiatan',
        'status_guru',
    ];

    public function pembelajaran()
    {
        return $this->belongsTo(Pembelajaran::class);
    }

    public function details()
    {
        return $this->hasMany(JurnalDetail::class);
    }
}
