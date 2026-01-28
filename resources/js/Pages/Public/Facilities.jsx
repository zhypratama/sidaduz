import { Head, Link } from '@inertiajs/react';
import { Box, MapPin, ArrowLeft } from 'lucide-react';

export default function Facilities({ facilities }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Fasilitas Sekolah" />

            {/* Navbar Simple */}
            <div className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <Box className="text-primary w-6 h-6" />
                            </div>
                            <span className="font-bold text-xl text-gray-900">Sarana & Prasarana</span>
                        </div>
                        <Link href="/" className="text-gray-500 hover:text-primary flex items-center gap-2 font-medium transition-colors">
                            <ArrowLeft size={18} />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Fasilitas Sekolah Kami</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                        Menunjang kegiatan belajar mengajar dengan sarana dan prasarana yang lengkap dan modern.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {facilities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilities.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="h-64 overflow-hidden relative">
                                    {item.foto ? (
                                        <img
                                            src={`/storage/${item.foto}`}
                                            alt={item.nama_barang}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <Box size={48} className="text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                                        {item.kategori}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                        {item.nama_barang}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                                        {item.deskripsi || 'Tidak ada deskripsi.'}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{item.lokasi}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <Box size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada fasilitas yang ditampilkan</h3>
                        <p className="text-gray-500">Silakan kembali lagi nanti.</p>
                    </div>
                )}
            </main>

            {/* Footer Simple */}
            <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} SIDADU System. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
