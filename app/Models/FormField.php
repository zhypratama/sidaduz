<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    protected $fillable = [
        'form_id',
        'type',
        'label',
        'description',
        'options',
        'is_required',
        'section',
        'logic',
        'order',
    ];

    protected $casts = [
        'options' => 'array',
        'logic' => 'array',
        'is_required' => 'boolean',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
