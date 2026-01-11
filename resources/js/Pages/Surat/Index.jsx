import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Mail, Send, Archive, Settings, ArrowRight } from 'lucide-react';

export default function SuratIndex({ auth, stats, recent_masuk, recent_keluar }) {
    const MenuCard = ({ title, icon: Icon, description, route, color, count }) => (
        <Link
            href={route}
            className="bg-white p-6 rounded-[30px] shadow-sm shadow-gray-200/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 p-3 ${color} opacity-10 rounded-bl-[30px] w-24 h-24 -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>

                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-700">{count !== undefined ? count : ''}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-bold text-2xl text-gray-800">Pengelolaan Surat</h2>
                    <p className="text-gray-500 text-sm">Pusat kontrol persuratan digital sekolah</p>
                </div>
            }
        >
            <Head title="Pengelolaan Surat" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MenuCard
                    title="Surat Masuk"
                    icon={Mail}
                    description="Kelola surat yang diterima dari instansi luar."
                    route={route('surat-masuk.index')}
                    color="bg-primary"
                    count={stats.total_masuk}
                />
                <MenuCard
                    title="Surat Keluar"
                    icon={Send}
                    description="Buat dan kelola surat keluar sekolah."
                    route={route('surat-keluar.index')}
                    color="bg-secondary"
                    count={stats.total_keluar}
                />
                <MenuCard
                    title="Arsip Digital"
                    icon={Archive}
                    description="Penyimpanan arsip surat lama."
                    route={route('surat-arsip.index')}
                    color="bg-warning"
                />
                <MenuCard
                    title="Pengaturan"
                    icon={Settings}
                    description="Format nomor, kop surat, dan klasifikasi."
                    route={route('surat-pengaturan.index')}
                    color="bg-dark"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Masuk */}
                <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Surat Masuk Terbaru</h3>
                        <Link href={route('surat-masuk.index')} className="text-xs text-primary font-medium hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="space-y-4">
                        {recent_masuk.length > 0 ? recent_masuk.map(surat => (
                            <div key={surat.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                                <div className="p-2 bg-primary/10 text-primary rounded-xl mt-1">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">{surat.pengirim}</h4>
                                    <p className="text-xs text-gray-500 mb-1">{surat.perihal}</p>
                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{surat.tanggal_diterima}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 text-sm py-4">Belum ada data</p>
                        )}
                    </div>
                </div>

                {/* Recent Keluar */}
                <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Surat Keluar Terbaru</h3>
                        <Link href={route('surat-keluar.index')} className="text-xs text-primary font-medium hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="space-y-4">
                        {recent_keluar.length > 0 ? recent_keluar.map(surat => (
                            <div key={surat.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                                <div className="p-2 bg-secondary/10 text-secondary rounded-xl mt-1">
                                    <Send size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm">{surat.tujuan}</h4>
                                    <p className="text-xs text-gray-500 mb-1">{surat.perihal}</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{surat.no_surat}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${surat.status === 'terkirim' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>{surat.status}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 text-sm py-4">Belum ada data</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
