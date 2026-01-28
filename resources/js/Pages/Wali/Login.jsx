import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { User, Lock, ArrowRight, MessageCircle } from 'lucide-react';

export default function Login({ school_logo_url }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_ibu: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('wali.login.post'));
    };

    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            <Head title="Login Wali Murid" />

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

            <div className="w-full max-w-sm relative z-10">

                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mb-6">
                        {school_logo_url ? (
                            <img src={school_logo_url} alt="Logo" className="w-16 h-16 object-contain" />
                        ) : (
                            <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">SIDADU MOBILE</h1>
                    <p className="text-blue-200 text-sm font-medium">Portal Khusus Orang Tua / Wali</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={submit} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-200 uppercase tracking-widest pl-1">Nama Ibu Kandung</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-white transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={data.nama_ibu}
                                    onChange={(e) => setData('nama_ibu', e.target.value)}
                                    placeholder="Sesuai Kartu Keluarga..."
                                    className="w-full bg-black/20 text-white placeholder-blue-300/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-black/30 transition-all font-medium"
                                />
                            </div>
                            <InputError message={errors.nama_ibu} className="text-red-300 bg-red-900/40 p-2 rounded-lg text-xs" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-200 uppercase tracking-widest pl-1">PIN / Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-white transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="NIS atau Tgl Lahir (DDMMYYYY)"
                                    className="w-full bg-black/20 text-white placeholder-blue-300/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-black/30 transition-all font-medium"
                                />
                            </div>
                            <InputError message={errors.password} className="text-red-300 bg-red-900/40 p-2 rounded-lg text-xs" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            {processing ? 'Memeriksa...' : 'Masuk Aplikasi'}
                            {!processing && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">
                        &copy; 2026 SIDADU App • Versi 1.0 Mobile
                    </p>
                </div>
            </div>

            {/* Chatbot Floating Button (Bottom Left) */}
            {data.wa_number && (
                <a
                    href={`https://wa.me/${data.wa_number.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="fixed bottom-6 left-6 flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all group z-50"
                >
                    <div className="p-2 bg-green-500 rounded-full text-white shadow-lg shadow-green-500/40 animate-pulse">
                        <MessageCircle size={24} />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Butuh Bantuan?</p>
                        <p className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">Chat Asisten Virtual</p>
                    </div>
                </a>
            )}
        </div>
    );
}
