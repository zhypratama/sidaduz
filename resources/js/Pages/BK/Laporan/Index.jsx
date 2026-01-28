import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, FileText, Filter, Printer, ChevronRight, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function LaporanIndex({ auth, students, kelas_list }) {
    const [search, setSearch] = useState('');
    const [kelasId, setKelasId] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('bk.laporan.index'), { search, kelas_id: kelasId }, { preserveState: true });
        }
    };

    const handleFilter = (val) => {
        setKelasId(val);
        router.get(route('bk.laporan.index'), { search, kelas_id: val }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Laporan Bimbingan Konseling</h2>
                        <p className="text-gray-500 text-sm">Rekapitulasi karakter dan poin siswa</p>
                    </div>
                </div>
            }
        >
            <Head title="Laporan BK" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama siswa..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-200"
                            value={kelasId}
                            onChange={(e) => handleFilter(e.target.value)}
                        >
                            <option value="">Semua Kelas</option>
                            {kelas_list.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Siswa</th>
                                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Kelas</th>
                                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Poin Pelanggaran</th>
                                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Poin Prestasi</th>
                                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Total Karakter</th>
                                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Opsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {students.data.map((student) => {
                                const totalPoin = (student.pelanggarans_sum_poin_saat_ini || 0) - (student.prestasis_sum_poin_apresiasi || 0);
                                return (
                                    <tr key={student.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all">
                                        <td className="py-5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-200">{student.nama_lengkap}</p>
                                                    <p className="text-xs text-gray-500">{student.nis}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {student.kelas?.nama}
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <span className="font-bold text-red-500">{student.pelanggarans_sum_poin_saat_ini || 0}</span>
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <span className="font-bold text-emerald-500">{student.prestasis_sum_poin_apresiasi || 0}</span>
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <span className={`font-black text-lg ${totalPoin > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {totalPoin}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <Link
                                                href={route('bk.laporan.show', student.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all group-hover:shadow-lg"
                                            >
                                                <FileText size={14} />
                                                Detail Raport Karakter
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8">
                    {/* Pagination logic here if needed, keeping it simple for now */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
