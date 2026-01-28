<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class BeritaAcara extends Model
{
    protected $guarded = ['id'];

    public function pelapor()
    {
        return $this->belongsTo(User::class, 'pelapor_id');
    }
}
