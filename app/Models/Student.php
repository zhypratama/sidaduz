<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'nisn', 'nik', 'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
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

    public function pelanggarans()
    {
        return $this->hasMany(Pelanggaran::class, 'siswa_id'); // Assuming FK is siswa_id based on migration
    }

    public function konselings()
    {
        return $this->hasMany(Konseling::class, 'siswa_id');
    }

    public function prestasis()
    {
        return $this->hasMany(Prestasi::class, 'siswa_id');
    }

    public function nilaiHarians()
    {
        return $this->hasMany(NilaiHarian::class, 'student_id');
    }

    // Calculating total points (Pelanggaran - Prestasi)
    public function getTotalPoinAttribute()
    {
        $poinPelanggaran = $this->pelanggarans()->sum('poin_saat_ini');
        $poinPrestasi = $this->prestasis()->sum('poin_apresiasi');
        return max(0, $poinPelanggaran - $poinPrestasi);
    }

    protected $casts = [
        'tanggal_lahir' => 'date',
        // PDP Encryption
        'nisn' => 'encrypted',
        'nik' => 'encrypted',
        'nipd' => 'encrypted',
        'alamat' => 'encrypted',
        'no_telp' => 'encrypted',
        'no_hp' => 'encrypted',
        'email' => 'encrypted',
        'skhun' => 'encrypted',
        'no_kps' => 'encrypted',
        'nama_ayah' => 'encrypted',
        'nik_ayah' => 'encrypted',
        'no_telp_ayah' => 'encrypted',
        'nama_ibu' => 'encrypted',
        'nik_ibu' => 'encrypted',
        'no_telp_ibu' => 'encrypted',
        'nama_wali' => 'encrypted',
        'nik_wali' => 'encrypted',
        'no_telp_wali' => 'encrypted',
        'no_peserta_un' => 'encrypted',
        'no_seri_ijazah' => 'encrypted',
        'no_kip' => 'encrypted',
        'nama_di_kip' => 'encrypted',
        'no_kks' => 'encrypted',
        'no_akta_lahir' => 'encrypted',
        'bank' => 'encrypted',
        'no_rekening_bank' => 'encrypted',
        'rekening_atas_nama' => 'encrypted',
        'no_kk' => 'encrypted',
    ];
}
