import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Search, Calendar, BookOpen, Clock, User, Eye, FileText } from 'lucide-react';
import Pagination from '@/Components/Pagination'; // Assuming you have this
import { useState } from 'react';

export default function Index({ auth, jurnals }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        // Implement debounced search here if needed
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Jurnal Guru</h2>
                        <p className="text-gray-500 text-sm">Catatan aktivitas mengajar dan absensi siswa</p>
                    </div>
                    <Link
                        href={route('kurikulum.jurnal.create')}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Isi Jurnal
                    </Link>
                </div>
            }
        >
            <Head title="Jurnal Guru" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50 mb-8">
                {/* Search & Filter */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6 justify-between items-center">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari Materi / Guru..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 transition-all"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    {jurnals.data.length > 0 ? (
                        jurnals.data.map((jurnal) => (
                            <div key={jurnal.id} className="border border-gray-100 rounded-2xl p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <Calendar size={12} />
                                            {jurnal.tanggal}
                                        </span>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <Clock size={12} />
                                            Jam Ke-{jurnal.jam_ke}
                                        </span>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${jurnal.status_guru === 'Hadir' ? 'bg-green-100 text-green-700' :
                                                jurnal.status_guru === 'Izin' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {jurnal.status_guru}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-800">{jurnal.materi}</h3>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <BookOpen size={16} className="text-gray-400" />
                                            {jurnal.pembelajaran?.mata_pelajaran?.nama_mapel || 'Mapel Dihapus'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={16} className="text-gray-400" />
                                            {jurnal.pembelajaran?.kelas?.nama_kelas || 'Kelas Dihapus'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={16} className="text-gray-400" />
                                            {jurnal.pembelajaran?.guru?.nama_lengkap || 'Guru Dihapus'}
                                        </div>
                                    </div>

                                    {jurnal.catatan && (
                                        <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3 mt-2">
                                            "{jurnal.catatan}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* <Link
                                        href={route('kurikulum.jurnal.show', jurnal.id)}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                        title="Lihat Detail"
                                    >
                                        <Eye size={18} />
                                    </Link> */}
                                    {/* Add Edit/Delete if needed */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">Belum ada jurnal</h3>
                            <p className="text-gray-500">Mulai dengan mencatat aktivitas mengajar Anda.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <Pagination links={jurnals.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
