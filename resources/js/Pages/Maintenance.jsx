import { Head } from '@inertiajs/react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Maintenance({ message, end_time }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!end_time) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(end_time).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft('Selesai');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}h ${hours}j ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [end_time]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
            <Head title="Maintenance Mode" />

            <div className="animate-pulse mb-8">
                <AlertTriangle size={80} className="text-yellow-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Under Maintenance</h1>

            <p className="text-xl text-gray-400 text-center max-w-2xl mb-12">
                {message || 'Sistem sedang dalam perbaikan berkala untuk meningkatkan performa dan layanan. Mohon kembali lagi nanti.'}
            </p>

            {end_time && (
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center min-w-[300px]">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-semibold">Estimasi Selesai</p>
                    <div className="text-4xl font-mono font-bold text-yellow-400 flex items-center justify-center gap-3">
                        <Clock size={32} />
                        {timeLeft || 'Calculating...'}
                    </div>
                    <p className="text-xs text-gray-600 mt-4">
                        {new Date(end_time).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                </div>
            )}

            <div className="mt-12 text-sm text-gray-600">
                &copy; {new Date().getFullYear()} SIDADU System
            </div>
        </div>
    );
}
