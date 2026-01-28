<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\WhatsappLog;
use App\Services\WhatsappService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsappSettingController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsappService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function index()
    {
        $settings = AppSetting::where('group', 'whatsapp')->get()->pluck('value', 'key');
        $logs = WhatsappLog::latest()->take(10)->get();

        return Inertia::render('Admin/Settings/Whatsapp/Index', [
            'settings' => $settings,
            'logs' => $logs,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'wa_api_key' => 'nullable|string',
            'wa_sender_number' => 'nullable|string',
            'wa_default_message_header' => 'nullable|string',
        ]);

        $keys = ['wa_api_key', 'wa_sender_number', 'wa_default_message_header', 'wa_endpoint'];

        foreach ($keys as $key) {
            if ($request->has($key)) {
                AppSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $request->input($key), 'group' => 'whatsapp']
                );
            }
        }

        return redirect()->back()->with('success', 'Pengaturan WhatsApp berhasil disimpan.');
    }

    public function test(Request $request)
    {
        $request->validate([
            'target_number' => 'required|numeric',
            'message' => 'required|string',
        ]);

        $result = $this->whatsappService->send(
            $request->target_number,
            $request->message,
            'test'
        );

        if ($result['status']) {
            return redirect()->back()->with('success', 'Pesan tes berhasil dikirim!');
        } else {
            return redirect()->back()->with('error', 'Gagal mengirim pesan: ' . ($result['message'] ?? 'Unknown error'));
        }
    }
}
