import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FileText, Users, Plus, Upload, Search, CheckCircle, Clock, Save, X, Phone, User } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function BeritaDanTamu({ auth, beritas, tamus, gtks }) {
    const [activeTab, setActiveTab] = useState('berita');
    const [showModal, setShowModal] = useState(false);

    // Forms
    const formBerita = useForm({
        judul: '',
        deskripsi: '',
        kategori: 'Kejadian',
        file_bukti: null
    });

    const formTamu = useForm({
        nama: '',
        asal_instansi: '',
        keperluan: '',
        bertemu_dengan: '',
        no_hp: '',
        foto: null
    });

    const handleSubmitBerita = (e) => {
        e.preventDefault();
        formBerita.post(route('gtk.piket.store-berita'), {
            onSuccess: () => {
                formBerita.reset();
                setShowModal(false);
            }
        });
    };

    const handleSubmitTamu = (e) => {
        e.preventDefault();
        formTamu.post(route('gtk.piket.store-tamu'), {
            onSuccess: () => {
                formTamu.reset();
                setShowModal(false);
            }
        });
    };

    const handleCheckout = (id) => {
        if (confirm('Apakah tamu ini sudah selesai berkunjung/keluar?')) {
            router.post(route('gtk.piket.checkout-tamu', id));
        }
    };

    // --- Render Helpers ---

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Buku Piket</h2>
                    <PrimaryButton onClick={() => setShowModal(true)}>
                        <Plus className="mr-2" size={18} />
                        Tambah {activeTab === 'berita' ? 'Berita Acara' : 'Tamu'}
                    </PrimaryButton>
                </div>
            }
        >
            <Head title="Buku Piket" />

            {/* Tabs */}
            <div className="py-6">
                <div className="flex justify-center mb-6">
                    <div className="bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-2">
                        <button
                            onClick={() => setActiveTab('berita')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'berita' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <FileText size={18} /> Berita Acara
                        </button>
                        <button
                            onClick={() => setActiveTab('tamu')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'tamu' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <Users size={18} /> Buku Tamu
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {activeTab === 'berita' ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {beritas.map(item => (
                                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold 
                                            ${item.kategori === 'Pelanggaran' ? 'bg-red-100 text-red-700' :
                                                item.kategori === 'Kejadian' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`
                                        }>
                                            {item.kategori}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono">{new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">{item.judul}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">{item.deskripsi}</p>
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[10px] text-gray-600">
                                            {item.pelapor?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span>{item.pelapor?.name}</span>
                                    </div>
                                </div>
                            ))}
                            {beritas.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-400">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Belum ada berita acara hari ini.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tamus.map(item => (
                                <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                                            {item.nama.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-200">{item.nama}</h3>
                                            <p className="text-xs text-gray-500">{item.asal_instansi || 'Pribadi'} • {item.no_hp || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex-1">
                                        <p><span className="font-semibold text-gray-800 dark:text-gray-300">Keperluan:</span> {item.keperluan}</p>
                                        {item.bertemu_dengan && (
                                            <p className="flex items-center gap-1">
                                                <User size={12} /> Bertemu: <span className="font-medium text-primary">{item.bertemu_dengan}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-xs font-mono text-gray-400">
                                            IN: {item.waktu_masuk?.substring(0, 5)}
                                            {item.waktu_keluar && ` • OUT: ${item.waktu_keluar.substring(0, 5)}`}
                                        </div>
                                        {!item.waktu_keluar ? (
                                            <button
                                                onClick={() => handleCheckout(item.id)}
                                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                                            >
                                                Checkout
                                            </button>
                                        ) : (
                                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                                <CheckCircle size={12} /> Selesai
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tamus.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Belum ada tamu hari ini.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {activeTab === 'berita' ? 'Tulis Berita Acara' : 'Catat Buku Tamu'}
                    </h2>

                    {activeTab === 'berita' ? (
                        <form onSubmit={handleSubmitBerita} className="space-y-4">
                            <div>
                                <InputLabel value="Judul Kejadian" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={formBerita.data.judul}
                                    onChange={e => formBerita.setData('judul', e.target.value)}
                                    placeholder="Contoh: Siswa Terlambat Massal"
                                />
                                <InputError message={formBerita.errors.judul} />
                            </div>

                            <div>
                                <InputLabel value="Kategori" />
                                <select
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={formBerita.data.kategori}
                                    onChange={e => formBerita.setData('kategori', e.target.value)}
                                >
                                    <option value="Kejadian">Kejadian</option>
                                    <option value="Pelanggaran">Pelanggaran</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            <div>
                                <InputLabel value="Deskripsi" />
                                <textarea
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-32"
                                    value={formBerita.data.deskripsi}
                                    onChange={e => formBerita.setData('deskripsi', e.target.value)}
                                ></textarea>
                                <InputError message={formBerita.errors.deskripsi} />
                            </div>

                            <div>
                                <InputLabel value="Bukti Foto (Opsional)" />
                                <input
                                    type="file"
                                    className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={e => formBerita.setData('file_bukti', e.target.files[0])}
                                />
                                <InputError message={formBerita.errors.file_bukti} />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <SecondaryButton onClick={() => setShowModal(false)}>Batal</SecondaryButton>
                                <PrimaryButton disabled={formBerita.processing}>Simpan Berita</PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitTamu} className="space-y-4">
                            <div>
                                <InputLabel value="Nama Lengkap" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={formTamu.data.nama}
                                    onChange={e => formTamu.setData('nama', e.target.value)}
                                />
                                <InputError message={formTamu.errors.nama} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Asal Instansi" />
                                    <TextInput
                                        className="w-full mt-1"
                                        value={formTamu.data.asal_instansi}
                                        onChange={e => formTamu.setData('asal_instansi', e.target.value)}
                                        placeholder="-"
                                    />
                                </div>
                                <div>
                                    <InputLabel value="No HP" />
                                    <TextInput
                                        className="w-full mt-1"
                                        value={formTamu.data.no_hp}
                                        onChange={e => formTamu.setData('no_hp', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel value="Keperluan" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={formTamu.data.keperluan}
                                    onChange={e => formTamu.setData('keperluan', e.target.value)}
                                />
                                <InputError message={formTamu.errors.keperluan} />
                            </div>

                            <div>
                                <InputLabel value="Bertemu Dengan Siapa?" />
                                <select
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={formTamu.data.bertemu_dengan}
                                    onChange={e => formTamu.setData('bertemu_dengan', e.target.value)}
                                >
                                    <option value="">-- Pilih Guru/Staff (Opsional) --</option>
                                    {gtks.map(g => (
                                        <option key={g.id} value={g.nama}>{g.nama}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel value="Foto Tamu (Opsional)" />
                                <input
                                    type="file"
                                    className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={e => formTamu.setData('foto', e.target.files[0])}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <SecondaryButton onClick={() => setShowModal(false)}>Batal</SecondaryButton>
                                <PrimaryButton disabled={formTamu.processing}>Simpan Tamu</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
