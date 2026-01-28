import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Send, Plus, Search, FileText, Download, Filter, PenTool, CheckCircle, Upload, X, Printer } from 'lucide-react'; // Added Upload, X which were missing in imports too based on usage below
import { useState } from 'react';

export default function SuratKeluarIndex({ auth, surats }) {
    const [search, setSearch] = useState('');
    const [uploadData, setUploadData] = useState({ isOpen: false, id: null });

    const { data, setData, post, processing, errors, reset } = useForm({
        file_scan: null
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Surat Keluar</h2>
                        <p className="text-gray-500 text-sm">Kelola arsip surat keluar dan penomoran</p>
                    </div>
                    <Link
                        href={route('surat-keluar.create')}
                        className="bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-secondary/30"
                    >
                        <Plus size={18} />
                        Buat Surat Baru
                    </Link>
                </div>
            }
        >
            <Head title="Surat Keluar" />

            <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari surat..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-secondary/20 text-gray-700"
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
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">No. Surat</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tujuan & Perihal</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Klasifikasi</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tgl Dibuat</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {surats.data.length > 0 ? (
                                surats.data.map((surat) => (
                                    <tr key={surat.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-4 font-mono text-sm text-gray-600">
                                            {surat.no_surat}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 text-sm">{surat.tujuan}</span>
                                                <span className="text-xs text-gray-500 truncate max-w-xs">{surat.perihal}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                                                {surat.klasifikasi?.kode}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-xs text-gray-500">
                                            {new Date(surat.created_at).toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-4 text-xs text-gray-500 font-mono">
                                            {new Date(surat.created_at).toLocaleString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })} WIB
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${surat.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                surat.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {surat.status === 'approved' ? 'Disetujui' :
                                                    surat.status === 'draft' ? 'Draft' : surat.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {auth.user.permissions.includes('surat.approve') && surat.status === 'draft' && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Setujui surat ini? Token TTE akan dibuat.')) {
                                                                router.post(route('surat-keluar.approve', surat.id));
                                                            }
                                                        }}
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Setujui (Approve)"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}

                                                {(surat.status === 'approved' || surat.status === 'draft') && (
                                                    <a
                                                        href={route('surat-keluar.pdf', surat.id)}
                                                        target="_blank"
                                                        className={`p-2 rounded-lg transition-colors ${surat.status === 'approved' ? 'text-gray-400 hover:text-secondary hover:bg-secondary/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                        title={surat.file_scan ? "Lihat Scan" : (surat.status === 'approved' ? "Cetak PDF" : "Preview Draft")}
                                                    >
                                                        <Printer size={18} />
                                                    </a>
                                                )}

                                                {/* Upload Scan Button for Manual & Approved */}
                                                {surat.opsi_tanda_tangan === 'manual' && surat.status === 'approved' && (
                                                    <button
                                                        onClick={() => setUploadData({ isOpen: true, id: surat.id })}
                                                        className={`p-2 rounded-lg transition-colors ${surat.file_scan ? 'text-green-600 hover:bg-green-50' : 'text-blue-600 hover:bg-blue-50'}`}
                                                        title="Upload Scan Surat"
                                                    >
                                                        <Upload size={18} />
                                                    </button>
                                                )}

                                                {surat.status === 'draft' && (
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                        <PenTool size={18} />
                                                    </button>
                                                )}

                                                {/* Delete Button - Admin Only */}
                                                {auth.user.permissions.includes('surat.delete') && (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan.')) {
                                                                router.delete(route('surat-keluar.destroy', surat.id));
                                                            }
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Send size={48} className="mb-2 opacity-20" />
                                            <p>Belum ada surat keluar</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {uploadData.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Upload Scan Surat</h3>
                            <button onClick={() => setUploadData({ isOpen: false, id: null })} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            post(route('surat-keluar.upload', uploadData.id), {
                                onSuccess: () => {
                                    setUploadData({ isOpen: false, id: null });
                                    reset();
                                    alert('File berhasil diupload!');
                                }
                            });
                        }}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Scan (PDF/JPG) <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={e => setData('file_scan', e.target.files[0])}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Max. 10MB</p>
                                </div>
                                {errors.file_scan && <div className="text-red-500 text-xs mt-1">{errors.file_scan}</div>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setUploadData({ isOpen: false, id: null })}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {processing ? 'Mengupload...' : <><Upload size={16} /> Upload File</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
