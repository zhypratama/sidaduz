import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Filter, Download, User, Edit, Trash2, MapPin, Phone, Upload, X, GraduationCap, LayoutGrid, List } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState, useEffect } from 'react';

export default function Index({ auth, students, filters = {} }) {
    // Import State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, errors: importErrors, reset: resetImport } = useForm({
        file: null,
    });

    // -- MISSING STATES & FUNCTIONS FIX --
    const [viewMode, setViewMode] = useState('grid');
    const [search, setSearch] = useState(filters.search || '');

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('siswa.index'), { search: search }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSearch = (e) => setSearch(e.target.value);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data siswa ini?')) {
            router.delete(route('siswa.destroy', id), {
                preserveScroll: true
            });
        }
    };

    const handleDeleteAll = () => {
        if (confirm('PERINGATAN KERAS!\n\nApakah Anda yakin ingin MENGHAPUS SEMUA DATA SISWA?\nTindakan ini tidak dapat dibatalkan!')) {
            if (confirm('Sekali lagi, apakah Anda benar-benar yakin?')) {
                router.delete(route('siswa.destroy-all'), {
                    preserveScroll: true
                });
            }
        }
    };

    const submitImport = (e) => {
        e.preventDefault();
        postImport(route('siswa.import'), {
            onSuccess: () => {
                setIsImportModalOpen(false);
                resetImport();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Manajemen Siswa</h2>
                        <p className="text-gray-500 text-sm">Kelola data peserta didik</p>
                    </div>
                    <Link
                        href={route('siswa.create')}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Tambah Siswa
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Siswa" />

            <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50 mb-8">
                {/* Search & Orientation */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6 justify-between items-center">
                    <div className="relative w-full lg:w-96 order-2 lg:order-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari Siswa (Nama/NIPD)..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 transition-all"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-end w-full lg:w-auto order-1 lg:order-2">
                        {/* View Toggle */}
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Grid View"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                        </div>

                        <select
                            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-600 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-100 transition-colors"
                            defaultValue={10}
                            onChange={(e) => {
                                router.get(route('siswa.index'), { per_page: e.target.value, search: search }, { preserveScroll: true, preserveState: true });
                            }}
                        >
                            {[10, 30, 50, 100, 200].map(n => <option key={n} value={n}>{n} Item</option>)}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-end border-t border-gray-100 pt-6">
                    {/* Delete All Button */}
                    {students.data.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-sm font-medium transition-colors border border-red-100"
                        >
                            <Trash2 size={18} />
                            Hapus Semua
                        </button>
                    )}

                    {/* Template Button */}
                    <a href={route('siswa.template')} target="_blank" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors border border-blue-100">
                        <Download size={18} />
                        Download Template
                    </a>

                    {/* Import Button */}
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-medium transition-colors border border-green-100"
                    >
                        <Upload size={18} />
                        Import Excel
                    </button>
                </div>
            </div>

            {/* Content View */}
            {viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.data.length > 0 ? (
                        students.data.map((student) => (
                            <div key={student.id} className="bg-white border boundary-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col items-center text-center relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={route('siswa.edit', student.id)} className="p-2 text-gray-400 hover:text-secondary bg-white shadow-sm rounded-lg hover:shadow-md transition-all">
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="w-24 h-24 rounded-full bg-blue-50 mb-4 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
                                    {student.foto ? (
                                        <img src={`/storage/${student.foto}`} alt={student.nama_lengkap} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-blue-300">
                                            <GraduationCap size={40} />
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-bold text-gray-800 text-lg line-clamp-1" title={student.nama_lengkap}>
                                    {student.nama_lengkap}
                                </h3>
                                <p className="text-sm text-primary font-medium mb-1">
                                    {student.kelas ? student.kelas.nama : (student.kelas_temp ? `Kelas ${student.kelas_temp}` : 'Belum Ada Kelas')}
                                </p>
                                <p className="text-xs text-gray-500 mb-4 font-mono">{student.nipd} / {student.nisn}</p>

                                <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm text-gray-600">
                                    <div className="flex items-center justify-center gap-2">
                                        <User size={14} className="text-gray-400" />
                                        <span>{student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                            student.status === 'lulus' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {student.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
                            <div className="flex flex-col items-center justify-center">
                                <GraduationCap size={48} className="mb-2 opacity-20" />
                                <p>Belum ada data Siswa</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* LIST VIEW */
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-xl text-center">No</th>
                                <th className="px-6 py-4">Nama Siswa / NIPD</th>
                                <th className="px-6 py-4">Kelas</th>
                                <th className="px-6 py-4">Status & Gender</th>
                                <th className="px-6 py-4 text-center rounded-tr-xl">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.data.length > 0 ? (
                                students.data.map((student, index) => (
                                    <tr key={student.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-center font-medium">{(students.current_page - 1) * students.per_page + index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 overflow-hidden flex items-center justify-center text-blue-300">
                                                    {student.foto ? (
                                                        <img src={`/storage/${student.foto}`} alt={student.nama_lengkap} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <GraduationCap size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{student.nama_lengkap}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{student.nipd} / {student.nisn}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                                {student.kelas_temp || student.rombel || 'Belum Set'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${student.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                                    student.status === 'lulus' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {student.status.toUpperCase()}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    {student.jenis_kelamin === 'L' ? <span className="text-blue-600">Laki-laki</span> : <span className="text-pink-600">Perempuan</span>}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link href={route('siswa.edit', student.id)} className="p-2 text-gray-400 hover:text-secondary bg-gray-50 hover:bg-white border border-gray-100 rounded-lg transition-all">
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-white border border-gray-100 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        Belum ada data Siswa
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
                <Pagination links={students.links} />
            </div>

            {/* Import Modal */}
            {
                isImportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Import Data Siswa</h3>
                                    <p className="text-sm text-gray-500">Upload file Excel sesuai template.</p>
                                </div>
                                <button
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={submitImport} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">File Excel (.xlsx)</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer relative" onClick={() => document.getElementById('file-upload').click()}>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept=".xlsx, .xls"
                                            className="hidden"
                                            onChange={e => setImportData('file', e.target.files[0])}
                                        />
                                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        {importData.file ? (
                                            <p className="text-sm font-medium text-primary break-all">{importData.file.name}</p>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-gray-600">Klik untuk upload</p>
                                                <p className="text-xs text-gray-400">atau drag and drop</p>
                                            </>
                                        )}
                                    </div>
                                    {importErrors.file && <p className="text-sm text-red-600">{importErrors.file}</p>}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsImportModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!importData.file || importProcessing}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {importProcessing ? 'Mengupload...' : 'Import Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </AuthenticatedLayout >
    );
}
