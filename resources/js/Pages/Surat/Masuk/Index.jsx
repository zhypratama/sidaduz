import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Mail, Plus, Search, FileText, Download, Filter, X, Eye, Send, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';


// Standard Native Select if SelectInput doesn't exist or is complex
const NativeSelect = ({ className, ...props }) => (
    <select
        className={
            'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm ' +
            className
        }
        {...props}
    />
);

export default function SuratMasukIndex({ auth, surats, staffs }) {
    const [search, setSearch] = useState('');
    const [previewFile, setPreviewFile] = useState(null);

    // Disposisi State
    const [showDisposisiModal, setShowDisposisiModal] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        penerima_disposisi_id: '',
        instruksi: '',
        catatan: '',
        batas_waktu: ''
    });

    const openDisposisi = (surat) => {
        setSelectedSurat(surat);
        reset();
        setShowDisposisiModal(true);
    };

    const closeDisposisi = () => {
        setShowDisposisiModal(false);
        setSelectedSurat(null);
        reset();
    };

    const submitDisposisi = (e) => {
        e.preventDefault();
        post(route('surat-disposisi.store', selectedSurat.id), {
            onSuccess: () => {
                closeDisposisi();
            }
        });
    };

    const INSTRUCTIONS = [
        'Tindak Lanjuti',
        'Arsipkan',
        'Hadir Mewakili',
        'Balas Surat',
        'Pelajari & Berikan Pendapat',
        'Untuk Diketahui',
        'Edarkan'
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Surat Masuk</h2>
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

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari surat..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors">
                            <Filter size={18} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">No. Surat / Pengirim</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Perihal</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Disposisi</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {surats.data.length > 0 ? (
                                surats.data.map((surat) => (
                                    <tr key={surat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{surat.no_surat_pengirim}</p>
                                                    <p className="text-xs text-gray-500">{surat.pengirim}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium truncate max-w-xs">{surat.perihal}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Diterima: {surat.tanggal_diterima}</span>
                                                <span className="text-xs text-gray-400">Surat: {surat.tanggal_surat}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {surat.disposisi && surat.disposisi.length > 0 ? (
                                                <div className="flex -space-x-2">
                                                    {surat.disposisi.map((d, i) => (
                                                        <div key={d.id} className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300" title={d.penerima?.name}>
                                                            {d.penerima?.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {surat.disposisi.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white">+{surat.disposisi.length - 3}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openDisposisi(surat)}
                                                    className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors flex items-center gap-1"
                                                >
                                                    <Plus size={12} /> Disposisi
                                                </button>
                                            )}
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
                                                <div className="relative group/tooltip">
                                                    <button
                                                        onClick={() => openDisposisi(surat)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Buat Disposisi"
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
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
                    <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <FileText className="text-primary" size={20} />
                                Smart Preview
                            </h3>
                            <div className="flex gap-2">
                                <a
                                    href={previewFile}
                                    download
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                                    title="Download File"
                                >
                                    <Download size={20} />
                                </a>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden flex justify-center">
                            {previewFile.endsWith('.pdf') ? (
                                <iframe src={previewFile} className="w-full h-full rounded-xl border border-gray-200 dark:border-gray-700" />
                            ) : (
                                <img src={previewFile} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-sm" />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Disposisi Modal */}
            <Modal show={showDisposisiModal} onClose={closeDisposisi}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Send className="text-primary" size={24} />
                        Disposisi Surat
                    </h2>

                    {selectedSurat && (
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">Detail Surat:</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="font-semibold">{selectedSurat.no_surat_pengirim}</span> - {selectedSurat.perihal}
                            </p>
                        </div>
                    )}

                    <form onSubmit={submitDisposisi} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="penerima_disposisi_id" value="Penerima Disposisi" />
                            <NativeSelect
                                id="penerima_disposisi_id"
                                className="mt-1 block w-full"
                                value={data.penerima_disposisi_id}
                                onChange={(e) => setData('penerima_disposisi_id', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Staf / Guru --</option>
                                {staffs.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.name}
                                    </option>
                                ))}
                            </NativeSelect>
                        </div>

                        <div>
                            <InputLabel htmlFor="instruksi" value="Instruksi" />
                            <NativeSelect
                                id="instruksi"
                                className="mt-1 block w-full"
                                value={data.instruksi}
                                onChange={(e) => setData('instruksi', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Instruksi --</option>
                                {INSTRUCTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </NativeSelect>
                        </div>

                        <div>
                            <InputLabel htmlFor="batas_waktu" value="Batas Waktu (Opsional)" />
                            <TextInput
                                id="batas_waktu"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.batas_waktu}
                                onChange={(e) => setData('batas_waktu', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="catatan" value="Catatan Tambahan" />
                            <textarea
                                id="catatan"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                rows="3"
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Tambahkan catatan khusus..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <SecondaryButton onClick={closeDisposisi} disabled={processing}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton disabled={processing} className="flex items-center gap-2">
                                <Send size={16} /> Kirim Disposisi
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}
