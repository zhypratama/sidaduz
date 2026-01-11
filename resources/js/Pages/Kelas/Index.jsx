import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, X, Save, GraduationCap, GripVertical, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Color Helper
const getColor = (name) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600', 'bg-pink-100 text-pink-600'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

export default function Index({ auth, kelas, waliKelas, tahunAjaran }) {
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [editingKelas, setEditingKelas] = useState(null);
    const [search, setSearch] = useState('');

    // Drag & Drop State
    const [items, setItems] = useState(kelas.data);
    const [isDragging, setIsDragging] = useState(false);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    // Sync items when props change (e.g. pagination or search)
    useEffect(() => {
        setItems(kelas.data);
    }, [kelas.data]);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nama: '',
        wali_kelas_id: '',
        tahun_ajaran_id: '',
    });

    // Drag Handlers
    const handleDragStart = (e, position) => {
        dragItem.current = position;
        setIsDragging(true);
        // Ghost image styling could be improved here but default is okay
    };

    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
        // Optional: Live reorder preview (can be jittery without animation lib, maybe skip for now and just reorder on drop)
        // Let's implement live preview for better UX
        const copyListItems = [...items];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = position;
        setItems(copyListItems);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        dragItem.current = null;
        dragOverItem.current = null;

        // Save to backend
        const ids = items.map(item => item.id);
        router.post(route('kelas.reorder'), { items: ids }, {
            preserveScroll: true,
            onSuccess: () => {
                // Silent success or toast
            }
        });
    };

    const openModal = (k = null) => {
        if (k) {
            setEditingKelas(k);
            setData({
                nama: k.nama,
                wali_kelas_id: k.wali_kelas_id || '',
                tahun_ajaran_id: k.tahun_ajaran_id || '',
            });
        } else {
            setEditingKelas(null);
            setData({
                nama: '',
                wali_kelas_id: '',
                tahun_ajaran_id: tahunAjaran.length > 0 ? tahunAjaran[0].id : '',
            });
        }
        setIsApproveOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingKelas) {
            put(route('kelas.update', editingKelas.id), {
                onSuccess: () => setIsApproveOpen(false)
            });
        } else {
            post(route('kelas.store'), {
                onSuccess: () => setIsApproveOpen(false)
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            destroy(route('kelas.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl text-gray-800 tracking-tight">Manajemen Kelas</h2>
                        <p className="text-gray-500 text-sm mt-1">Atur kelas, wali kelas, dan urutan tampilan (Drag & Drop)</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={18} />
                        Tambah Kelas
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Kelas" />

            <div className="space-y-6">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <Search className="text-gray-400 ml-2" size={20} />
                    <input
                        type="text"
                        placeholder="Cari kelas..."
                        className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            router.get(route('kelas.index'), { search: e.target.value }, { preserveState: true, replace: true });
                        }}
                    />
                </div>

                {/* Grid Layout (Draggable) */}
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((k, index) => (
                            <div
                                key={k.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`bg-white rounded-[24px] p-6 border transition-all duration-200 group relative
                                    ${isDragging && dragItem.current === index ? 'opacity-50 scale-95 border-dashed border-primary bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1'}
                                    cursor-grab active:cursor-grabbing
                                `}
                            >
                                {/* Drag Handle Indicator */}
                                <div className="absolute top-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical size={20} />
                                </div>

                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${getColor(k.nama)}`}>
                                                {k.nama.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-800 leading-tight">{k.nama}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mt-1 inline-block ${k.tahun_ajaran?.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {k.tahun_ajaran ? `${k.tahun_ajaran.periode} ${k.tahun_ajaran.semester}` : 'No TA'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Wali Kelas Logic */}
                                        <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400">
                                                <User size={16} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-gray-400 font-medium">Wali Kelas</p>
                                                <p className="text-sm font-semibold text-gray-700 truncate">
                                                    {k.wali_kelas ? k.wali_kelas.nama : <span className="text-red-400 italic">Belum diset</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-4 border-t border-gray-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={() => openModal(k)}
                                            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(k.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Belum ada Kelas</h3>
                        <p className="text-gray-500 mb-6">Mulai dengan menambahkan kelas baru.</p>
                        <button
                            onClick={() => openModal()}
                            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
                        >
                            Tambah Kelas
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Form remains mostly same, just slight styling touch up */}
            {isApproveOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-800">
                                    {editingKelas ? 'Edit Data Kelas' : 'Kelas Baru'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Lengkapi informasi kelas berikut</p>
                            </div>
                            <button onClick={() => setIsApproveOpen(false)} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Kelas</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-700 bg-gray-50 focus:bg-white transition-all"
                                    placeholder="Contoh: VII-A"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    required
                                />
                                {errors.nama && <div className="text-red-500 text-xs mt-1 font-medium">{errors.nama}</div>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tahun Ajaran</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-gray-700 bg-gray-50 focus:bg-white transition-all appearance-none"
                                        value={data.tahun_ajaran_id}
                                        onChange={e => setData('tahun_ajaran_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Tahun Ajaran</option>
                                        {tahunAjaran.map(ta => (
                                            <option key={ta.id} value={ta.id}>
                                                {ta.periode} - {ta.semester}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <GraduationCap size={18} />
                                    </div>
                                </div>
                                {errors.tahun_ajaran_id && <div className="text-red-500 text-xs mt-1 font-medium">{errors.tahun_ajaran_id}</div>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Wali Kelas</label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-gray-700 bg-gray-50 focus:bg-white transition-all appearance-none"
                                        value={data.wali_kelas_id}
                                        onChange={e => setData('wali_kelas_id', e.target.value)}
                                    >
                                        <option value="">-- Belum ada Wali Kelas --</option>
                                        {waliKelas.map(g => (
                                            <option key={g.id} value={g.id}>{g.nama} ({g.nip || 'Non-NIP'})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                </div>
                                {errors.wali_kelas_id && <div className="text-red-500 text-xs mt-1 font-medium">{errors.wali_kelas_id}</div>}
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsApproveOpen(false)}
                                    className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2"
                                >
                                    {processing ? 'Menyimpan...' : (
                                        <>
                                            <Save size={18} /> Simpan Data
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
