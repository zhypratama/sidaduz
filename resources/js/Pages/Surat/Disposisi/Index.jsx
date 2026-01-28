import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Search, Filter, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton'; // Assuming you have this
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function DisposisiIndex({ auth, disposisi_list }) {
    const [search, setSearch] = useState('');
    const [selectedDisposisi, setSelectedDisposisi] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        status: '',
        catatan: '' // Optional note update
    });

    const openUpdateModal = (item) => {
        setSelectedDisposisi(item);
        setData({
            status: item.status,
            catatan: item.catatan || '' // Keep existing note? Or append? usually just status update logic involves note
        });
        setShowUpdateModal(true);
    };

    const updateStatus = (e) => {
        e.preventDefault();
        patch(route('surat-disposisi.update', selectedDisposisi.id), {
            onSuccess: () => {
                setShowUpdateModal(false);
                setSelectedDisposisi(null);
                reset();
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Selesai': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Diproses': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Disposisi Surat</h2>
                        <p className="text-gray-500 text-sm">Daftar instruksi dan tugas surat masuk</p>
                    </div>
                </div>
            }
        >
            <Head title="Disposisi Surat" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50">
                {/* Simple Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari disposisi..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-4">
                    {disposisi_list.data.length > 0 ? (
                        disposisi_list.data.map((item) => (
                            <div key={item.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={12} /> {item.tanggal_disposisi}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{item.instruksi}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Surat: <span className="font-medium text-primary">#{item.surat_masuk?.no_surat_pengirim}</span> - {item.surat_masuk?.perihal}
                                        </p>
                                        <div className="mt-3 flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Dari:</span> {item.pemberi?.name}
                                            </div>
                                            <ArrowRight size={14} className="text-gray-300" />
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Kepada:</span> {item.penerima?.name}
                                            </div>
                                        </div>
                                        {item.catatan && (
                                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-600 dark:text-gray-300 italic">
                                                "{item.catatan}"
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {auth.user.id === item.penerima_disposisi_id && item.status !== 'Selesai' && (
                                            <button
                                                onClick={() => openUpdateModal(item)}
                                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle size={16} /> Update Status
                                            </button>
                                        )}
                                        {/* View Letter Details Link */}
                                        <Link
                                            // href={route('surat-masuk.show', item.surat_masuk_id)} // Assuming show route exists or just link to index
                                            href={route('surat-masuk.index')}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Lihat Surat"
                                        >
                                            <Mail size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <AlertCircle size={48} className="mx-auto mb-3 opacity-20" />
                            <p>Tidak ada data disposisi</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Update Status Modal */}
            <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Update Status Disposisi</h2>
                    <form onSubmit={updateStatus} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:border-primary focus:ring-primary"
                            >
                                <option value="Belum Dibaca">Belum Dibaca</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan Tambahan</label>
                            <textarea 
                                value={data.catatan}
                                onChange={e => setData('catatan', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:border-primary focus:ring-primary"
                                rows="3"
                            ></textarea>
                        </div> */}
                        <div className="flex justify-end gap-3 mt-6">
                            <SecondaryButton onClick={() => setShowUpdateModal(false)}>Batal</SecondaryButton>
                            <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
