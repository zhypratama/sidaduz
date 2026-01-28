import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Shield, Key, Download, AlertTriangle, Check } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function TwoFactor({ auth, qrCodeUrl, secret, enabled, recoveryCodes }) {
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

    const enableForm = useForm({
        secret: secret,
        code: '',
    });

    const disableForm = useForm({
        password: '',
    });

    const recoveryForm = useForm({
        password: '',
    });

    const handleEnable = (e) => {
        e.preventDefault();
        enableForm.post(route('profile.two-factor.enable'), {
            onSuccess: () => {
                enableForm.reset('code');
                setShowRecoveryCodes(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: '2FA telah diaktifkan. Mohon simpan kode pemulihan Anda.',
                    timer: 3000
                });
            },
        });
    };

    const handleDisable = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Matikan 2FA?',
            text: 'Ini akan membuat akun Anda kurang aman',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, matikan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                disableForm.delete(route('profile.two-factor.disable'), {
                    onSuccess: () => {
                        disableForm.reset();
                        setShowRecoveryCodes(false);
                        Swal.fire('Dinonaktifkan!', '2FA telah dimatikan.', 'success');
                    }
                });
            }
        });
    };

    const handleRegenerateCodes = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Buat Ulang Kode Pemulihan?',
            text: 'Kode lama tidak akan berfungsi lagi',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, buat ulang',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                recoveryForm.post(route('profile.two-factor.recovery-codes'), {
                    onSuccess: () => {
                        recoveryForm.reset();
                        setShowRecoveryCodes(true);
                        Swal.fire('Berhasil!', 'Kode pemulihan baru berhasil dibuat.', 'success');
                    }
                });
            }
        });
    };

    const downloadRecoveryCodes = () => {
        const text = recoveryCodes.join('\n');
        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "sidadu-recovery-codes.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Two-Factor Authentication" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="text-primary" />
                        Autentikasi Dua Faktor (2FA)
                    </h1>
                    <p className="text-gray-600 mt-1">Tambahkan lapisan keamanan ekstra pada akun Anda</p>
                </div>

                {/* Current Status */}
                <div className={`mb-6 p-4 rounded-xl border-2 ${enabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-center gap-2">
                        {enabled ? (
                            <>
                                <Check className="text-green-600" size={20} />
                                <span className="text-green-800 font-semibold">2FA Aktif</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="text-yellow-600" size={20} />
                                <span className="text-yellow-800 font-semibold">2FA Belum Aktif (Disarankan untuk Admin)</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Setup 2FA */}
                    {!enabled ? (
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-lg font-bold mb-4">Aktifkan 2FA</h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        1. Instal <strong>Google Authenticator</strong> atau <strong>Authy</strong> di ponsel Anda
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">
                                        2. Pindai kode QR ini:
                                    </p>

                                    <div className="flex justify-center mb-4">
                                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border-2 p-2 rounded-xl" />
                                    </div>

                                    <p className="text-xs text-gray-500 text-center mb-2">Atau masukkan kode ini secara manual:</p>
                                    <div className="bg-gray-100 p-3 rounded-lg text-center font-mono text-sm break-all">
                                        {secret}
                                    </div>
                                </div>

                                <form onSubmit={handleEnable}>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">3. Masukkan kode verifikasi dari aplikasi:</label>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            placeholder="000000"
                                            className="w-full rounded-xl border-gray-300 text-center text-2xl tracking-widest font-mono"
                                            value={enableForm.data.code}
                                            onChange={e => enableForm.setData('code', e.target.value.replace(/\D/g, ''))}
                                        />
                                        {enableForm.errors.code && (
                                            <p className="text-red-500 text-xs mt-1">{enableForm.errors.code}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={enableForm.processing || enableForm.data.code.length !== 6}
                                        className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {enableForm.processing ? 'Mengaktifkan...' : 'Aktifkan 2FA'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-lg font-bold mb-4 text-green-600 flex items-center gap-2">
                                <Shield /> 2FA Aktif
                            </h2>

                            <p className="text-gray-600 mb-4">
                                Akun Anda terlindungi dengan autentikasi dua faktor.
                            </p>

                            <form onSubmit={handleDisable}>
                                <label className="block text-sm font-medium mb-2">Masukkan kata sandi untuk menonaktifkan:</label>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border-gray-300 mb-3"
                                    value={disableForm.data.password}
                                    onChange={e => disableForm.setData('password', e.target.value)}
                                />
                                {disableForm.errors.password && (
                                    <p className="text-red-500 text-xs mb-2">{disableForm.errors.password}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={disableForm.processing}
                                    className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
                                >
                                    {disableForm.processing ? 'Menonaktifkan...' : 'Matikan 2FA'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Recovery Codes */}
                    {enabled && recoveryCodes && (
                        <div className="bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Key className="text-orange-500" />
                                Kode Pemulihan
                            </h2>

                            <p className="text-sm text-gray-600 mb-4">
                                Simpan kode-kode ini di tempat aman. Setiap kode hanya bisa digunakan sekali.
                            </p>

                            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-4 max-h-64 overflow-y-auto space-y-1">
                                {recoveryCodes.map((code, index) => (
                                    <div key={index}>{code}</div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={downloadRecoveryCodes}
                                    className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-xl font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
                                >
                                    <Download size={18} /> Unduh
                                </button>

                                <form onSubmit={handleRegenerateCodes} className="flex-1">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="hidden"
                                        value={recoveryForm.data.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Masukkan Kata Sandi',
                                                input: 'password',
                                                inputPlaceholder: 'Kata sandi Anda',
                                                showCancelButton: true,
                                                cancelButtonText: 'Batal',
                                                confirmButtonText: 'Konfirmasi'
                                            }).then((result) => {
                                                if (result.isConfirmed && result.value) {
                                                    recoveryForm.setData('password', result.value);
                                                    recoveryForm.post(route('profile.two-factor.recovery-codes'));
                                                }
                                            });
                                        }}
                                        className="w-full bg-orange-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-orange-600"
                                    >
                                        Buat Ulang
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Cara Kerja</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Saat login, Anda memerlukan kata sandi DAN kode 6 digit dari aplikasi autentikator</li>
                        <li>• Kode berubah setiap 30 detik</li>
                        <li>• Jika ponsel hilang, gunakan kode pemulihan untuk mendapatkan akses kembali</li>
                        <li>• Kode pemulihan hanya bisa digunakan sekali - buat ulang setelah digunakan</li>
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
