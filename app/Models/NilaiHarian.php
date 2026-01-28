<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiHarian extends Model
{
    //
    protected $fillable = [
        'student_id',
        'pembelajaran_id',
        'judul',
        'jenis',
        'tanggal',
        'nilai',
        'keterangan'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nilai' => 'float',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function pembelajaran()
    {
        return $this->belongsTo(Pembelajaran::class);
    }
}
