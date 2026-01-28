import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Plus, Filter, Users, AlertCircle, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function KonselingIndex({ auth, konselings }) {
    const [search, setSearch] = useState('');

    const getServiceColor = (type) => {
        switch (type) {
            case 'Individu': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Kelompok': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'Karir': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Jurnal Konseling</h2>
                        <p className="text-gray-500 text-sm">Rekam jejak bimbingan dan layanan konseling</p>
                    </div>
                    <Link
                        href={route('bk.konseling.create')}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Catat Sesi
                    </Link>
                </div>
            }
        >
            <Head title="Jurnal Konseling" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50">
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
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Siswa</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Layanan</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Masalah</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Konselor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {konselings.data.length > 0 ? (
                                konselings.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(item.tanggal_konseling).toLocaleDateString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{item.siswa?.nama_lengkap}</p>
                                                <p className="text-xs text-gray-500">{item.siswa?.kelas?.nama}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getServiceColor(item.jenis_layanan)}`}>
                                                {item.jenis_layanan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{item.masalah}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.guru_bk?.name}</p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle size={48} className="mb-2 opacity-20" />
                                            <p>Belum ada riwayat konseling</p>
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
