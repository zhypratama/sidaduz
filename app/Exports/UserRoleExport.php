<?php

namespace App\Exports;

use App\Models\Gtk;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserRoleExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Gtk::whereNotNull('user_id')
            ->with(['user.roles'])
            ->orderBy('nama')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Nama GTK',
            'NIP / NIK',
            'Email Akun',
            'Jabatan (PTK)',
            'Role Utama',
            'Role Tambahan',
            'Status Akun'
        ];
    }

    public function map($gtk): array
    {
        $roles = $gtk->user && $gtk->user->roles ? $gtk->user->roles : collect([]);
        $role1 = $roles->get(0) ? $roles->get(0)->name : '-';
        $role2 = $roles->get(1) ? $roles->get(1)->name : '-';

        return [
            $gtk->nama,
            $gtk->nip ?? $gtk->nik ?? '-',
            $gtk->user->email ?? '-',
            $gtk->jenis_ptk ?? '-',
            $role1,
            $role2,
            $gtk->user ? 'Aktif' : 'Non-Aktif',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
