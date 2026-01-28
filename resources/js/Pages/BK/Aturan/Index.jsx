import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Import router
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal'; // Assuming generic Modal component exists
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function AturanIndex({ auth, rules }) {
    const [search, setSearch] = useState('');
    const [filteredRules, setFilteredRules] = useState(rules);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form handling
    const { data, setData, post, patch, delete: destroy, reset, processing, errors } = useForm({
        id: '',
        kategori: 'Ringan',
        nama_pelanggaran: '',
        poin: 5,
        tindakan_biasa: ''
    });

    useEffect(() => {
        setFilteredRules(
            rules.filter(rule =>
                rule.nama_pelanggaran.toLowerCase().includes(search.toLowerCase()) ||
                rule.kategori.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, rules]);

    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        setShowModal(true);
    };

    const openEditModal = (rule) => {
        setIsEditing(true);
        setData({
            id: rule.id,
            kategori: rule.kategori,
            nama_pelanggaran: rule.nama_pelanggaran,
            poin: rule.poin,
            tindakan_biasa: rule.tindakan_biasa || ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('bk.aturan.update', data.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('bk.aturan.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus aturan ini?')) {
            destroy(route('bk.aturan.destroy', id));
        }
    };

    const getKategoriColor = (type) => {
        switch (type) {
            case 'Ringan': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Sedang': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'Berat': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Sangat Berat': return 'bg-red-600 text-white dark:bg-red-600 dark:text-white';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Aturan & Poin Pelanggaran</h2>
                        <p className="text-gray-500 text-sm">Master data tata tertib sekolah</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="bg-gray-800 dark:bg-gray-200 hover:bg-gray-700 dark:hover:bg-white text-white dark:text-gray-800 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Tambah Aturan
                    </button>
                </div>
            }
        >
            <Head title="Aturan Sekolah" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50">
                <div className="mb-6 relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari aturan..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-gray-500/20 text-gray-700 dark:text-gray-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kategori</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pelanggaran</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Poin</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tindakan Biasa</th>
                                <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="py-4 px-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${getKategoriColor(rule.kategori)}`}>
                                            {rule.kategori}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm max-w-md">{rule.nama_pelanggaran}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="font-bold text-red-500">{rule.poin}</span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                        {rule.tindakan_biasa || '-'}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(rule)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {isEditing ? 'Edit Aturan' : 'Tambah Aturan Baru'}
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Kategori */}
                        <div>
                            <InputLabel htmlFor="kategori" value="Kategori Pelanggaran" />
                            <select
                                id="kategori"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                required
                            >
                                <option value="Ringan">Ringan</option>
                                <option value="Sedang">Sedang</option>
                                <option value="Berat">Berat</option>
                                <option value="Sangat Berat">Sangat Berat</option>
                            </select>
                            {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
                        </div>

                        {/* Nama Pelanggaran */}
                        <div>
                            <InputLabel htmlFor="nama_pelanggaran" value="Nama Pelanggaran" />
                            <TextInput
                                id="nama_pelanggaran"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.nama_pelanggaran}
                                onChange={(e) => setData('nama_pelanggaran', e.target.value)}
                                placeholder="Contoh: Terlambat > 15 menit"
                                required
                            />
                            {errors.nama_pelanggaran && <p className="text-red-500 text-sm mt-1">{errors.nama_pelanggaran}</p>}
                        </div>

                        {/* Poin */}
                        <div>
                            <InputLabel htmlFor="poin" value="Poin Sanksi" />
                            <TextInput
                                id="poin"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.poin}
                                onChange={(e) => setData('poin', e.target.value)}
                                required
                            />
                            {errors.poin && <p className="text-red-500 text-sm mt-1">{errors.poin}</p>}
                        </div>

                        {/* Tindakan */}
                        <div>
                            <InputLabel htmlFor="tindakan_biasa" value="Tindakan Biasa (Opsional)" />
                            <TextInput
                                id="tindakan_biasa"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.tindakan_biasa}
                                onChange={(e) => setData('tindakan_biasa', e.target.value)}
                                placeholder="Contoh: Teguran lisan"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {isEditing ? 'Simpan Perubahan' : 'Tambah Aturan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
