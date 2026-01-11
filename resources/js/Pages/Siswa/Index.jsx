import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Trash2, Edit, AlertCircle, Eye, FileSpreadsheet } from 'lucide-react';
import ContentBox from '@/Components/ContentBox';
import FormInput from '@/Components/FormInput';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, students, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            route('siswa.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data siswa akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('siswa.destroy', id), {
                    onSuccess: () => {
                        Swal.fire(
                            'Terhapus!',
                            'Data siswa telah dihapus.',
                            'success'
                        )
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manajemen Siswa</h2>}
        >
            <Head title="Manajemen Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <ContentBox className="p-2 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 shadow-sm w-full md:w-96">
                                <Search className="text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari Siswa (Nama/NIS)..."
                                    value={search}
                                    onChange={handleSearch}
                                    className="border-none focus:ring-0 w-full text-sm bg-transparent dark:text-gray-200 placeholder-gray-400"
                                />
                            </ContentBox>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="bg-success text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-md shadow-success/20"
                            >
                                <FileSpreadsheet size={18} />
                                <span className="hidden sm:inline">Import/Export</span>
                            </Link>
                            <Link
                                href={route('siswa.create')}
                                className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-600 transition-colors shadow-md shadow-primary/30"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Tambah Siswa</span>
                            </Link>
                        </div>
                    </div>

                    {/* Table Content */}
                    <ContentBox className="overflow-hidden bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 rounded-tl-2xl">No</th>
                                        <th scope="col" className="px-6 py-4">NIS / NISN</th>
                                        <th scope="col" className="px-6 py-4">Nama Lengkap</th>
                                        <th scope="col" className="px-6 py-4">L/P</th>
                                        <th scope="col" className="px-6 py-4">Kelas</th>
                                        <th scope="col" className="px-6 py-4">Status</th>
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
                                                        <span className="font-bold text-gray-700 dark:text-gray-300">{student.nis || '-'}</span>
                                                        <span className="text-xs text-gray-500">{student.nisn || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">
                                                    {student.nama_lengkap}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.jenis_kelamin === 'L' ?
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Laki-laki</span>
                                                        :
                                                        <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">Perempuan</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.kelas_temp || <span className="italic text-gray-400">Belum set</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {student.status === 'aktif' && <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Aktif</span>}
                                                    {student.status === 'lulus' && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Lulus</span>}
                                                    {student.status === 'mutasi_keluar' && <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Mutasi</span>}
                                                    {student.status === 'dikeluarkan' && <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">DO</span>}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={route('siswa.edit', student.id)}
                                                            className="p-2 bg-warning/10 text-warning rounded-lg hover:bg-warning hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(student.id)}
                                                            className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-100 p-4 rounded-full mb-3 dark:bg-gray-700">
                                                        <Users size={40} className="text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Belum ada data siswa</h3>
                                                    <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4 max-w-sm">Data siswa akan muncul di sini setelah Anda menambahkannya.</p>
                                                    <Link
                                                        href={route('siswa.create')}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        Tambah Siswa Baru
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{students.from || 0}</span> sampai <span className="font-semibold text-gray-900 dark:text-white">{students.to || 0}</span> dari <span className="font-semibold text-gray-900 dark:text-white">{students.total}</span> data
                            </span>
                            <div className="flex gap-1">
                                {students.links.map((link, k) => (
                                    <Link
                                        key={k}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${link.active
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </ContentBox>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
