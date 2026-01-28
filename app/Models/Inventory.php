<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_barang',
        'kode_barang',
        'kategori',
        'kondisi',
        'jumlah',
        'lokasi',
        'deskripsi',
        'foto',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'jumlah' => 'integer',
    ];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute()
    {
        if ($this->foto) {
            return Storage::url($this->foto);
        }
        return null; // Or return a default placeholder image URL
    }
}
