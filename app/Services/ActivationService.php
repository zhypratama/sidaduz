<?php

namespace App\Services;

use App\Models\SchoolProfile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ActivationService
{
    /**
     * Data metadata sekolah yang akan dikirim (Patuh PDP: Hanya institusi, bukan personal)
     */
    public static function getRegistrationPayload()
    {
        $school = SchoolProfile::first();
        return [
            'school_name' => $school->nama_sekolah ?? 'Unknown School',
            'npsn' => $school->npsn ?? '00000000',
            'city' => $school->kota ?? '-',
            'ip_local' => request()->ip() ?? '127.0.0.1',
            'app_version' => config('app.version', '1.0.0'),
            'registered_at' => now()->toDateTimeString(),
            'php_version' => PHP_VERSION,
            'agreement_signed' => true
        ];
    }

    /**
     * Mengirim "Ping" registrasi ke pusat (Simulasi URL pusat)
     */
    public static function registerInstallation()
    {
        try {
            $payload = self::getRegistrationPayload();
            
            // 1. Log Lokal
            Log::info('SIDADU_REGISTRATION: Pendaftaran instalasi baru untuk ' . $payload['school_name'] . ' (NPSN: ' . $payload['npsn'] . ')');
            
            // 2. Kirim ke Webhook Discord (Jika dikonfigurasi di .env)
            $webhookUrl = env('REGISTRATION_WEBHOOK_URL');
            if ($webhookUrl) {
                Http::post($webhookUrl, [
                    'content' => "🚀 **Instalasi SIDADU Baru Terdeteksi!**",
                    'embeds' => [
                        [
                            'title' => $payload['school_name'],
                            'color' => 3066993, // Green
                            'fields' => [
                                ['name' => 'NPSN', 'value' => $payload['npsn'], 'inline' => true],
                                ['name' => 'Kota', 'value' => $payload['city'], 'inline' => true],
                                ['name' => 'Versi', 'value' => $payload['app_version'], 'inline' => true],
                                ['name' => 'Waktu', 'value' => $payload['registered_at'], 'inline' => false],
                                ['name' => 'Status', 'value' => '✅ Menyetujui Syarat & Ketentuan', 'inline' => false],
                            ],
                            'footer' => ['text' => 'SIDADU Digital Shield Telemetry']
                        ]
                    ]
                ]);
            }
            
            // 3. Simpan status registrasi secara lokal
            cache()->forever('installation_registered', true);
            cache()->forever('installation_data', $payload);

            return true;
        } catch (\Exception $e) {
            Log::error('SIDADU_REGISTRATION_FAILED: ' . $e->getMessage());
            return false;
        }
    }

    public static function isRegistered()
    {
        return cache()->has('installation_registered');
    }
}
