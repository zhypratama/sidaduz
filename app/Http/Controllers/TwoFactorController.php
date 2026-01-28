<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Crypt;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TwoFactorController extends Controller
{
    /**
     * Show 2FA setup page
     */
    public function show()
    {
        $user = auth()->user();
        
        $google2fa = new Google2FA();
        
        // Generate secret key jika belum ada
        if (!$user->two_factor_secret) {
            $secret = $google2fa->generateSecretKey();
        } else {
            $secret = Crypt::decryptString($user->two_factor_secret);
        }
        
        // Generate OTP Auth String
        $qrCodeString = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );
        
        // Generate QR Code Image (SVG Data URI)
        $qrCodeImage = 'data:image/svg+xml;base64,' . base64_encode(
            QrCode::size(200)->generate($qrCodeString)
        );
        
        return Inertia::render('Profile/TwoFactor', [
            'qrCodeUrl' => $qrCodeImage,
            'secret' => $secret,
            'enabled' => !is_null($user->two_factor_confirmed_at),
            'recoveryCodes' => $user->two_factor_recovery_codes ? json_decode(Crypt::decryptString($user->two_factor_recovery_codes), true) : null,
        ]);
    }
    
    /**
     * Enable 2FA
     */
    public function enable(Request $request)
    {
        $request->validate([
            'secret' => 'required|string',
            'code' => 'required|digits:6',
        ]);
        
        $google2fa = new Google2FA();
        
        // Verify OTP code with window = 2 (1 minute tolerance)
        $valid = $google2fa->verifyKey($request->secret, $request->code, 2);
        
        if (!$valid) {
            return back()->withErrors(['code' => 'Invalid verification code. Please try again.']);
        }
        
        // Generate recovery codes
        $recoveryCodes = $this->generateRecoveryCodes();
        
        // Save 2FA settings
        $user = auth()->user();
        $user->two_factor_secret = Crypt::encryptString($request->secret);
        $user->two_factor_recovery_codes = Crypt::encryptString(json_encode($recoveryCodes));
        $user->two_factor_confirmed_at = now();
        $user->save();
        
        return redirect()->route('profile.two-factor.show')
            ->with('success', 'Two-factor authentication enabled successfully!');
    }
    
    /**
     * Disable 2FA
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);
        
        $user = auth()->user();
        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();
        
        return redirect()->route('profile.two-factor.show')
            ->with('success', 'Two-factor authentication disabled.');
    }
    
    /**
     * Regenerate recovery codes
     */
    public function regenerateRecoveryCodes(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);
        
        $recoveryCodes = $this->generateRecoveryCodes();
        
        $user = auth()->user();
        $user->two_factor_recovery_codes = Crypt::encryptString(json_encode($recoveryCodes));
        $user->save();
        
        return redirect()->route('profile.two-factor.show')
            ->with('success', 'Recovery codes regenerated successfully!');
    }
    
    /**
     * Generate random recovery codes
     */
    private function generateRecoveryCodes($count = 8)
    {
        $codes = [];
        
        for ($i = 0; $i < $count; $i++) {
            $codes[] = strtoupper(substr(md5(random_bytes(16)), 0, 10));
        }
        
        return $codes;
    }
    
    /**
     * Show 2FA challenge (during login)
     */
    public function challenge()
    {
        if (!session('login.2fa.user_id')) {
            return redirect()->route('login');
        }
        
        return Inertia::render('Auth/TwoFactorChallenge');
    }
    
    /**
     * Send WhatsApp OTP
     */
    public function sendWhatsappOtp(Request $request, \App\Services\WhatsappService $whatsappService)
    {
        $userId = session('login.2fa.user_id');

        if (!$userId) {
            return response()->json(['message' => 'Session expired.'], 401);
        }

        $user = \App\Models\User::with('gtk')->findOrFail($userId);
        
        // Determine phone number. 
        // 1. Try GTK profile
        $phone = $user->gtk?->no_hp;
        
        // 2. Fallback? If admin doesn't have GTK, maybe we should add 'no_hp' to users table later, 
        // but for now let's assume GTK or error.
        if (!$phone) {
             return response()->json(['message' => 'Nomor WhatsApp tidak ditemukan di profil Anda.'], 404);
        }

        // Generate Code
        $code = rand(100000, 999999);
        
        // Store in Cache for 5 minutes
        \Illuminate\Support\Facades\Cache::put('wa_otp_' . $userId, $code, 300);

        // Send Message
        $whatsappService->send(
            $phone, 
            "Kode Login SIDADU Anda: *{$code}*.\n\nJangan berikan kode ini kepada siapapun.",
            'otp'
        );

        return response()->json(['message' => 'Kode OTP terkirim ke WhatsApp Anda.']);
    }

    /**
     * Verify 2FA code (during login)
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);
        
        $userId = session('login.2fa.user_id');
        
        if (!$userId) {
            return redirect()->route('login')->withErrors(['code' => 'Session expired. Please login again.']);
        }
        
        $user = \App\Models\User::findOrFail($userId);
        
        $isValid = false;

        // 1. Check Recovery Code
        if (strlen($request->code) === 10) {
            return $this->verifyRecoveryCode($user, $request->code);
        }
        
        // 2. Check WhatsApp OTP
        $cachedOtp = \Illuminate\Support\Facades\Cache::get('wa_otp_' . $userId);
        if ($cachedOtp && $request->code == $cachedOtp) {
            $isValid = true;
            \Illuminate\Support\Facades\Cache::forget('wa_otp_' . $userId); // Consume OTP
        }

        // 3. Check Google Authenticator (TOTP)
        if (!$isValid && $user->two_factor_secret) {
            try {
                $google2fa = new Google2FA();
                $secret = Crypt::decryptString($user->two_factor_secret);
                $isValid = $google2fa->verifyKey($secret, $request->code, 2);
            } catch (\Exception $e) {
                // Decrypt failed or secret invalid
                $isValid = false;
            }
        }
        
        if (!$isValid) {
            return back()->withErrors(['code' => 'Kode autentikasi tidak valid.']);
        }
        
        // Login successful
        auth()->login($user, session('login.2fa.remember'));
        session()->forget(['login.2fa.user_id', 'login.2fa.remember']);
        
        return redirect()->intended(route('dashboard'));
    }
    
    /**
     * Verify recovery code
     */
    private function verifyRecoveryCode($user, $code)
    {
        $recoveryCodes = json_decode(Crypt::decryptString($user->two_factor_recovery_codes), true);
        
        if (!in_array(strtoupper($code), $recoveryCodes)) {
            return back()->withErrors(['code' => 'Invalid recovery code.']);
        }
        
        // Remove used recovery code
        $recoveryCodes = array_diff($recoveryCodes, [strtoupper($code)]);
        $user->two_factor_recovery_codes = Crypt::encryptString(json_encode(array_values($recoveryCodes)));
        $user->save();
        
        // Login successful
        auth()->login($user, session('login.2fa.remember'));
        session()->forget(['login.2fa.user_id', 'login.2fa.remember']);
        
        return redirect()->intended(route('dashboard'))
            ->with('warning', 'You used a recovery code. Please regenerate new codes.');
    }
}
