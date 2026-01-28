import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Plus, Filter, AlertCircle, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function PelanggaranIndex({ auth, pelanggarans }) {
    const [search, setSearch] = useState('');

    const getTypeColor = (type) => {
        switch (type) {
            case 'Ringan': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Sedang': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'Berat': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Sangat Berat': return 'bg-red-600 text-white dark:bg-red-600 dark:text-white';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Pelanggaran Siswa</h2>
                        <p className="text-gray-500 text-sm">Daftar kasus dan pelanggaran tata tertib</p>
                    </div>
                    <Link
                        href={route('bk.pelanggaran.create')}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-red-600/30"
                    >
                        <Plus size={18} />
                        Catat Pelanggaran
                    </Link>
                </div>
            }
        >
            <Head title="Pelanggaran Siswa" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50">
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari siswa..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-red-500/20 text-gray-700 dark:text-gray-200"
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
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pelanggaran</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Poin</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {pelanggarans.data.length > 0 ? (
                                pelanggarans.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {item.tanggal_kejadian}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{item.siswa?.nama_lengkap}</p>
                                                <p className="text-xs text-gray-500">{item.siswa?.kelas?.nama}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="max-w-xs">
                                                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{item.jenis_pelanggaran?.nama_pelanggaran}</p>
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${getTypeColor(item.jenis_pelanggaran?.kategori)}`}>
                                                    {item.jenis_pelanggaran?.kategori}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-bold text-red-500">+{item.poin_saat_ini}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === 'Selesai'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle size={48} className="mb-2 opacity-20" />
                                            <p>Belum ada data pelanggaran</p>
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
