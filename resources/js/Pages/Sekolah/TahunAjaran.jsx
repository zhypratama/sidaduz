import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function TahunAjaran({ auth, years }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tahun: '',
        semester: 'Ganjil',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tahun-ajaran.store'), {
            onSuccess: () => reset(),
        });
    };

    const activate = (id) => {
        if (confirm('Aktifkan tahun ajaran ini? Semua data operasional akan mengacu pada tahun ini.')) {
            router.post(route('tahun-ajaran.activate', id));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus tahun ajaran ini?')) {
            router.delete(route('tahun-ajaran.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Tahun Ajaran</h2>
                        <p className="text-gray-500 text-sm">Kelola periode akademik sekolah</p>
                    </div>
                </div>
            }
        >
            <Head title="Tahun Ajaran" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Input (Left) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50 sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Plus className="text-primary" size={20} />
                            Buat Periode Baru
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pelajaran</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                    value={data.tahun}
                                    onChange={e => setData('tahun', e.target.value)}
                                    placeholder="Contoh: 2024/2025"
                                />
                                {errors.tahun && <div className="text-danger text-xs mt-1">{errors.tahun}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <select
                                    className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                    value={data.semester}
                                    onChange={e => setData('semester', e.target.value)}
                                >
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                            >
                                <Plus size={18} /> Tambah
                            </button>
                        </form>
                    </div>
                </div>

                {/* List (Right) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-100">
                                        <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tahun</th>
                                        <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Semester</th>
                                        <th className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="pb-3 px-4 text-xs font-semibold text-gray-400 text-right uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {years.map((year) => (
                                        <tr key={year.id} className={`hover:bg-gray-50/50 transition-colors ${year.is_active ? 'bg-green-50/30' : ''}`}>
                                            <td className="py-4 px-4 font-bold text-gray-800">{year.tahun}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{year.semester}</td>
                                            <td className="py-4 px-4">
                                                {year.is_active ? (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                                                        <CheckCircle size={14} /> AKTIF
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full w-fit">
                                                        Non-Aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!year.is_active && (
                                                        <>
                                                            <button
                                                                onClick={() => activate(year.id)}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                                                            >
                                                                Set Aktif
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(year.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {years.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-400 italic">
                                                Belum ada data tahun ajaran.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
