<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $n1 = rand(1, 9);
        $n2 = rand(1, 9);
        session(['login_captcha' => $n1 + $n2]);

        $profile = \App\Models\SchoolProfile::first();
        $logoUrl = $profile && $profile->logo ? asset('storage/' . $profile->logo) : null;

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'captcha_question' => "$n1 + $n2 = ?",
            'school_logo_url' => $logoUrl,
            'school_name' => $profile->nama_sekolah ?? '[NAMA INSTITUSI SEKOLAH]',
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Check if user has 2FA enabled
        if ($user && $user->two_factor_confirmed_at) {
            // Logout temporarily
            Auth::logout();
            
            // Store user ID in session for 2FA verification
            session([
                'login.2fa.user_id' => $user->id,
                'login.2fa.remember' => $request->boolean('remember')
            ]);
            
            return redirect()->route('two-factor.challenge');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
