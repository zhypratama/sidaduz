import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Mail, Plus, Search, FileText, Download, Filter, X, Eye } from 'lucide-react';
import { useState } from 'react';

export default function SuratMasukIndex({ auth, surats }) {
    const [search, setSearch] = useState('');
    const [previewFile, setPreviewFile] = useState(null); // State for modal

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Surat Masuk</h2>
                        <p className="text-gray-500 text-sm">Kelola arsip surat masuk sekolah</p>
                    </div>
                    <Link
                        href={route('surat-masuk.create')}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Catat Surat Masuk
                    </Link>
                </div>
            }
        >
            <Head title="Surat Masuk" />

            <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari surat..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 text-sm font-medium transition-colors">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 text-sm font-medium transition-colors">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100">
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">No. Surat / Pengirim</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Perihal</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Disposisi</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {surats.data.length > 0 ? (
                                surats.data.map((surat) => (
                                    <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">{surat.no_surat_pengirim}</p>
                                                    <p className="text-xs text-gray-500">{surat.pengirim}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-700 text-sm font-medium truncate max-w-xs">{surat.perihal}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Diterima: {surat.tanggal_diterima}</span>
                                                <span className="text-xs text-gray-400">Surat: {surat.tanggal_surat}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                                Menunggu
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {surat.file_scan && (
                                                    <button
                                                        onClick={() => setPreviewFile(`/storage/${surat.file_scan}`)}
                                                        className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                                                        title="Smart Preview"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Detail">
                                                    <Mail size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={48} className="mb-2 opacity-20" />
                                            <p>Belum ada surat masuk</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Placeholder) */}
                <div className="mt-6">
                </div>
            </div>

            {/* Smart Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setPreviewFile(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <FileText className="text-primary" size={20} />
                                Smart Preview
                            </h3>
                            <div className="flex gap-2">
                                <a
                                    href={previewFile}
                                    download
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                    title="Download File"
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 overflow-hidden flex justify-center">
                            {previewFile.endsWith('.pdf') ? (
                                <iframe src={previewFile} className="w-full h-full rounded-xl border border-gray-200" />
                            ) : (
                                <img src={previewFile} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-sm" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
