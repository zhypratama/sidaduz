import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function GuestLayout({ children }) {
    const { school_profile } = usePage().props;
    const bgImage = school_profile?.login_image
        ? `/storage/${school_profile.login_image}`
        : '/images/bg-login.png';

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Left Side - Image Section (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={bgImage}
                        alt="Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-end p-16 w-full text-white pb-32">
                    <div className="animate-in slide-in-from-left duration-700">
                        <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                            Selamat Datang di <br />
                            <span className="text-primary-400 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
                                {school_profile?.singkatan || 'SIDADU'}
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                            {school_profile?.nama_sekolah || 'Sistem Informasi Data Administrasi Terpadu'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 xl:p-24 relative">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
                            <ApplicationLogo className="h-24 w-auto mx-auto" />
                        </Link>
                        {school_profile?.nama_sekolah && (
                            <h3 className="mt-4 text-gray-500 font-medium tracking-wide text-sm uppercase">
                                {school_profile.nama_sekolah}
                            </h3>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl">
                        {children}
                    </div>

                    <footer className="pt-8 mt-8 border-t border-gray-100 text-center text-xs text-gray-400 space-y-2">
                        <p>&copy; {new Date().getFullYear()} SIDADU System v1.0</p>
                        <p className="flex items-center justify-center gap-1">
                            Developed with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> by Fanzhy
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
