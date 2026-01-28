import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Plus, Trophy, Award, Star, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function PrestasiIndex({ auth, prestasis }) {
    const [search, setSearch] = useState('');

    const getTingkatColor = (tingkat) => {
        switch (tingkat) {
            case 'Sekolah': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Kecamatan': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
            case 'Kota/Kabupaten': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
            case 'Provinsi': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Nasional': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Internasional': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-bold';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200 uppercase tracking-tight">Prestasi Siswa</h2>
                        <p className="text-gray-500 text-sm">Apresiasi pencapaian dan bakat siswa</p>
                    </div>
                    <Link
                        href={route('bk.prestasi.create')}
                        className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Catat Prestasi
                    </Link>
                </div>
            }
        >
            <Head title="Prestasi Siswa" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari siswa..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                                <th className="pb-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Siswa</th>
                                <th className="pb-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Pencapaian</th>
                                <th className="pb-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tingkat</th>
                                <th className="pb-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Apresiasi</th>
                                <th className="pb-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Bukti</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {prestasis.data.length > 0 ? (
                                prestasis.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all">
                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {item.tanggal}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {item.siswa?.nama_lengkap?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight">{item.siswa?.nama_lengkap}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.siswa?.kelas?.nama}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="max-w-xs flex items-center gap-2">
                                                <Trophy size={14} className="text-amber-500 shrink-0" />
                                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{item.nama_prestasi}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${getTingkatColor(item.tingkat)}`}>
                                                <Award size={10} />
                                                {item.tingkat}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="fill-emerald-500 text-emerald-500" />
                                                <span className="font-black text-emerald-600 text-sm">+{item.poin_apresiasi}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {item.bukti_file ? (
                                                <a
                                                    href={`/storage/${item.bukti_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-block"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-300 italic">Tidak ada</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Award size={64} className="mb-4 opacity-10 animate-pulse text-primary" />
                                            <p className="text-lg font-bold text-gray-300">Belum ada data prestasi</p>
                                            <p className="text-sm mt-1">Rayakan pencapaian pertama hari ini!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
