<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StudentTemplateExport implements WithHeadings, ShouldAutoSize, WithStyles
{
    public function headings(): array
    {
        return [
            'Nama Siswa',
            'NIPD',
            'Jenis Kelamin',
            'NISN',
            'Tempat Lahir',
            'Tanggal Lahir',
            'NIK Siswa',
            'Agama',
            'Alamat',
            'RT',
            'RW',
            'Dusun',
            'Kelurahan',
            'Kecamatan',
            'Kode Pos',
            'Jenis Tinggal',
            'Alat Transportasi',
            'Telepon',
            'HP',
            'E-Mail',
            'SKHUN',
            'Penerima KPS',
            'No. KPS',
            'Nama Ayah',
            'Tahun Lahir Ayah',
            'Jenjang Pendidikan Ayah',
            'Pekerjaan Ayah',
            'Penghasilan Ayah',
            'NIK Ayah',
            'Nama Ibu',
            'Tahun Lahir Ibu',
            'Jenjang Pendidikan Ibu',
            'Pekerjaan Ibu',
            'Penghasilan Ibu',
            'NIK Ibu',
            'Nama Wali',
            'Tahun Lahir Wali',
            'Jenjang Pendidikan wali',
            'Pekerjaan Wali',
            'Penghasilan Wali',
            'NIK Wali',
            'Rombel Saat Ini',
            'No Peserta Ujian Nasional',
            'No Seri Ijazah',
            'Penerima KIP (Ya/Tidak)',
            'Nomor KIP',
            'Nama di KIP',
            'Nomor KKS',
            'No Registrasi Akta Lahir',
            'Bank',
            'Nomor Rekening Bank',
            'Rekening Atas Nama',
            'Layak PIP (Ya/Tidak)',
            'Alasan Layak PIP (Yatim/Piatu/Yatim-Piatu/Rentan Miskin)',
            'Kebutuhan Khusus',
            'Sekolah Asal',
            'Anak ke-berapa',
            'Lintang',
            'Bujur',
            'No KK',
            'Berat Badan',
            'Tinggi Badan',
            'Lingkar Kepala',
            'Jml. Saudara Kandung',
            'Jarak Rumah ke Sekolah (KM)'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
