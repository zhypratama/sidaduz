<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhatsappLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_number',
        'message',
        'status',
        'response_log',
        'type',
    ];

    protected $casts = [
        'recipient_number' => 'encrypted',
        'message' => 'encrypted',
    ];
}
