<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicCalendar extends Model
{
    protected $fillable = ['title', 'start', 'end', 'all_day', 'description', 'is_holiday', 'type', 'color'];

    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
        'is_holiday' => 'boolean',
        'all_day' => 'boolean',
    ];
}
