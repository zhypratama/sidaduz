import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, Trash2, GripVertical, Edit2, X, GraduationCap, Layout } from 'lucide-react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

import axios from 'axios';
import Swal from 'sweetalert2';

// Standard Select Input Component if not imported
const NativeSelect = ({ className, ...props }) => (
    <select
        className={
            'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm ' +
            className
        }
        {...props}
    />
);

const CATEGORIES = {
    'Muatan Nasional': { label: 'Muatan Nasional', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    'Muatan Lokal': { label: 'Muatan Lokal', color: 'bg-green-100 text-green-700 border-green-200' },
    'Muatan Sekolah': { label: 'Muatan Sekolah', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    'Ekstrakurikuler': { label: 'Ekstrakurikuler', color: 'bg-orange-100 text-orange-700 border-orange-200' },
};

export default function Index({ auth, mapels }) {
    // Initial Grouping
    const groupMapels = (items) => {
        const groups = {
            'Muatan Nasional': [],
            'Muatan Lokal': [],
            'Muatan Sekolah': [],
            'Ekstrakurikuler': [],
            'Uncategorized': []
        };

        items.forEach(item => {
            if (groups[item.kelompok]) {
                groups[item.kelompok].push(item);
            } else {
                groups['Uncategorized'].push(item);
            }
        });

        // Sort by urutan
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => a.urutan - b.urutan);
        });

        return groups;
    };

    const [columns, setColumns] = useState(groupMapels(mapels));
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nama: '',
        kode: '',
        kelompok: 'Muatan Nasional'
    });

    useEffect(() => {
        setColumns(groupMapels(mapels));
    }, [mapels]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        // Verify ID match
        const sourceColId = source.droppableId;
        const destColId = destination.droppableId;

        // If same column and same index, do nothing
        if (sourceColId === destColId && source.index === destination.index) return;

        // Clone columns
        const newColumns = { ...columns };
        const sourceItems = Array.from(newColumns[sourceColId]);
        const [movedItem] = sourceItems.splice(source.index, 1);

        if (sourceColId === destColId) {
            // Reorder in same column
            sourceItems.splice(destination.index, 0, movedItem);
            newColumns[sourceColId] = sourceItems;
            setColumns(newColumns);

            // Call API to reorder
            const ids = sourceItems.map(i => i.id);
            await axios.post(route('kurikulum.mata-pelajaran.reorder'), { ids });
        } else {
            // Move to different column (Change Category)
            const destItems = Array.from(newColumns[destColId]);
            destItems.splice(destination.index, 0, { ...movedItem, kelompok: destColId });

            newColumns[sourceColId] = sourceItems;
            newColumns[destColId] = destItems;
            setColumns(newColumns);

            // Call API to update category
            try {
                await axios.put(route('kurikulum.mata-pelajaran.update', movedItem.id), {
                    ...movedItem,
                    kelompok: destColId
                });

                // Also reorder target column if needed, but 'update' might not handle urutan automatically in this context
                // So optimally we also send reorder for target column
                const destIds = destItems.map(i => i.id);
                await axios.post(route('kurikulum.mata-pelajaran.reorder'), { ids: destIds });

                // Show toast?
            } catch (error) {
                console.error("Failed to move item", error);
                // Revert or alert
                Swal.fire('Error', 'Gagal memindah kategori', 'error');
            }
        }
    };

    const openModal = (item = null, category = 'Muatan Nasional') => {
        if (item) {
            setEditingItem(item);
            setData({
                nama: item.nama,
                kode: item.kode,
                kelompok: item.kelompok || 'Muatan Nasional'
            });
        } else {
            setEditingItem(null);
            setData({
                nama: '',
                kode: '',
                kelompok: category
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            put(route('kurikulum.mata-pelajaran.update', editingItem.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('kurikulum.mata-pelajaran.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Mapel?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('kurikulum.mata-pelajaran.destroy', id));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Mata Pelajaran (Smart View)
                    </h2>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                        <Plus size={16} /> Tambah Mapel
                    </button>
                </div>
            }
        >
            <Head title="Mata Pelajaran" />

            <div className="py-8 px-4 max-w-7xl mx-auto overflow-x-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 min-w-max pb-4">
                        {Object.keys(CATEGORIES).map((catId) => {
                            const category = CATEGORIES[catId];
                            const items = columns[catId] || [];

                            return (
                                <div key={catId} className="w-80 flex-shrink-0 flex flex-col">
                                    {/* Column Header */}
                                    <div className={`p-3 rounded-t-xl border-b-2 flex justify-between items-center ${category.color.replace('text-', 'border-').split(' ')[2]} ${category.color.split(' ')[0]}`}>
                                        <h3 className="font-bold text-gray-800">{category.label}</h3>
                                        <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-mono font-bold">
                                            {items.length}
                                        </span>
                                    </div>

                                    {/* Droppable Area */}
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-b-xl p-2 min-h-[500px] border border-gray-200 dark:border-gray-700">
                                        <Droppable droppableId={catId}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={`min-h-[400px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-700/50' : ''}`}
                                                >
                                                    {items.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`bg-white dark:bg-gray-700 p-3 mb-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 group hover:shadow-md transition-all ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-primary' : ''}`}
                                                                    style={provided.draggableProps.style}
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex-1">
                                                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.nama}</h4>
                                                                            <span className="text-xs bg-gray-100 dark:bg-gray-600 px-1.5 rounded text-gray-500 dark:text-gray-400 mt-1 inline-block font-mono">
                                                                                {item.kode}
                                                                            </span>
                                                                        </div>
                                                                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                                                            <button
                                                                                onClick={() => openModal(item)}
                                                                                className="p-1 hover:bg-blue-50 text-blue-500 rounded"
                                                                            >
                                                                                <Edit2 size={14} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(item.id)}
                                                                                className="p-1 hover:bg-red-50 text-red-500 rounded"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}

                                                    {/* Quick Add Button */}
                                                    {!snapshot.isDraggingOver && (
                                                        <button
                                                            onClick={() => openModal(null, catId)}
                                                            className="w-full py-2 mt-2 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            <Plus size={14} /> Tambah di sini
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Uncategorized Column (Only if items exist) */}
                        {columns['Uncategorized'] && columns['Uncategorized'].length > 0 && (
                            <div className="w-80 flex-shrink-0 flex flex-col opacity-75">
                                <div className="p-3 rounded-t-xl border-b-2 flex justify-between items-center bg-gray-200 border-gray-300 text-gray-700">
                                    <h3 className="font-bold">Lainnya</h3>
                                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-mono font-bold">
                                        {columns['Uncategorized'].length}
                                    </span>
                                </div>
                                <div className="bg-gray-100 rounded-b-xl p-2 min-h-[500px] border border-gray-200">
                                    <Droppable droppableId="Uncategorized">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[100px]">
                                                {columns['Uncategorized'].map((item, index) => (
                                                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-3 mb-2 rounded-lg border">
                                                                {item.nama}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        )}

                    </div>
                </DragDropContext>
            </div>

            {/* Modal Form */}
            <Modal show={showModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Mata Pelajaran" />
                            <TextInput
                                id="nama"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: Matematika Wajib"
                                autoFocus
                            />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="kode" value="Kode Mapel" />
                            <TextInput
                                id="kode"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                placeholder="CTH: MTK-W"
                            />
                            <InputError message={errors.kode} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="kelompok" value="Kelompok" />
                            <NativeSelect
                                id="kelompok"
                                className="mt-1 block w-full"
                                value={data.kelompok}
                                onChange={(e) => setData('kelompok', e.target.value)}
                            >
                                <option value="">-- Pilih Kelompok --</option>
                                {Object.keys(CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </NativeSelect>
                            <InputError message={errors.kelompok} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <SecondaryButton onClick={closeModal} disabled={processing}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingItem ? 'Simpan Perubahan' : 'Tambah'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
