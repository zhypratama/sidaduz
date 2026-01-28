import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import AiAssistant from '@/Components/AiAssistant';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';
import { Heart, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AuthenticatedLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Check for 2FA prompt
    useEffect(() => {
        const hasSeenPrompt = sessionStorage.getItem('2fa_prompt_seen');

        if (user && !user.two_factor_confirmed_at && !hasSeenPrompt) {
            Swal.fire({
                toast: true,
                position: 'bottom-end',
                icon: 'warning',
                title: 'Rekomendasi Keamanan',
                text: 'Aktifkan 2FA untuk mengamankan akun Anda',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Aktifkan Sekarang',
                cancelButtonText: 'Nanti Saja',
                confirmButtonColor: '#4f46e5',
                timer: 10000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            }).then((result) => {
                sessionStorage.setItem('2fa_prompt_seen', 'true');
                if (result.isConfirmed) {
                    window.location.href = route('profile.two-factor.show');
                }
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-500">
            {/* Subtle Animated Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Navbar */}
            <Navbar
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            {/* Main Content */}
            <main
                className={`pt-24 px-6 pb-6 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
            >
                {header && (
                    <header className="mb-6 animate-fadeIn flex-shrink-0">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-gray-200/30 dark:shadow-gray-900/50 border border-gray-100/50 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1 w-full">
                                {header}
                            </div>

                            {/* Global Weather Widget */}
                            {usePage().props.weather && (
                                <div className="hidden lg:flex bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border border-blue-100 dark:border-gray-600 rounded-2xl px-5 py-2.5 items-center gap-4 shadow-sm">
                                    <span className="text-3xl filter drop-shadow-sm">
                                        {usePage().props.weather.condition_code <= 3 ? '☀️' :
                                            usePage().props.weather.condition_code <= 60 ? '☁️' :
                                                usePage().props.weather.condition_code <= 80 ? '🌧️' : '⛈️'}
                                    </span>
                                    <div>
                                        <p className="text-[10px] font-black tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-0.5">{usePage().props.weather.location}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-black text-gray-800 dark:text-white leading-none">
                                                {usePage().props.weather.temp}°
                                            </span>
                                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {usePage().props.weather.is_day ? 'Siang' : 'Malam'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                <div className="flex-1 animate-fadeIn delay-100">
                    {children}
                </div>

                {/* Premium Flash Messages */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                    {usePage().props.flash?.success && (
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3 animate-slideInRight backdrop-blur-sm">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">Berhasil!</h4>
                                <p className="text-sm opacity-90">{usePage().props.flash.success}</p>
                            </div>
                            <button onClick={() => usePage().props.flash.success = null} className="ml-4 hover:bg-white/20 p-2 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                    {usePage().props.flash?.error && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-red-500/30 flex items-center gap-3 animate-slideInRight backdrop-blur-sm">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold">Gagal!</h4>
                                <p className="text-sm opacity-90">{usePage().props.flash.error}</p>
                            </div>
                            <button onClick={() => usePage().props.flash.error = null} className="ml-4 hover:bg-white/20 p-2 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Premium Footer */}
                <footer className="mt-12 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles size={12} className="text-primary" />
                        <span>&copy; {usePage()?.props?.footer?.year || new Date().getFullYear()} SIDADU {usePage()?.props?.footer?.version || 'v1.0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Developed with</span>
                        <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                        <span>by Fanzhy</span>
                    </div>
                </footer>
                <AiAssistant />
            </main>
        </div>
    );
}

