import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Search, UserCheck, Key, Shield, AlertCircle, CheckCircle, RefreshCcw, User } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

export default function Akun({ auth, students }) {
    const [search, setSearch] = useState('');

    const generateAccount = (id) => {
        if (confirm('Akun akan dibuat otomatis dengan username = NIPD/Email dan password default "12345678". Lanjutkan?')) {
            router.post(route('siswa.akun.store', id));
        }
    };

    const resetPassword = (id) => {
        if (confirm('Password pengguna akan direset menjadi default (NISN atau 12345678). Lanjutkan?')) {
            router.post(route('siswa.akun.reset-password', id));
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const executeSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'change') {
            router.get(route('siswa.akun.index'), { search: search }, { preserveState: true, replace: true, preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Akun Siswa</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola akses login Siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (confirm('BAHAYA: Semua akun Siswa akan DIHAPUS dan DIBUAT ULANG. Lanjutkan?')) {
                                    router.post(route('siswa.akun.reset-all'));
                                }
                            }}
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Shield size={18} />
                            Reset Semua Akun
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Sistem akan membuatkan akun untuk SEMUA siswa yang belum punya akun. Lanjutkan?')) {
                                    router.post(route('siswa.akun.generate-all'));
                                }
                            }}
                            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                        >
                            <UserCheck size={18} />
                            Generate Semua Akun
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Akun Siswa" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50">
                {/* Info Alert */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-blue-500 mt-0.5" size={20} />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-bold">Informasi Pembuatan Akun</p>
                        <p>Akun yang digenerate otomatis akan memiliki password default: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">NISN</span> atau <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">12345678</span>. Login menggunakan Email atau NISN.</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIPD..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                            value={search}
                            onChange={handleSearch}
                            onKeyDown={executeSearch}
                        />
                    </div>

                    <select
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-gray-600 dark:text-gray-300 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer w-full md:w-auto"
                        defaultValue={10}
                        onChange={(e) => {
                            router.get(route('siswa.akun.index'), { per_page: e.target.value, search: search }, { preserveScroll: true, preserveState: true });
                        }}
                    >
                        {[10, 30, 50, 100, 200].map(n => <option key={n} value={n}>{n} Data</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Siswa</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kelas</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status Akun</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Username/Email</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {students.data.length > 0 ? students.data.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {student.nama_lengkap.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800 dark:text-gray-200">{student.nama_lengkap}</div>
                                                {student.nipd ? <span className="text-blue-600 dark:text-blue-400 mr-1">{student.nipd}</span> : <span className="text-gray-400 mr-1">-</span>}
                                                / {student.nisn}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">
                                            {student.kelas_temp || 'Belum Set'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {student.user_id ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full w-fit">
                                                <CheckCircle size={14} /> Aktif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full w-fit">
                                                Belum Ada
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                                        {student.user ? student.user.email : '-'}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {student.user_id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => resetPassword(student.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800 transition-colors"
                                                >
                                                    <Key size={14} /> Reset Pass
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => generateAccount(student.id)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors"
                                            >
                                                <UserCheck size={14} /> Buat Akun
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Belum ada data siswa.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination links={students.links} />
            </div>
        </AuthenticatedLayout>
    );
}
