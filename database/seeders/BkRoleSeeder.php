<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class BkRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Permissions
        $permissions = [
            'view.bk',
            'bk.pelanggaran.create',
            'bk.pelanggaran.edit',
            'bk.pelanggaran.delete',
            'bk.konseling.create',
            'bk.konseling.edit',
            'bk.aturan.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Create 'Guru BK' Role
        $bkRole = Role::firstOrCreate(['name' => 'Guru BK']);
        $bkRole->syncPermissions($permissions);

        // 3. Assign Permissions to 'Admin Sekolah'
        $adminRole = Role::where('name', 'Admin Sekolah')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($permissions);
        }

        // 4. Assign 'Guru BK' role to specific user (optional, e.g., first user or specific email)
        // For testing, let's ensure the logged-in user (likely ID 1 or admin) has access.
        $adminUser = User::find(1); // Usually super admin
        if ($adminUser) {
            $adminUser->assignRole('Guru BK');
        }
    }
}
