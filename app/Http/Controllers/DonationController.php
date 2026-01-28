<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;

class DonationController extends Controller
{
    /**
     * Display the donation page.
     */
    public function index()
    {
        // Check if donation is enabled
        $enabled = Setting::where('key', 'donation_enabled')->value('value') ?? '1';
        
        if ($enabled !== '1') {
            abort(404);
        }

        // Fetch all donation settings
        $donationData = [
            'enabled' => true,
            'qris_image' => Setting::where('key', 'donation_qris_image')->value('value') ?? '/images/qris-placeholder.png',
            'bank_name' => Setting::where('key', 'donation_bank_name')->value('value') ?? 'Bank BRI',
            'bank_account' => Setting::where('key', 'donation_bank_account')->value('value') ?? '1234567890',
            'account_name' => Setting::where('key', 'donation_account_name')->value('value') ?? 'Developer SIDADUZ',
            'message' => Setting::where('key', 'donation_message')->value('value') ?? 'Terima kasih atas dukungan Anda!',
        ];

        return Inertia::render('Donation', [
            'donationData' => $donationData,
        ]);
    }
}
