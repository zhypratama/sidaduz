import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Search, UserCheck, Key, Shield, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

export default function Akun({ auth, gtks }) {
    const [search, setSearch] = useState('');

    const generateAccount = (id) => {
        if (confirm('Akun akan dibuat otomatis dengan username = NIP/Nama dan password default "12345678". Lanjutkan?')) {
            router.post(route('gtk.akun.store', id));
        }
    };

    const resetAccount = (id) => {
        if (confirm('PERINGATAN: Akun pengguna akan DIHAPUS dan DIBUAT ULANG. Password akan kembali menjadi default "12345678". Lanjutkan?')) {
            router.post(route('gtk.akun.recreate', id));
        }
    };

    const resetPassword = (id) => {
        if (confirm('Password pengguna akan direset menjadi "12345678". Lanjutkan?')) {
            router.post(route('gtk.akun.reset-password', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Akun GTK</h2>
                        <p className="text-gray-500 text-sm">Kelola akses login Guru dan Staff</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (confirm('BAHAYA: Semua akun GTK akan DIHAPUS dan DIBUAT ULANG. Semua password akan direset ke "12345678". Lanjutkan?')) {
                                    router.post(route('gtk.akun.reset-all'));
                                }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Shield size={18} />
                            Reset Semua Akun
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Sistem akan membuatkan akun untuk SEMUA GTK yang belum punya akun. Password default: 12345678. Lanjutkan?')) {
                                    router.post(route('gtk.akun.generate-all'));
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
            <Head title="Manajemen Akun GTK" />

            <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-blue-500 mt-0.5" size={20} />
                    <div className="text-sm text-blue-700">
                        <p className="font-bold">Informasi Pembuatan Akun</p>
                        <p>Akun yang digenerate otomatis akan memiliki password default: <span className="font-mono bg-blue-100 px-1 rounded">12345678</span>. Harap himbau pengguna untuk segera mengganti password setelah login.</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIP..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-600 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer w-full md:w-auto"
                        defaultValue={10}
                        onChange={(e) => {
                            router.get(route('gtk.akun.index'), { per_page: e.target.value, search: search }, { preserveScroll: true, preserveState: true });
                        }}
                    >
                        {[10, 30, 50, 100, 200].map(n => <option key={n} value={n}>{n} Data</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100">
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama GTK</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Jabatan</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status Akun</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Username</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {gtks.data.map((gtk) => (
                                <tr key={gtk.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-gray-800">{gtk.nama}</td>
                                    <td className="py-4 px-4 text-sm text-gray-600">{gtk.jabatan}</td>
                                    <td className="py-4 px-4">
                                        {gtk.user_id ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-100 px-2.5 py-1 rounded-full w-fit">
                                                <CheckCircle size={14} /> Aktif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full w-fit">
                                                Belum Ada
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-mono text-gray-600">
                                        {gtk.user ? gtk.user.email : '-'}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {gtk.user_id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => resetAccount(gtk.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                                                    title="Hapus & Buat Ulang Akun"
                                                >
                                                    <RefreshCcw size={14} />
                                                </button>
                                                <button
                                                    onClick={() => resetPassword(gtk.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
                                                >
                                                    <Key size={14} /> Reset Password
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => generateAccount(gtk.id)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors"
                                            >
                                                <UserCheck size={14} /> Buat Akun
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination links={gtks.links} />
            </div>
        </AuthenticatedLayout>
    );
}
