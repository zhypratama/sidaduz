<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Collection;

use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class GtkTemplateExport implements FromCollection, WithHeadings, ShouldAutoSize, WithColumnFormatting
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Return mostly empty rows, maybe 1 example row
        return new Collection([
            [
                'Budi Santoso', // nama
                '1234567890123456', // nuptk
                'L', // jk
                'Jakarta', // tempat_lahir
                '1990-01-01', // tanggal_lahir
                '199001012019011001', // nip
                'PNS', // status_kepegawaian
                'Guru Mapel', // jenis_ptk
                'Islam', // agama
                'Jl. Merdeka No. 1', // alamat_jalan
                '01', // rt
                '02', // rw
                'Maju Jaya', // nama_dusun
                'Sukamaju', // desakelurahan
                'Gambir', // kecamatan
                '10110', // kode_pos
                '021-1234567', // telepon
                '081234567890', // hp
                'budi@example.com', // email
                'Wali Kelas', // tugas_tambahan
                'SK-123', // sk_cpns
                '2019-01-01', // tanggal_cpns
                'SK-456', // sk_pengangkatan
                '2020-01-01', // tmt_pengangkatan
                'Pemerintah Kota', // lembaga_pengangkatan
                'III/a', // pangkat_golongan
                'APBD', // sumber_gaji
                'Siti Aminah', // nama_ibu_kandung
                'Menikah', // status_perkawinan
                'Siti Zulaikha', // nama_suami_istri
                '19950505202001002', // nip_suami_istri
                'PNS', // pekerjaan_suami_istri
                '2021-01-01', // tmt_pns
                'Ya', // sudah_lisensi_kepala_sekolah
                'Tidak', // pernah_diklat_kepengawasan
                'Tidak', // keahlian_braille
                'Tidak', // keahlian_bahasa_isyarat
                '12.345.678.9-012.000', // npwp
                'Budi Santoso', // nama_wajib_pajak
                'WNI', // kewarganegaraan
                'Bank BRI', // bank
                '1234-01-000001-50-1', // nomor_rekening_bank
                'Budi Santoso', // rekening_atas_nama
                '3201010101900001', // nik
                '3201010101010001', // no_kk
                'A-123456', // karpeg
                'B-123456', // karis_karsu
                '-6.200000', // lintang
                '106.816666', // bujur
                '19023L012312321', // nuks
            ]
        ]);
    }

    public function headings(): array
    {
        return [
            'nama',
            'nuptk',
            'jk',
            'tempat_lahir',
            'tanggal_lahir',
            'nip',
            'status_kepegawaian',
            'jenis_ptk',
            'agama',
            'alamat_jalan',
            'rt',
            'rw',
            'nama_dusun',
            'desakelurahan',
            'kecamatan',
            'kode_pos',
            'telepon',
            'hp',
            'email',
            'tugas_tambahan',
            'sk_cpns',
            'tanggal_cpns',
            'sk_pengangkatan',
            'tmt_pengangkatan',
            'lembaga_pengangkatan',
            'pangkat_golongan',
            'sumber_gaji',
            'nama_ibu_kandung',
            'status_perkawinan',
            'nama_suami_istri',
            'nip_suami_istri',
            'pekerjaan_suami_istri',
            'tmt_pns',
            'sudah_lisensi_kepala_sekolah',
            'pernah_diklat_kepengawasan',
            'keahlian_braille',
            'keahlian_bahasa_isyarat',
            'npwp',
            'nama_wajib_pajak',
            'kewarganegaraan',
            'bank',
            'nomor_rekening_bank',
            'rekening_atas_nama',
            'nik',
            'no_kk',
            'karpeg',
            'karis_karsu',
            'lintang',
            'bujur',
            'nuks',
        ];
    }
    public function columnFormats(): array
    {
        return [
            'B' => NumberFormat::FORMAT_TEXT, // nuptk
            'F' => NumberFormat::FORMAT_TEXT, // nip
            'K' => NumberFormat::FORMAT_TEXT, // rt
            'L' => NumberFormat::FORMAT_TEXT, // rw
            'P' => NumberFormat::FORMAT_TEXT, // kode_pos
            'Q' => NumberFormat::FORMAT_TEXT, // telepon
            'R' => NumberFormat::FORMAT_TEXT, // hp
            'AE' => NumberFormat::FORMAT_TEXT, // nip_suami_istri
            'AL' => NumberFormat::FORMAT_TEXT, // npwp
            'AP' => NumberFormat::FORMAT_TEXT, // nomor_rekening_bank
            'AR' => NumberFormat::FORMAT_TEXT, // nik
            'AS' => NumberFormat::FORMAT_TEXT, // no_kk
            
            'E' => NumberFormat::FORMAT_DATE_DDMMYYYY, // tanggal_lahir
            'V' => NumberFormat::FORMAT_DATE_DDMMYYYY, // tanggal_cpns
            'X' => NumberFormat::FORMAT_DATE_DDMMYYYY, // tmt_pengangkatan
            'AG' => NumberFormat::FORMAT_DATE_DDMMYYYY, // tmt_pns
        ];
    }
}
