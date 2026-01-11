import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, FileText, Tag, AlignLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Create({ auth, template, klasifikasis }) {
    const { data, setData, post, put, processing, errors } = useForm({
        nama: template?.nama || '',
        kategori: template?.kategori || 'Umum',
        klasifikasi_surat_id: template?.klasifikasi_surat_id || '',
        isi_surat: template?.isi_surat || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (template) {
            put(route('surat-template.update', template.id));
        } else {
            post(route('surat-template.store'));
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
            ['clean']
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('surat-template.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800">{template ? 'Edit Template' : 'Buat Template Baru'}</h2>
                            <p className="text-gray-500 text-sm">Setup format surat untuk digunakan kembali</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={template ? 'Edit Template' : 'Buat Template'} />

            <form onSubmit={submit} className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[30px] p-8 shadow-sm shadow-gray-200/50 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Template</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    placeholder="Contoh: Surat Keterangan Siswa"
                                />
                            </div>
                            {errors.nama && <div className="text-danger text-xs mt-1">{errors.nama}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 focus:ring-primary focus:border-primary appearance-none"
                                    value={data.kategori}
                                    onChange={e => setData('kategori', e.target.value)}
                                >
                                    <option value="Umum">Umum</option>
                                    <option value="Kesiswaan">Kesiswaan</option>
                                    <option value="Kepegawaian">Kepegawaian</option>
                                    <option value="Dinas">Dinas</option>
                                </select>
                            </div>
                            {errors.kategori && <div className="text-danger text-xs mt-1">{errors.kategori}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Klasifikasi (Kode)</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 focus:ring-primary focus:border-primary appearance-none"
                                    value={data.klasifikasi_surat_id}
                                    onChange={e => setData('klasifikasi_surat_id', e.target.value)}
                                >
                                    <option value="">-- Pilih Klasifikasi --</option>
                                    {klasifikasis.map(k => (
                                        <option key={k.id} value={k.id}>{k.kode} - {k.nama}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.klasifikasi_surat_id && <div className="text-danger text-xs mt-1">{errors.klasifikasi_surat_id}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Isi Template</label>
                        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 ring-primary/20">
                            <ReactQuill
                                theme="snow"
                                value={data.isi_surat}
                                onChange={value => setData('isi_surat', value)}
                                modules={modules}
                                className="bg-white min-h-[300px]"
                            />
                        </div>
                        {errors.isi_surat && <div className="text-danger text-xs mt-1">{errors.isi_surat}</div>}
                        <p className="text-xs text-gray-500 mt-2">
                            Tip: Gunakan placeholder seperti [NAMA], [KELAS] untuk data dinamis (fitur lanjutan).
                        </p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-900/20"
                        >
                            {processing ? 'Menyimpan...' : (
                                <>
                                    <Save size={18} /> Simpan Template
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
