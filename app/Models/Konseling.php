<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Konseling extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'tanggal_konseling' => 'datetime',
    ];

    public function siswa()
    {
        return $this->belongsTo(Student::class, 'siswa_id');
    }

    public function guruBk()
    {
        return $this->belongsTo(User::class, 'guru_bk_id');
    }
}
