import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Shield, Key, MessageCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function TwoFactorChallenge() {
    const [useRecoveryCode, setUseRecoveryCode] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const submit = (e) => {
        e.preventDefault();
        post(route('two-factor.verify'));
    };

    const sendWhatsappOtp = async () => {
        setTimer(60); // 60s cooldown
        try {
            const response = await fetch(route('two-factor.whatsapp.send'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            const result = await response.json();

            if (response.ok) {
                setOtpSent(true);
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    title: 'OTP Terkirim!',
                    text: 'Cek WhatsApp Anda untuk melihat kode.',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                Swal.fire('Gagal', result.message || 'Gagal mengirim OTP.', 'error');
                setTimer(0);
            }
        } catch (error) {
            Swal.fire('Error', 'Terjadi kesalahan jaringan.', 'error');
            setTimer(0);
        }
    };

    return (
        <GuestLayout>
            <Head title="Two-Factor Authentication" />

            <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Shield className="text-primary" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Keamanan Ekstra</h1>
                <p className="text-gray-600 mt-2">
                    {useRecoveryCode
                        ? 'Masukkan kode pemulihan Anda'
                        : 'Masukkan kode dari Google Authenticator atau WhatsApp'}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {useRecoveryCode ? 'Kode Pemulihan (Recovery Code)' : 'Kode Autentikasi (6 Digit)'}
                    </label>
                    <input
                        type="text"
                        maxLength={useRecoveryCode ? 10 : 6}
                        placeholder={useRecoveryCode ? 'XXXXXXXXXX' : '000000'}
                        className={`w-full rounded-xl border-gray-300 text-center ${useRecoveryCode ? 'text-lg' : 'text-2xl tracking-widest'} font-mono focus:ring-primary focus:border-primary uppercase`}
                        value={data.code}
                        onChange={e => setData('code', e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase())}
                        autoFocus
                    />
                    {errors.code && (
                        <p className="text-red-500 text-sm mt-2 text-center">{errors.code}</p>
                    )}
                </div>

                {/* WhatsApp OTP Button */}
                {!useRecoveryCode && (
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={sendWhatsappOtp}
                            disabled={timer > 0}
                            className={`text-sm flex items-center justify-center gap-2 mx-auto w-full py-2 rounded-lg border border-dashed transition-all ${timer > 0
                                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                }`}
                        >
                            <MessageCircle size={16} />
                            {timer > 0 ? `Tunggu ${timer} detik...` : 'Kirim Kode via WhatsApp'}
                        </button>
                        {otpSent && <p className="text-[10px] text-green-600 mt-1">Kode terkirim ke WhatsApp terdaftar.</p>}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing || (useRecoveryCode ? data.code.length !== 10 : data.code.length !== 6)}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setUseRecoveryCode(!useRecoveryCode);
                            setData('code', '');
                        }}
                        className="text-sm text-gray-500 hover:text-gray-800 hover:underline flex items-center gap-2 mx-auto"
                    >
                        <Key size={14} />
                        {useRecoveryCode ? 'Gunakan Kode Authenticator / WA' : 'Gunakan Kode Pemulihan (Emergency)'}
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <a href={route('login')} className="text-sm text-gray-600 hover:text-gray-900 block text-center">
                        ← Kembali ke Login
                    </a>
                </div>
            </form>
        </GuestLayout>
    );
}
