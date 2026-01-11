<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'nis', 'nisn', 'nik', 'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
        'agama', 'alamat', 'rt', 'rw', 'dusun', 'desa_kelurahan', 'kecamatan', 'kode_pos', 
        'jenis_tinggal', 'alat_transportasi', 'no_telp', 'no_hp', 'email',
        
        // Keterangan Tambahan
        'skhun', 'penerima_kps', 'no_kps', 'nipd',

        // Orang Tua / Wali
        'nama_ayah', 'tahun_lahir_ayah', 'pendidikan_ayah', 'pekerjaan_ayah', 'penghasilan_ayah', 'nik_ayah', 'no_telp_ayah',
        'nama_ibu', 'tahun_lahir_ibu', 'pendidikan_ibu', 'pekerjaan_ibu', 'penghasilan_ibu', 'nik_ibu', 'no_telp_ibu',
        'nama_wali', 'tahun_lahir_wali', 'pendidikan_wali', 'pekerjaan_wali', 'penghasilan_wali', 'nik_wali', 'no_telp_wali',

        // Data Akademik & PIP
        'rombel', 'no_peserta_un', 'no_seri_ijazah', 
        'penerima_kip', 'no_kip', 'nama_di_kip', 'no_kks', 'no_akta_lahir',
        'bank', 'no_rekening_bank', 'rekening_atas_nama',
        'layak_pip', 'alasan_layak_pip', 'kebutuhan_khusus',

        // Fisik & Lainnya
        'sekolah_asal', 'anak_ke', 'lintang', 'bujur', 'no_kk',
        'berat_badan', 'tinggi_badan', 'lingkar_kepala', 'jml_saudara_kandung', 'jarak_rumah_ke_sekolah',

        'kelas_temp', 'status', 'foto', 'user_id', 'kelas_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];
}
