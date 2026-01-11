import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Filter, Download, User, Edit, Trash2, MapPin, Phone, Upload, X, LayoutGrid, List } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState, useEffect } from 'react';

export default function Index({ auth, gtks }) {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState(localStorage.getItem('gtkViewMode') || 'grid'); // 'grid' | 'list'
    const [isImportOpen, setIsImportOpen] = useState(false);
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, reset: resetImport, errors: importErrors } = useForm({
        file: null
    });

    useEffect(() => {
        localStorage.setItem('gtkViewMode', viewMode);
    }, [viewMode]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('gtk.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Manajemen GTK</h2>
                        <p className="text-gray-500 text-sm">Kelola data Guru dan Tenaga Kependidikan</p>
                    </div>
                    <Link
                        href={route('gtk.create')}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Tambah GTK
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen GTK" />

            <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
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

                    <div className="flex gap-2">
                        {/* View Toggle */}
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center mr-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Tampilan Grid"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Tampilan List"
                            >
                                <List size={18} />
                            </button>
                        </div>

                        <select
                            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-600 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            defaultValue={10}
                            onChange={(e) => {
                                router.get(route('gtk.index'), { per_page: e.target.value, search: search }, { preserveScroll: true, preserveState: true });
                            }}
                        >
                            {[10, 30, 50, 100, 200].map(n => <option key={n} value={n}>{n} Data</option>)}
                        </select>
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 rounded-xl text-green-700 text-sm font-medium transition-colors"
                        >
                            <Upload size={18} />
                            Import Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 text-sm font-medium transition-colors">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Content View */}
                {viewMode === 'grid' ? (
                    /* GRID VIEW */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gtks.data.length > 0 ? (
                            gtks.data.map((gtk) => (
                                <div key={gtk.id} className="bg-white border boundary-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col items-center text-center relative group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={route('gtk.edit', gtk.id)} className="p-2 text-gray-400 hover:text-secondary bg-white shadow-sm rounded-lg hover:shadow-md transition-all">
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(gtk.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-sm">
                                        {gtk.foto ? (
                                            <img src={`/storage/${gtk.foto}`} alt={gtk.nama} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={40} />
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-gray-800 text-lg">{gtk.nama}</h3>
                                    <p className="text-sm text-primary font-medium mb-1">{gtk.jabatan}</p>
                                    <p className="text-xs text-gray-500 mb-4">{gtk.nip || '-'}</p>

                                    <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm text-gray-600">
                                        <div className="flex items-center justify-center gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span>{gtk.alamat || '-'}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Phone size={14} className="text-gray-400" />
                                            <span>{gtk.no_hp || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
                                <div className="flex flex-col items-center justify-center">
                                    <User size={48} className="mb-2 opacity-20" />
                                    <p>Belum ada data GTK</p>
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
                                    <th className="px-6 py-4 rounded-tl-xl">Nama GTK</th>
                                    <th className="px-6 py-4">NIP / Jabatan</th>
                                    <th className="px-6 py-4">Kontak</th>
                                    <th className="px-6 py-4 text-center rounded-tr-xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gtks.data.length > 0 ? (
                                    gtks.data.map((gtk) => (
                                        <tr key={gtk.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                                                        {gtk.foto ? (
                                                            <img src={`/storage/${gtk.foto}`} alt={gtk.nama} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <User size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{gtk.nama}</div>
                                                        <div className="text-xs text-gray-500">{gtk.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-700">{gtk.jabatan}</div>
                                                <div className="text-xs text-gray-500">{gtk.nip || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <Phone size={12} className="text-gray-400" /> {gtk.no_hp || '-'}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} className="text-gray-400" /> {gtk.alamat || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link href={route('gtk.edit', gtk.id)} className="p-2 text-gray-400 hover:text-secondary bg-gray-50 hover:bg-white border border-gray-100 rounded-lg transition-all">
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(gtk.id)}
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
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                            Belum ada data GTK
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                    <Pagination links={gtks.links} />
                </div>
            </div>

            {/* Import Modal */}
            {isImportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Import Data GTK</h3>
                            <button onClick={() => setIsImportOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            postImport(route('gtk.import'), {
                                onSuccess: () => {
                                    setIsImportOpen(false);
                                    resetImport();
                                }
                            });
                        }}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Excel (.xlsx, .xls) <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        onChange={e => setImportData('file', e.target.files[0])}
                                        accept=".xlsx,.xls,.csv"
                                    />
                                    <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                                        <p>Pastikan format sesuai template.</p>
                                        <a
                                            href={route('gtk.template')}
                                            className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download size={12} />
                                            Download Template
                                        </a>
                                    </div>
                                </div>
                                {importErrors.file && <div className="text-red-500 text-xs mt-1">{importErrors.file}</div>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsImportOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={importProcessing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    {importProcessing ? 'Mengimport...' : <><Upload size={16} /> Import Sekarang</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
