<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\Log;

class StudentImport implements ToModel, WithHeadingRow
{
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
        // Debugging
        // Log::info('Student Import Row:', $row);

        $nama = $row['nama_siswa'] ?? null;
        if (empty($nama)) {
            return null;
        }

        $this->rowsCount++;

        // Helper: Format Date
        $formatDate = function($val) {
             if (empty($val)) return null;
             try {
                 if (is_numeric($val)) return Date::excelToDateTimeObject($val);
                 $date = date_create($val);
                 return $date ? $date : null;
             } catch (\Exception $e) { return null; }
        };

        // Helper: Clean String (Scientific Notation removal)
        $clean = function($val) {
            if (empty($val)) return null;
            if (is_numeric($val) && strpos(strtoupper((string)$val), 'E') !== false) {
                 return number_format((float)$val, 0, '', '');
            }
            return (string)$val;
        };

        // Helper: Boolean (Ya/Tidak)
        $bool = function($val) {
            if (empty($val)) return false;
            $v = strtolower(trim($val));
            return $v === 'ya' || $v === 'yes' || $v === '1' || $v === 'true';
        };

        // Match by NIPD, NISN, or NIK
        $match = [];
        if (!empty($row['nipd'])) $match['nipd'] = $clean($row['nipd']);
        elseif (!empty($row['nisn'])) $match['nisn'] = $clean($row['nisn']);
        elseif (!empty($row['nik_siswa'])) $match['nik'] = $clean($row['nik_siswa']);
        else $match['nama_lengkap'] = $nama;

        // Find or Create Class (Rombel)
        $kelas = null;
        if (!empty($row['rombel_saat_ini'])) {
            $kelas = \App\Models\Kelas::firstOrCreate(
                ['nama' => $row['rombel_saat_ini']],
                ['tahun_ajaran_id' => null, 'wali_kelas_id' => null] // Default values if creating
            );
        }

        // Data Mapping (Header Excel -> DB Column)
        // Header: Nama Siswa; NIPD; Jenis Kelamin; NISN; Tempat Lahir; Tanggal Lahir; NIK Siswa; Agama; Alamat; RT; RW; Dusun; Kelurahan; Kecamatan; Kode Pos; Jenis Tinggal; Alat Transportasi; Telepon; HP; E-Mail; SKHUN; Penerima KPS; No. KPS; Nama Ayah; Tahun Lahir Ayah; Jenjang Pendidikan Ayah; Pekerjaan Ayah; Penghasilan Ayah; NIK Ayah; Nama Ibu; Tahun Lahir Ibu; Jenjang Pendidikan Ibu; Pekerjaan Ibu; Penghasilan Ibu; NIK Ibu; Nama Wali; Tahun Lahir Wali; Jenjang Pendidikan wali; Pekerjaan Wali; Penghasilan Wali; NIK Wali; Rombel Saat Ini; No Peserta Ujian Nasional; No Seri Ijazah; Penerima KIP (Ya/Tidak); Nomor KIP; Nama di KIP; Nomor KKS; No Registrasi Akta Lahir; Bank; Nomor Rekening Bank; Rekening Atas Nama; Layak PIP (Ya/Tidak); Alasan Layak PIP (Yatim/Piatu/Yatim-Piatu/Rentan Miskin); Kebutuhan Khusus; Sekolah Asal; Anak ke-berapa; Lintang; Bujur; No KK; Berat Badan; Tinggi Badan; Lingkar Kepala; Jml. Saudara Kandung; Jarak Rumah ke Sekolah (KM)

        $student = Student::updateOrCreate($match, [
            'nama_lengkap' => $nama,
            'nipd' => $clean($row['nipd']),
            'jenis_kelamin' => substr(strtoupper($row['jenis_kelamin'] ?? 'L'), 0, 1),
            'nisn' => $clean($row['nisn']),
            'tempat_lahir' => $row['tempat_lahir'],
            'tanggal_lahir' => $formatDate($row['tanggal_lahir']),
            'nik' => $clean($row['nik_siswa']), // Header: NIK Siswa
            'agama' => $row['agama'],
            'alamat' => $row['alamat'],
            'rt' => $clean($row['rt']),
            'rw' => $clean($row['rw']),
            'dusun' => $row['dusun'],
            'desa_kelurahan' => $row['kelurahan'], // Header: Kelurahan
            'kecamatan' => $row['kecamatan'],
            'kode_pos' => $clean($row['kode_pos']),
            'jenis_tinggal' => $row['jenis_tinggal'],
            'alat_transportasi' => $row['alat_transportasi'],
            'no_telp' => $clean($row['telepon']),
            'no_hp' => $clean($row['hp']),
            'email' => $row['e_mail'] ?? $row['email'] ?? null, // Header: E-Mail
            
            'skhun' => $clean($row['skhun']),
            'penerima_kps' => $bool($row['penerima_kps']),
            'no_kps' => $clean($row['no_kps'] ?? $row['no_kps']), // Maatwebsite snake_case handles dot? usually 'no_kps'
            
            // Ayah
            'nama_ayah' => $row['nama_ayah'],
            'tahun_lahir_ayah' => $row['tahun_lahir_ayah'],
            'pendidikan_ayah' => $row['jenjang_pendidikan_ayah'],
            'pekerjaan_ayah' => $row['pekerjaan_ayah'],
            'penghasilan_ayah' => $row['penghasilan_ayah'],
            'nik_ayah' => $clean($row['nik_ayah']),

            // Ibu
            'nama_ibu' => $row['nama_ibu'],
            'tahun_lahir_ibu' => $row['tahun_lahir_ibu'],
            'pendidikan_ibu' => $row['jenjang_pendidikan_ibu'],
            'pekerjaan_ibu' => $row['pekerjaan_ibu'],
            'penghasilan_ibu' => $row['penghasilan_ibu'],
            'nik_ibu' => $clean($row['nik_ibu']),

            // Wali
            'nama_wali' => $row['nama_wali'],
            'tahun_lahir_wali' => $row['tahun_lahir_wali'],
            'pendidikan_wali' => $row['jenjang_pendidikan_wali'],
            'pekerjaan_wali' => $row['pekerjaan_wali'],
            'penghasilan_wali' => $row['penghasilan_wali'],
            'nik_wali' => $clean($row['nik_wali']),

            // Link to Kelas
            'kelas_id' => $kelas ? $kelas->id : null,
            'kelas_temp' => $row['rombel_saat_ini'] ?? null, // Fallback text field
            'rombel' => $row['rombel_saat_ini'],
            'no_peserta_un' => $clean($row['no_peserta_ujian_nasional']),
            'no_seri_ijazah' => $clean($row['no_seri_ijazah']),
            'penerima_kip' => $bool($row['penerima_kip_yatidak']), // "Ya/Tidak" part often removed by normalization?? Check. Assuming 'penerima_kip_yatidak' or 'penerima_kip'
            'no_kip' => $clean($row['nomor_kip']),
            'nama_di_kip' => $row['nama_di_kip'],
            'no_kks' => $clean($row['nomor_kks']),
            'no_akta_lahir' => $clean($row['no_registrasi_akta_lahir']),
            'bank' => $row['bank'],
            'no_rekening_bank' => $clean($row['nomor_rekening_bank']),
            'rekening_atas_nama' => $row['rekening_atas_nama'],
            'layak_pip' => $bool($row['layak_pip_yatidak']),
            'alasan_layak_pip' => $row['alasan_layak_pip_yatimpiatuyatim_piaturentan_miskin'], // Normalized long header...
            'kebutuhan_khusus' => $row['kebutuhan_khusus'],
            'sekolah_asal' => $row['sekolah_asal'],
            'anak_ke' => $row['anak_ke_berapa'],
            'lintang' => $row['lintang'],
            'bujur' => $row['bujur'],
            'no_kk' => $clean($row['no_kk']),
            'berat_badan' => $row['berat_badan'],
            'tinggi_badan' => $row['tinggi_badan'],
            'lingkar_kepala' => $row['lingkar_kepala'],
            'jml_saudara_kandung' => $row['jml_saudara_kandung'],
            'jarak_rumah_ke_sekolah' => $row['jarak_rumah_ke_sekolah_km'],
            
            // Set default status if new
            'status' => 'aktif',
        ]);

        if ($student->wasRecentlyCreated) {
            $this->created++;
        } else {
            $this->updated++;
        }

        return $student;
    }
}
