
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, Upload, CheckCircle, Monitor } from 'lucide-react';
import ContentBox from '@/Components/ContentBox';
import FormInput from '@/Components/FormInput';

export default function PublicPage({ auth, settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        landing_hero_title: settings.landing_hero_title || 'Data Statistik Terkini',
        landing_hero_subtitle: settings.landing_hero_subtitle || 'Gambaran umum tentang populasi siswa, tenaga pengajar, dan keadaan sekolah saat ini.',
        landing_show_stats: settings.landing_show_stats === '1' || settings.landing_show_stats === true,
        landing_bg_image: null,
        landing_welcome_text: settings.landing_welcome_text || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.public-page.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Image input reset managed by browser or explicit ref if needed
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Website Sekolah</h2>}
        >
            <Head title="Pengaturan Website" />

            <div className="max-w-7xl mx-auto space-y-6">
                <ContentBox title="Konten Halaman Utama">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Judul Utama (Hero Title)"
                                value={data.landing_hero_title}
                                onChange={e => setData('landing_hero_title', e.target.value)}
                                error={errors.landing_hero_title}
                                placeholder="Contoh: Selamat Datang di SMP Al-Irsyad"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Banner</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-gray-50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setData('landing_bg_image', e.target.files[0])}
                                        className="hidden"
                                        id="bg-upload"
                                    />
                                    <label htmlFor="bg-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600">
                                        <Upload size={24} />
                                        <span className="text-sm font-medium">{data.landing_bg_image ? data.landing_bg_image.name : 'Upload Gambar Baru (Max 2MB)'}</span>
                                    </label>
                                </div>
                                {settings.landing_bg_image && !data.landing_bg_image && (
                                    <p className="text-xs text-gray-400 mt-2">Gambar saat ini: Terpasang</p>
                                )}
                                {errors.landing_bg_image && <p className="text-sm text-red-500 mt-1">{errors.landing_bg_image}</p>}
                            </div>
                        </div>

                        <FormInput
                            label="Sub-Judul (Subtitle)"
                            value={data.landing_hero_subtitle}
                            onChange={e => setData('landing_hero_subtitle', e.target.value)}
                            error={errors.landing_hero_subtitle}
                            placeholder="Deskripsi singkat di bawah judul utama"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pesan Sambutan (Welcome Message)</label>
                            <textarea
                                className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                rows="4"
                                value={data.landing_welcome_text}
                                onChange={e => setData('landing_welcome_text', e.target.value)}
                                placeholder="Teks sambutan atau deskripsi sekolah..."
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex-shrink-0">
                                <Monitor className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-blue-900">Tampilkan Statistik</h4>
                                <p className="text-xs text-blue-700">Apakah status jumlah siswa/guru ditampilkan ke publik?</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.landing_show_stats}
                                    onChange={e => setData('landing_show_stats', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </ContentBox>
            </div>
        </AuthenticatedLayout>
    );
}

