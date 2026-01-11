import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import ContentBox from '@/Components/ContentBox';
import { Search, UserCheck, KeyRound, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Akun({ auth, students }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            route('siswa.akun.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleCreateAccount = (id, name) => {
        Swal.fire({
            title: 'Buat Akun Siswa?',
            text: `Akun akan dibuat untuk ${name} dengan password default (NISN/12345678).`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Buat Akun',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('siswa.akun.store', id), {}, {
                    onSuccess: () => Swal.fire('Berhasil!', 'Akun siswa telah dibuat.', 'success')
                });
            }
        });
    };

    const handleResetPassword = (id, name) => {
        Swal.fire({
            title: 'Reset Password?',
            text: `Password untuk ${name} akan direset ke default (NISN/12345678).`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Reset',
            confirmButtonColor: '#d33',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('siswa.akun.reset', id), {}, {
                    onSuccess: () => Swal.fire('Berhasil!', 'Password telah direset.', 'success')
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manajemen Akun Siswa</h2>}
        >
            <Head title="Akun Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <ContentBox className="p-2 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 shadow-sm w-full md:w-96">
                                <Search className="text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari Siswa..."
                                    value={search}
                                    onChange={handleSearch}
                                    className="border-none focus:ring-0 w-full text-sm bg-transparent dark:text-gray-200 placeholder-gray-400"
                                />
                            </ContentBox>
                        </div>
                    </div>

                    {/* Table Content */}
                    <ContentBox className="overflow-hidden bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 rounded-tl-2xl">No</th>
                                        <th scope="col" className="px-6 py-4">Data Siswa</th>
                                        <th scope="col" className="px-6 py-4">Status Akun</th>
                                        <th scope="col" className="px-6 py-4">Email Login</th>
                                        <th scope="col" className="px-6 py-4 rounded-tr-2xl text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.data.length > 0 ? (
                                        students.data.map((student, index) => (
                                            <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                                    {(students.current_page - 1) * students.per_page + index + 1}
                                                </th>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800 dark:text-gray-200">{student.nama_lengkap}</span>
                                                        <span className="text-xs text-gray-500">{student.nis} / {student.nisn}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.user_id ? (
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1 w-fit">
                                                            <UserCheck size={14} /> Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1 w-fit">
                                                            <ShieldAlert size={14} /> Belum Ada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {student.user ? student.user.email : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        {!student.user_id ? (
                                                            <button
                                                                onClick={() => handleCreateAccount(student.id, student.nama_lengkap)}
                                                                className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-1 shadow-sm"
                                                            >
                                                                <UserCheck size={14} /> Buat Akun
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleResetPassword(student.id, student.nama_lengkap)}
                                                                className="px-3 py-1.5 bg-warning/10 text-warning text-xs rounded-lg hover:bg-warning hover:text-white transition-colors flex items-center gap-1 shadow-sm border border-warning/20"
                                                            >
                                                                <KeyRound size={14} /> Reset Pass
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-24 text-center text-gray-500 dark:text-gray-400">
                                                Belum ada data siswa.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ContentBox>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
