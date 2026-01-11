import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ auth, templates }) {
    const [search, setSearch] = useState('');

    const handleDelete = (id) => {
        if (confirm('Hapus template ini?')) {
            router.delete(route('surat-template.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Template Surat</h2>
                        <p className="text-gray-500 text-sm">Kelola format surat standar sekolah</p>
                    </div>
                    <Link
                        href={route('surat-template.create')}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                    >
                        <Plus size={18} />
                        Buat Template Baru
                    </Link>
                </div>
            }
        >
            <Head title="Template Surat" />

            <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                {/* Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari template..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div key={template.id} className="bg-gray-50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                                    <FileText size={24} />
                                </div>
                                <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-500 shadow-sm border border-gray-100">
                                    {template.kategori}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg mb-1">{template.nama}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {template.isi_surat.replace(/<[^>]*>?/gm, '')}
                            </p>

                            <div className="flex gap-2">
                                <Link
                                    href={route('surat-template.edit', template.id)}
                                    className="flex-1 py-2 text-center bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {templates.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center">
                                <FileText size={48} className="mb-2 opacity-20" />
                                <p>Belum ada template surat</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
