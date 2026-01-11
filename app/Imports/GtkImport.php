<?php

namespace App\Imports;

use App\Models\Gtk;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class GtkImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public $rowsCount = 0;
    public $created = 0;
    public $updated = 0;

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Debugging: Log the row keys and values
        \Illuminate\Support\Facades\Log::info('GTK Import Row:', $row);

        // Fallback for different header casing or likely mistakes
        $nama = $row['nama'] ?? $row['nama_lengkap'] ?? null;

        // Skip if nama is empty
        if (empty($nama)) {
            \Illuminate\Support\Facades\Log::warning('Skipped Row (Missing Name):', $row);
            return null;
        }

        $row['nama'] = $nama; // Ensure it's set for later use

        $this->rowsCount++;

        // Helper to format date
        $formatDate = function($val) {
             if (empty($val)) return null;
             try {
                 // Check if numeric (Excel Serial Date)
                 if (is_numeric($val)) {
                     return Date::excelToDateTimeObject($val);
                 }
                 // Try string parsing (e.g. 1990-01-01)
                 $date = date_create($val);
                 if ($date) {
                     return $date;
                 }
                 return null;
             } catch (\Exception $e) {
                 return null;
             }
        };

        // Helper to transform scientific notation to plain string
        $transform = function($val) {
            if (empty($val)) return null;
            if (is_numeric($val) && strpos(strtoupper((string)$val), 'E') !== false) {
                 return number_format((float)$val, 0, '', '');
            }
            return (string)$val;
        };

        // Update or Create based on NIP if exists, or NUPTK, or Nama+TglLahir
        // Priority: NIP -> NUPTK -> Nama
        
        $match = null;
        if (!empty($row['nip'])) {
            $match = ['nip' => $transform($row['nip'])];
        } elseif (!empty($row['nuptk'])) {
             $match = ['nuptk' => $transform($row['nuptk'])];
        } else {
             $match = ['nama' => $row['nama']]; // Weak match, but better than nothing
        }

        $gtk = Gtk::updateOrCreate($match, [
            'nama' => $row['nama'],
            'nuptk' => $transform($row['nuptk']),
            'jenis_kelamin' => $row['jk'] ?? 'L',
            'tempat_lahir' => $row['tempat_lahir'],
            'tanggal_lahir' => $formatDate($row['tanggal_lahir']),
            'nip' => $transform($row['nip']),
            'status_kepegawaian' => $row['status_kepegawaian'],
            'jenis_ptk' => $row['jenis_ptk'],
            'agama' => $row['agama'],
            'alamat' => $row['alamat_jalan'],
            'rt' => $transform($row['rt']),
            'rw' => $transform($row['rw']),
            'nama_dusun' => $row['nama_dusun'],
            'desa_kelurahan' => $row['desakelurahan'],
            'kecamatan' => $row['kecamatan'],
            'kode_pos' => $transform($row['kode_pos']),
            'telepon' => $transform($row['telepon']),
            'no_hp' => $transform($row['hp']),
            'email' => $row['email'],
            'tugas_tambahan' => $row['tugas_tambahan'],
            'sk_cpns' => $row['sk_cpns'],
            'tanggal_cpns' => $formatDate($row['tanggal_cpns']),
            'sk_pengangkatan' => $row['sk_pengangkatan'],
            'tmt_pengangkatan' => $formatDate($row['tmt_pengangkatan']),
            'lembaga_pengangkatan' => $row['lembaga_pengangkatan'],
            'pangkat_golongan' => $row['pangkat_golongan'],
            'sumber_gaji' => $row['sumber_gaji'],
            'nama_ibu_kandung' => $row['nama_ibu_kandung'],
            'status_perkawinan' => $row['status_perkawinan'],
            'nama_suami_istri' => $row['nama_suamiistri'] ?? $row['nama_suami_istri'],
            'nip_suami_istri' => $transform($row['nip_suamiistri'] ?? $row['nip_suami_istri']),
            'pekerjaan_suami_istri' => $row['pekerjaan_suamiistri'] ?? $row['pekerjaan_suami_istri'],
            'tmt_pns' => $formatDate($row['tmt_pns']),
            'sudah_lisensi_kepala_sekolah' => $row['sudah_lisensi_kepala_sekolah'],
            'pernah_diklat_kepengawasan' => $row['pernah_diklat_kepengawasan'],
            'keahlian_braille' => $row['keahlian_braille'],
            'keahlian_bahasa_isyarat' => $row['keahlian_bahasa_isyarat'],
            'npwp' => $transform($row['npwp']),
            'nama_wajib_pajak' => $row['nama_wajib_pajak'],
            'kewarganegaraan' => $row['kewarganegaraan'],
            'bank' => $row['bank'],
            'nomor_rekening_bank' => $transform($row['nomor_rekening_bank']),
            'rekening_atas_nama' => $row['rekening_atas_nama'] ?? $row['rekening_atas_nama'],
            'nik' => $transform($row['nik']),
            'no_kk' => $transform($row['no_kk']),
            'karpeg' => $row['karpeg'],
            'karis_karsu' => $row['kariskarsu'] ?? $row['karis_karsu'],
            'lintang' => $row['lintang'],
            'bujur' => $row['bujur'],
            'nuks' => $transform($row['nuks']),
            
            // Default required fields
            'jabatan' => $row['jenis_ptk'] ?? 'Guru', // Fallback
        ]);

        if ($gtk->wasRecentlyCreated) {
            $this->created++;
        } else {
            $this->updated++;
        }

        return $gtk;
    }
}
