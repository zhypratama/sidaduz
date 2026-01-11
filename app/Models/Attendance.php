<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id',
        'bulan',
        'tahun',
        'sakit',
        'izin',
        'alpha',
        'hadir'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
