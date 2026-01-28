import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, Printer, UserX } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

export default function Index({ auth, students, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            route('mutasi.index'),
            { search: value, status },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusFilter = (e) => {
        const value = e.target.value;
        setStatus(value);
        router.get(
            route('mutasi.index'),
            { search, status: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Mutasi & Alumni</h2>
                        <p className="text-gray-500 text-sm">Data siswa mutasi, lulus, atau keluar</p>
                    </div>
                </div>
            }
        >
            <Head title="Mutasi & Alumni" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari Siswa..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700"
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-600 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                value={status}
                                onChange={handleStatusFilter}
                            >
                                <option value="all">Semua Status</option>
                                <option value="mutasi_keluar">Mutasi Keluar</option>
                                <option value="lulus">Lulus</option>
                                <option value="dikeluarkan">Dikeluarkan</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl text-center">No</th>
                                    <th className="px-6 py-4">Nama Siswa / NIPD</th>
                                    <th className="px-6 py-4">Kelas Terakhir</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center rounded-tr-xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length > 0 ? (
                                    students.data.map((student, index) => (
                                        <tr key={student.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-center font-medium">
                                                {(students.current_page - 1) * students.per_page + index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div>{student.nama_lengkap}</div>
                                                <div className="text-xs text-gray-500 font-mono">{student.nipd} / {student.nisn}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                                    {student.kelas_temp || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === 'mutasi_keluar' ? 'bg-yellow-100 text-yellow-700' :
                                                    student.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {student.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {student.status === 'mutasi_keluar' && (
                                                    <a
                                                        href={route('mutasi.print', student.id)}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors border border-indigo-200"
                                                    >
                                                        <Printer size={14} />
                                                        Cetak Surat
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserX size={40} className="mb-2 opacity-20" />
                                                <p>Tidak ada data mutasi/alumni.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center">
                        <Pagination links={students.links} />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
