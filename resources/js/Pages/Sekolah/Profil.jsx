import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, School, MapPin, User, FileText, Upload, Shield } from 'lucide-react';

export default function Profil({ auth, profile }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_sekolah: profile?.nama_sekolah || '',
        singkatan: profile?.singkatan || '',
        npsn: profile?.npsn || '',
        alamat: profile?.alamat || '',
        rt: profile?.rt || '',
        rw: profile?.rw || '',
        kelurahan: profile?.kelurahan || '',
        kecamatan: profile?.kecamatan || '',
        ijin_nomenklatur: profile?.ijin_nomenklatur || '',
        akreditasi: profile?.akreditasi || '',
        kepala_sekolah: profile?.kepala_sekolah || '',
        nip_kepala_sekolah: profile?.nip_kepala_sekolah || '',
        logo: null,
        kop_surat: null,
        _method: 'PATCH',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profil-sekolah.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Profil Sekolah</h2>
                        <p className="text-gray-500 text-sm">Kelola identitas instansi sekolah</p>
                    </div>
                </div>
            }
        >
            <Head title="Profil Sekolah" />

            <form onSubmit={submit} className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Logo & Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50 text-center sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">Logo Sekolah</h3>

                            <div className="w-40 h-40 mx-auto bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 relative group">
                                {profile?.logo ? (
                                    <img src={`/storage/${profile.logo}`} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <School size={64} className="text-gray-300" />
                                )}

                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <Upload size={24} />
                                    <span className="text-xs font-medium mt-1">Ubah Logo</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => setData('logo', e.target.files[0])}
                                    />
                                </label>
                            </div>

                            {data.logo && (
                                <p className="text-xs text-primary font-medium mb-2">File baru terpilih: {data.logo.name}</p>
                            )}
                            <p className="text-xs text-gray-500">Format: PNG/JPG. Max: 2MB.</p>
                        </div>

                        {/* Kop Surat Upload */}
                        <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50 text-center sticky top-96">
                            <h3 className="font-bold text-gray-800 mb-4">Kop Surat (Header)</h3>

                            <div className="w-full h-32 mx-auto bg-gray-50 rounded-xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 relative group">
                                {profile?.kop_surat ? (
                                    <img src={`/storage/${profile.kop_surat}`} alt="Kop Surat" className="w-full h-full object-cover" />
                                ) : (
                                    <FileText size={48} className="text-gray-300" />
                                )}

                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <Upload size={24} />
                                    <span className="text-xs font-medium mt-1">Ubah Kop Surat</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => setData('kop_surat', e.target.files[0])}
                                    />
                                </label>
                            </div>

                            {data.kop_surat && (
                                <p className="text-xs text-primary font-medium mb-2">File baru terpilih: {data.kop_surat.name}</p>
                            )}
                            <p className="text-xs text-gray-500">Gambar Header (Full Width).<br />Format: PNG/JPG. Max: 2MB.</p>
                        </div>
                    </div>

                    {/* Right Column: Form Data */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-[30px] p-8 shadow-sm shadow-gray-200/50">

                            {/* Identitas Utama */}
                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                    <School className="text-primary" size={20} /> Identitas Utama
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.nama_sekolah}
                                            onChange={e => setData('nama_sekolah', e.target.value)}
                                        />
                                        {errors.nama_sekolah && <div className="text-danger text-xs mt-1">{errors.nama_sekolah}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">NPSN</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.npsn}
                                            onChange={e => setData('npsn', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Singkatan Sekolah</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.singkatan}
                                            onChange={e => setData('singkatan', e.target.value)}
                                            placeholder="Contoh: SMP-AIB"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Akreditasi</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.akreditasi}
                                            onChange={e => setData('akreditasi', e.target.value)}
                                            placeholder="Contoh: A (Unggul)"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ijin Nomenklatur</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.ijin_nomenklatur}
                                            onChange={e => setData('ijin_nomenklatur', e.target.value)}
                                            placeholder="Nomor SK Pendirian / Operasional"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alamat Lengkap */}
                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                    <MapPin className="text-secondary" size={20} /> Alamat Lengkap
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jalan / Alamat</label>
                                        <textarea
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            rows="2"
                                            value={data.alamat}
                                            onChange={e => setData('alamat', e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">RT</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                                value={data.rt}
                                                onChange={e => setData('rt', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">RW</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                                value={data.rw}
                                                onChange={e => setData('rw', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                                value={data.kelurahan}
                                                onChange={e => setData('kelurahan', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                                value={data.kecamatan}
                                                onChange={e => setData('kecamatan', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kepala Sekolah */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                    <User className="text-green-600" size={20} /> Kepala Sekolah
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Sekolah</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.kepala_sekolah}
                                            onChange={e => setData('kepala_sekolah', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.nip_kepala_sekolah}
                                            onChange={e => setData('nip_kepala_sekolah', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-900/20"
                                >
                                    {processing ? 'Menyimpan...' : (
                                        <>
                                            <Save size={18} /> Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
