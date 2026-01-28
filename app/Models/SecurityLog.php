<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecurityLog extends Model
{
    protected $fillable = [
        'type',
        'severity',
        'ip_address',
        'user_agent',
        'url',
        'method',
        'user_id',
        'payload',
        'description',
        'blocked',
        'detected_at',
    ];

    protected $casts = [
        'detected_at' => 'datetime',
        'blocked' => 'boolean',
        'payload' => 'array',
    ];

    /**
     * Log a security event
     */
    public static function logEvent($type, $description, $severity = 'medium', $additionalData = [])
    {
        return self::create(array_merge([
            'type' => $type,
            'severity' => $severity,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
            'user_id' => auth()->id(),
            'description' => $description,
            'payload' => request()->all(),
        ], $additionalData));
    }

    /**
     * Get user relationship
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
