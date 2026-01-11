<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // Get all settings and group them
        $settings = AppSetting::all()->groupBy('group');

        // Fetch Roles and Permissions for Matrix
        $roles = \Spatie\Permission\Models\Role::with('permissions')->get();
        $permissions = \Spatie\Permission\Models\Permission::all();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function updatePermission(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permission' => 'required|exists:permissions,name',
            'enabled' => 'required|boolean'
        ]);

        $role = \Spatie\Permission\Models\Role::findById($request->role_id);
        
        if ($request->enabled) {
            $role->givePermissionTo($request->permission);
        } else {
            $role->revokePermissionTo($request->permission);
        }

        return back()->with('success', 'Hak akses berhasil diperbarui!');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|exists:app_settings,key',
            'settings.*.value' => 'nullable'
        ]);

        foreach ($data['settings'] as $item) {
            AppSetting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return back()->with('success', 'Pengaturan berhasil diperbarui!');
    }
    
    // Perform App Update (Simulated or Git Pull)
    public function updateApp()
    {
        // Logic for git pull or similar
        // For now, simulated
        return back()->with('success', 'Aplikasi berhasil diperbarui ke versi terbaru!');
    }
}
