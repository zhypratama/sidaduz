import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Link as LinkIcon, Edit, Trash, BarChart2, Eye, Calendar, MoreVertical, Copy, Clipboard } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, forms }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: ''
    });

    const [showCreateModal, setShowCreateModal] = useState(false);

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('forms.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
                Swal.fire('Berhasil', 'Formulir baru berhasil dibuat!', 'success');
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Formulir?',
            text: "Data yang dihapus tidak dapat dikembalikan, termasuk semua jawaban yang masuk.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('forms.destroy', id), {
                    onSuccess: () => Swal.fire('Terhapus!', 'Formulir telah dihapus.', 'success')
                });
            }
        })
    };

    const copyLink = (slug) => {
        const url = `${window.location.origin}/form/${slug}`;
        navigator.clipboard.writeText(url);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        Toast.fire({
            icon: 'success',
            title: 'Link berhasil disalin!'
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Formulir Online</h2>}
        >
            <Head title="Formulir Online" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Daftar Formulir</h3>
                            <p className="text-gray-500">Kelola formulir pendaftaran, survei, dan pengumpulan data.</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                        >
                            <Plus size={20} /> Buat Formulir Baru
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="p-6 bg-white border-b border-gray-200">

                            {forms.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                                        <Clipboard size={48} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">Belum ada formulir</h3>
                                    <p className="mt-1 text-gray-500">Mulai dengan membuat formulir baru untuk mengumpulkan data.</p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="mt-6 text-primary hover:underline font-medium"
                                    >
                                        Buat Formulir Pertama
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {forms.data.map((form) => (
                                        <div key={form.id} className="group bg-white rounded-xl border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                                            {/* Status Badge */}
                                            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${form.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {form.is_active ? 'AKTIF' : 'DRAFT'}
                                            </div>

                                            <div className="p-5 flex-1">
                                                <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1" title={form.title}>{form.title}</h4>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{form.description || 'Tidak ada deskripsi'}</p>

                                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <BarChart2 size={14} />
                                                        <span>{form.responses_count} Respon</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>{new Date(form.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono mb-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => copyLink(form.slug)}>
                                                    <LinkIcon size={12} className="shrink-0" />
                                                    <span className="truncate flex-1">sidadu.../form/{form.slug}</span>
                                                    <Copy size={12} className="shrink-0 text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('forms.edit', form.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors tooltip"
                                                        title="Edit Form"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <Link
                                                        href={route('forms.show', form.id)}
                                                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors tooltip"
                                                        title="Lihat Jawaban"
                                                    >
                                                        <BarChart2 size={18} />
                                                    </Link>
                                                    <a
                                                        href={route('public.form.show', form.slug)}
                                                        target="_blank"
                                                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors tooltip"
                                                        title="Lihat Preview"
                                                    >
                                                        <Eye size={18} />
                                                    </a>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(form.id)}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {forms.links && forms.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex gap-1">
                                        {forms.links.map((link, k) => (
                                            <Link
                                                key={k}
                                                href={link.url}
                                                className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <form onSubmit={submitCreate}>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Buat Formulir Baru</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Formulir</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
                                        placeholder="Contoh: Pendaftaran OSIS 2026"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                                    <textarea
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
                                        rows="3"
                                        placeholder="Jelaskan tujuan formulir ini..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 shadow-lg font-medium"
                                    >
                                        {processing ? 'Membuat...' : 'Buat Formulir'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
