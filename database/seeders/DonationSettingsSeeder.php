<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class DonationSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donationSettings = [
            [
                'key' => 'donation_enabled',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Enable/Disable donation page visibility'
            ],
            [
                'key' => 'donation_qris_image',
                'value' => '/images/qris-placeholder.png',
                'type' => 'string',
                'description' => 'Path to QRIS payment image'
            ],
            [
                'key' => 'donation_bank_name',
                'value' => 'Bank BRI',
                'type' => 'string',
                'description' => 'Bank name for donation transfer'
            ],
            [
                'key' => 'donation_bank_account',
                'value' => '1234567890',
                'type' => 'string',
                'description' => 'Bank account number for donations'
            ],
            [
                'key' => 'donation_account_name',
                'value' => 'Developer SIDADUZ',
                'type' => 'string',
                'description' => 'Account holder name'
            ],
            [
                'key' => 'donation_message',
                'value' => 'SIDADUZ adalah aplikasi gratis & open-source yang dikembangkan dengan penuh dedikasi untuk dunia pendidikan Indonesia. Dukungan Anda sangat berarti untuk sustainability pengembangan aplikasi ini.',
                'type' => 'text',
                'description' => 'Custom donation page message'
            ],
        ];

        foreach ($donationSettings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
