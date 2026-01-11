import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>

            <footer className="mt-8 text-center text-xs text-gray-400 space-y-1">
                <p>&copy; {new Date().getFullYear()} SIDADU (Sistem Informasi Data Terpadu - Fz&T) v.1.0.0</p>
                <p className="flex items-center justify-center gap-1">
                    Laravel v12.46.0 made with <Heart size={12} className="text-red-500 fill-red-500" /> by Fanzhy.
                </p>
            </footer>
        </div>
    );
}
