import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import { usePage } from '@inertiajs/react';
import { Heart, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthenticatedLayout({ user, header, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-light dark:bg-gray-900 dark:text-blue-400 transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Navbar */}
            <Navbar
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />

            {/* Main Content */}
            <main
                className={`pt-24 px-6 pb-6 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
            >
                {header && (
                    <header className="mb-6">
                        <div className="bg-white rounded-[20px] p-6 shadow-sm shadow-gray-200/50">
                            {header}
                        </div>
                    </header>
                )}

                {children}

                {/* Flash Messages */}
                <div className="fixed  bottom-6 right-6 z-50 flex flex-col gap-2">
                    {usePage().props.flash.success && (
                        <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300">
                            <CheckCircle size={24} />
                            <div>
                                <h4 className="font-bold">Berhasil!</h4>
                                <p className="text-sm opacity-90">{usePage().props.flash.success}</p>
                            </div>
                            <button onClick={() => usePage().props.flash.success = null} className="ml-4 hover:bg-white/20 p-1 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                    {usePage().props.flash.error && (
                        <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300">
                            <AlertCircle size={24} />
                            <div>
                                <h4 className="font-bold">Gagal!</h4>
                                <p className="text-sm opacity-90">{usePage().props.flash.error}</p>
                            </div>
                            <button onClick={() => usePage().props.flash.error = null} className="ml-4 hover:bg-white/20 p-1 rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
                    <div>
                        &copy; {new Date().getFullYear()} SIDADU v.1.0.0 use React v18.2.0
                    </div>
                    <div className="flex items-center gap-1">
                        Laravel v12.46.0 made with <Heart size={12} className="text-red-500 fill-red-500" /> by Fanzhy.
                    </div>
                </footer>
            </main>
        </div>
    );
}
