<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permissions
        $permissions = [
            // Menu Views & Manage Access
            'view.dashboard',
            
            'view.sekolah',
            'edit.sekolah', // Profil, Tahun Ajaran

            'view.kelas',
            'create.kelas',
            'edit.kelas',
            'delete.kelas',

            'view.surat',
            // Surat specific actions already defined below

            'view.gtk',
            'edit.gtk',

            'view.siswa',
            'edit.siswa',

            'view.kurikulum',
            'edit.kurikulum', // Kalender, Mapel

            'view.ppdb',
            'edit.ppdb',

            'view.settings',
            'edit.settings',

            // Surat Specific
            'surat.view', // Can view content
            'surat.create',
            'surat.edit',
            'surat.delete',
            'surat.approve', 
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // 1. Admin Sekolah
        $admin = Role::firstOrCreate(['name' => 'Admin Sekolah', 'guard_name' => 'web']);
        $admin->givePermissionTo(Permission::all()); // Give ALL permissions

        // 2. Kepala Sekolah
        $kepsek = Role::firstOrCreate(['name' => 'Kepala Sekolah', 'guard_name' => 'web']);
        $kepsek->givePermissionTo([
            'view.dashboard', 'view.sekolah', 'view.kelas', 'view.surat', 'view.gtk', 'view.siswa', 'view.kurikulum', 'view.ppdb',
            'surat.view', 'surat.approve'
        ]);

        // 3. Kurikulum
        $kurikulum = Role::firstOrCreate(['name' => 'Kurikulum', 'guard_name' => 'web']);
        $kurikulum->givePermissionTo(['view.dashboard', 'view.kurikulum', 'view.kelas', 'view.siswa']);

        // Other Roles (placeholder)
        $otherRoles = [
            'Kurikulum', 'Kesiswaan', 'Guru', 'Petugas Piket', 
            'Walikelas', 'Staff', 'Siswa', 'Orang Tua'
        ];

        foreach ($otherRoles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }
}
