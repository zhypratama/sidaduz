<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JurnalDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'jurnal_guru_id',
        'student_id',
        'status',
    ];

    public function jurnalGuru()
    {
        return $this->belongsTo(JurnalGuru::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
