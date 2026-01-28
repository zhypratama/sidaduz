<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class PublicPageSettingController extends Controller
{
    public function index()
    {
        $settings = AppSetting::whereIn('key', [
            'landing_hero_title',
            'landing_hero_subtitle',
            'landing_bg_image',
            'landing_show_stats',
            'landing_welcome_text'
        ])->pluck('value', 'key');

        return Inertia::render('Settings/PublicPage', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'landing_hero_title' => 'required|string|max:255',
            'landing_hero_subtitle' => 'nullable|string|max:255',
            'landing_bg_image' => 'nullable|image|max:2048', // 2MB Max
            'landing_show_stats' => 'boolean',
            'landing_welcome_text' => 'nullable|string',
        ]);

        // Handle File Upload
        if ($request->hasFile('landing_bg_image')) {
            // Delete old image if exists
            $oldImage = AppSetting::where('key', 'landing_bg_image')->value('value');
            if ($oldImage && Storage::disk('public')->exists($oldImage)) {
                Storage::disk('public')->delete($oldImage);
            }

            $path = $request->file('landing_bg_image')->store('landing', 'public');
            AppSetting::updateOrCreate(['key' => 'landing_bg_image'], ['value' => $path]);
        }

        // Update other settings
        AppSetting::updateOrCreate(['key' => 'landing_hero_title'], ['value' => $request->landing_hero_title]);
        AppSetting::updateOrCreate(['key' => 'landing_hero_subtitle'], ['value' => $request->landing_hero_subtitle]);
        
        // Convert boolean to string "1" or "0" for DB storage, or just store as string "true"/"false" if that's the convention. 
        // Typically AppSetting stores strings. Let's store "1" or "0".
        AppSetting::updateOrCreate(['key' => 'landing_show_stats'], ['value' => $request->landing_show_stats ? '1' : '0']);
        
        AppSetting::updateOrCreate(['key' => 'landing_welcome_text'], ['value' => $request->landing_welcome_text]);

        // Clear Cache
        Cache::forget('public_page_settings');

        return back()->with('success', 'Pengaturan halaman publik berhasil disimpan.');
    }
}
