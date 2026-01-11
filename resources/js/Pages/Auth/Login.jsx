import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Heart, Calculator } from 'lucide-react';
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, canResetPassword, captcha_question }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        captcha: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password', 'captcha'),
        });
    };

    return (
        <div className="min-h-screen flex text-gray-900 font-sans">
            <Head title="Login Administrator" />

            {/* LEFT SIDE - BRANDING */}
            <div className="hidden lg:flex w-1/2 bg-[#0C1E3C] relative overflow-hidden flex-col justify-between p-16 text-white">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>

                {/* Top Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
                            <ApplicationLogo className="w-10 h-10 fill-current text-white" />
                        </div>
                        <span className="font-bold tracking-widest text-sm uppercase text-blue-100/80">SMP Al-Irsyad Bogor</span>
                    </div>

                    <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
                        Sistem Informasi <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Data Terpadu</span>
                    </h1>
                    <p className="text-blue-200/90 text-lg max-w-md leading-relaxed font-light">
                        Platform manajemen sekolah terintegrasi untuk efisiensi administrasi, akademik, dan kesiswaan.
                    </p>
                </div>

                {/* Bottom Badge */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 rounded-full backdrop-blur-md border border-white/10 text-sm font-medium text-blue-100 hover:bg-white/10 transition-colors cursor-default">
                        <ShieldCheck size={16} className="text-cyan-400" />
                        <span>Protected by End-to-End Encryption</span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative">

                <div className="w-full max-w-[26rem] mx-auto">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-10 text-center">
                        <ApplicationLogo className="w-16 h-16 fill-current text-[#0C1E3C] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">SIDADU Login</h2>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang 👋</h2>
                        <p className="mt-3 text-gray-500 text-base">Silakan login untuk mengakses dashboard.</p>
                    </div>

                    {status && (
                        <div className="p-4 mb-6 text-sm font-medium text-green-700 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2 animate-fade-in-down">
                            <ShieldCheck size={18} />
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="email" value="Email" className="text-gray-700 font-semibold" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0C1E3C]">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-11 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0C1E3C] focus:ring-[#0C1E3C] transition-all py-3 shadow-sm group-hover:bg-white group-hover:border-gray-300"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@sekolah.id"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-semibold" />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0C1E3C]">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="pl-11 pr-11 block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0C1E3C] focus:ring-[#0C1E3C] transition-all py-3 shadow-sm group-hover:bg-white group-hover:border-gray-300"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Captcha */}
                        <div className="space-y-1.5 pt-2">
                            <InputLabel htmlFor="captcha" value="Verifikasi Keamanan" className="text-gray-700 font-semibold" />
                            <div className="bg-blue-50/50 p-1.5 rounded-xl border border-blue-100 flex items-center gap-2">
                                <div className="bg-white text-[#0C1E3C] font-mono font-bold text-lg px-4 py-2 rounded-lg border border-blue-100 shadow-sm min-w-[3.5rem] text-center select-none flex items-center gap-2">
                                    <Calculator size={16} className="text-gray-400" />
                                    {captcha_question || '...'}
                                </div>
                                <TextInput
                                    id="captcha"
                                    type="number"
                                    name="captcha"
                                    value={data.captcha}
                                    className="block w-full rounded-lg border-transparent bg-transparent focus:border-transparent focus:ring-0 focus:bg-white transition-all py-2 placeholder-gray-400 font-medium text-[#0C1E3C]"
                                    onChange={(e) => setData('captcha', e.target.value)}
                                    placeholder="Tulis hasil..."
                                />
                            </div>
                            {errors.captcha && <InputError message={errors.captcha} className="mt-1" />}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group select-none">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-[#0C1E3C] focus:ring-[#0C1E3C] transition-colors"
                                />
                                <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors font-medium">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-semibold text-[#0C1E3C] hover:text-blue-700 transition-colors hover:underline"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-xl shadow-blue-900/10 text-sm font-bold text-white bg-[#0C1E3C] hover:bg-[#153261] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C1E3C] transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Masuk Dashboard'}
                        </PrimaryButton>
                    </form>

                    {/* Footer */}
                    <div className="pt-10 mt-6 border-t border-gray-100 text-center space-y-2">
                        <p className="text-xs text-gray-400 font-medium">
                            &copy; {new Date().getFullYear()} SIDADU (Sistem Informasi Data Terpadu - Fz&T) v.1.0.0
                        </p>
                        <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
                            Laravel v12.46.0 made with <Heart size={10} className="text-red-500 fill-red-500" /> by Fanzhy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
