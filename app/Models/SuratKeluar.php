<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    protected $fillable = [
        'no_surat',
        'klasifikasi_surat_id',
        'tujuan',
        'perihal',
        'isi_surat',
        'tanggal_surat',
        'jenis_surat',
        'opsi_tanda_tangan',
        'posisi_tanggal',
        'status',
        'token',
        'approved_by',
        'approved_at',
        'paper_size',
        'margins',
        'spacing',
        'footer_text',
        'file_path',
        'qrcode_path',
        'file_scan',    // Added validation for scan upload
        'footer_enabled', // Added validation for footer toggle
    ];

    protected $casts = [
        'margins' => 'array',
        'spacing' => 'array',
        'tanggal_surat' => 'date',
        'approved_at' => 'datetime',
    ];

    public function klasifikasi()
    {
        return $this->belongsTo(KlasifikasiSurat::class, 'klasifikasi_surat_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
