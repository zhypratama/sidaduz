import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, Building, FileText, Image, Search } from 'lucide-react';

export default function Pengaturan({ auth, school, footer }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_sekolah: school?.nama || '',
        alamat: school?.alamat || '',
        email: school?.email || '',
        website: school?.website || '',
        notelp: school?.notelp || '',
        kop_surat: null, // File upload
        footer_text: footer || 'Dokumen ini telah ditandatangani secara elektronik yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), BSSN.',
    });

    const submit = (e) => {
        e.preventDefault();
        // Since we are uploading file, use FormData automatically handled by useForm when data contains file object,
        // BUT we need to force_multipart/method spoofing for Laravel updates usually if using PUT?
        // Method is POST in routes so it's fine.
        post(route('surat-pengaturan.update'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl text-gray-800 tracking-tight">Pengaturan Surat</h2>
                        <p className="text-gray-500 text-sm mt-1">Konfigurasi Kop Surat, Footer, dan Identitas Sekolah</p>
                    </div>
                </div>
            }
        >
            <Head title="Pengaturan Surat" />

            <div className="max-w-4xl mx-auto space-y-6">

                <form onSubmit={submit} className="space-y-6">

                    {/* Identitas Sekolah Card */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <Building size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Identitas Sekolah (Kop Surat)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Sekolah / Instansi</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary font-medium"
                                    value={data.nama_sekolah}
                                    onChange={e => setData('nama_sekolah', e.target.value)}
                                />
                                {errors.nama_sekolah && <div className="text-red-500 text-xs mt-1">{errors.nama_sekolah}</div>}
                                <p className="text-xs text-gray-400 mt-1">Akan muncul sebagai judul utama pada Kop Surat.</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary font-medium resize-none"
                                    value={data.alamat}
                                    onChange={e => setData('alamat', e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary font-medium"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary font-medium"
                                    value={data.website}
                                    onChange={e => setData('website', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">No. Telp</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary font-medium"
                                    value={data.notelp}
                                    onChange={e => setData('notelp', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logo & Footer Card */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                <Image size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">Logo & Format Dokumen</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Logo Kop Surat</label>
                                <div className="flex items-center gap-6">
                                    {school?.logo && (
                                        <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 p-2">
                                            <img src={`/storage/${school.logo}`} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            className="w-full text-sm text-gray-500
                                            file:mr-4 file:py-2.5 file:px-4
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-bold
                                            file:bg-primary/10 file:text-primary
                                            hover:file:bg-primary/20 cursor-pointer"
                                            onChange={e => setData('kop_surat', e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <p className="text-xs text-gray-400 mt-2">Format: PNG/JPG. Maksimal 2MB. Background transparan disarankan.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Teks Footer (Catatan Kaki)</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary focus:border-primary font-medium text-sm text-gray-600 bg-gray-50"
                                    value={data.footer_text}
                                    onChange={e => setData('footer_text', e.target.value)}
                                ></textarea>
                                <p className="text-xs text-gray-400 mt-1">Teks ini akan muncul di bagian bawah setiap surat keluar.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            <Save size={20} />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}
