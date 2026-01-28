<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class WhatsappSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'wa_provider',
                'value' => 'fonnte', // Default provider
                'group' => 'whatsapp',
                'label' => 'WhatsApp Provider',
                'type' => 'select', // Options: fonnte, twilio, etc
            ],
            [
                'key' => 'wa_api_key',
                'value' => '', // Empty by default
                'group' => 'whatsapp',
                'label' => 'API Token',
                'type' => 'password',
            ],
            [
                'key' => 'wa_endpoint',
                'value' => 'https://api.fonnte.com/send',
                'group' => 'whatsapp',
                'label' => 'API Endpoint',
                'type' => 'text',
            ],
            [
                'key' => 'wa_default_message_header',
                'value' => "*[SIDADU SYSTEM]*\n\n",
                'group' => 'whatsapp',
                'label' => 'Message Header',
                'type' => 'textarea',
            ],
        ];

        foreach ($settings as $setting) {
            AppSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
