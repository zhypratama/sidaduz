import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, School, MapPin, User, FileText, Upload, Shield, Server, Globe } from 'lucide-react';

export default function Profil({ auth, profile }) {
    const { base_url } = usePage().props;
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
        nuptk: profile?.nuptk || '',
        logo: null,
        login_image: null,
        kop_surat: null,
        kota: profile?.kota || '',
        propinsi: profile?.propinsi || '',
        stempel: null,
        ttd_kepala_sekolah: null,
        ttd_stempel_gabungan: null,
        tata_tertib_kartu: profile.tata_tertib_kartu || '',
        online_url: profile?.online_url || '',
        is_online_mode: profile?.is_online_mode === 1 || profile?.is_online_mode === true,
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

                    {/* Left Column: Log & Visual Assets */}
                    <div className="md:col-span-1 space-y-6">

                        {/* Logo Sekolah */}
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 text-center relative group overflow-hidden">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                                <School size={18} className="text-primary" /> Logo Sekolah
                            </h3>

                            <div className="w-40 h-40 mx-auto bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 relative">
                                {profile?.logo ? (
                                    <img src={`${base_url}/storage/${profile.logo}`} alt="Logo" className="w-full h-full object-cover" />
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
                                <p className="text-xs text-primary font-medium mb-2 bg-primary/10 py-1 px-2 rounded-full inline-block">File: {data.logo.name}</p>
                            )}
                        </div>

                        {/* Background Login */}
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 text-center relative group overflow-hidden">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                                <FileText size={18} className="text-purple-500" /> Background Login
                            </h3>

                            <div className="w-full h-32 mx-auto bg-gray-50 rounded-xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 relative">
                                {profile?.login_image ? (
                                    <img src={`${base_url}/storage/${profile.login_image}`} alt="Login Bg" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 text-xs">Default (Gedung Sekolah)</div>
                                )}

                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    <Upload size={24} />
                                    <span className="text-xs font-medium mt-1">Ubah Gambar</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => setData('login_image', e.target.files[0])}
                                    />
                                </label>
                            </div>
                            {data.login_image && (
                                <p className="text-xs text-primary font-medium mb-2 bg-primary/10 py-1 px-2 rounded-full inline-block">File: {data.login_image.name}</p>
                            )}
                        </div>

                        {/* Kop Surat */}
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50 text-center relative group overflow-hidden">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                                <FileText size={18} className="text-secondary" /> Kop Surat
                            </h3>

                            <div className="w-full h-32 mx-auto bg-gray-50 rounded-xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden mb-4 relative">
                                {profile?.kop_surat ? (
                                    <img src={`${base_url}/storage/${profile.kop_surat}`} alt="Kop Surat" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 text-xs">Belum ada Kop Surat</div>
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
                                <p className="text-xs text-primary font-medium mb-2 bg-primary/10 py-1 px-2 rounded-full inline-block">File: {data.kop_surat.name}</p>
                            )}
                        </div>

                        {/* Aset Validasi (Stempel & TTD) */}
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center gap-2 border-b pb-2">
                                <Shield size={18} className="text-green-600" /> Aset Validasi
                            </h3>

                            <div className="space-y-6">
                                {/* Row 1: Terpisah */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Stempel */}
                                    <div className="text-center group relative">
                                        <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors overflow-hidden relative">
                                            {profile?.stempel ? (
                                                <img src={`${base_url}/storage/${profile.stempel}`} alt="Stempel" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <Shield size={24} className="text-gray-300" />
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                                <Upload size={16} />
                                                <input type="file" className="hidden" accept="image/*" onChange={e => setData('stempel', e.target.files[0])} />
                                            </label>
                                        </div>
                                        <p className="text-[10px] font-semibold text-gray-600 mt-2">Stempel Saja</p>
                                        {data.stempel && <p className="text-[10px] text-primary truncate max-w-[80px] mx-auto">{data.stempel.name}</p>}
                                    </div>

                                    {/* TTD Only */}
                                    <div className="text-center group relative">
                                        <div className="w-20 h-20 mx-auto bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors overflow-hidden relative">
                                            {profile?.ttd_kepala_sekolah ? (
                                                <img src={`${base_url}/storage/${profile.ttd_kepala_sekolah}`} alt="TTD" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <User size={24} className="text-gray-300" />
                                            )}
                                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                                <Upload size={16} />
                                                <input type="file" className="hidden" accept="image/*" onChange={e => setData('ttd_kepala_sekolah', e.target.files[0])} />
                                            </label>
                                        </div>
                                        <p className="text-[10px] font-semibold text-gray-600 mt-2">TTD Saja</p>
                                        {data.ttd_kepala_sekolah && <p className="text-[10px] text-primary truncate max-w-[80px] mx-auto">{data.ttd_kepala_sekolah.name}</p>}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">ATAU</span></div>
                                </div>

                                {/* Row 2: Gabungan */}
                                <div className="text-center group relative">
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Scan Cap + TTD (Gabungan)</p>
                                    <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors overflow-hidden relative">
                                        {profile?.ttd_stempel_gabungan ? (
                                            <img src={`${base_url}/storage/${profile.ttd_stempel_gabungan}`} alt="Gabungan" className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="flex gap-1 mb-1">
                                                    <Shield size={20} className="text-gray-300" />
                                                    <span className="text-gray-300">+</span>
                                                    <User size={20} className="text-gray-300" />
                                                </div>
                                                <span className="text-[10px] text-gray-400">Belum ada file</span>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                            <Upload size={20} />
                                            <span className="text-[10px] mt-1">Upload Gabungan</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={e => setData('ttd_stempel_gabungan', e.target.files[0])} />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Disarankan menggunakan background transparan (PNG).</p>
                                    {data.ttd_stempel_gabungan && <p className="text-[10px] text-primary truncate">{data.ttd_stempel_gabungan.name}</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Form Data */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-[30px] p-8 shadow-sm shadow-gray-200/50">

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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Aplikasi Online (Opsional)</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.online_url || ''}
                                            onChange={e => setData('online_url', e.target.value)}
                                            placeholder="https://aplikasi.sekolah.sch.id"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Isi jika aplikasi diakses dari internet (untuk QR Code yang valid).</p>
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
                                        {/* Link to help or manual if needed could go here */}
                                    </div>
                                </div>
                            </div>

                            {/* Tata Tertib Kartu Settings */}
                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                                    <FileText className="text-secondary" size={20} /> Pengaturan Kartu Siswa
                                </h3>

                                <div>
                                    <InputLabel htmlFor="tata_tertib_kartu" value="Tata Tertib Kartu (Poin per baris)" />
                                    <textarea
                                        id="tata_tertib_kartu"
                                        className="mt-1 block w-full border-gray-200 focus:ring-primary focus:border-primary rounded-xl text-sm"
                                        rows="5"
                                        placeholder="- Kartu identitas resmi siswa.&#10;- Wajib dibawa setiap kegiatan sekolah."
                                        value={data.tata_tertib_kartu || ''}
                                        onChange={(e) => setData('tata_tertib_kartu', e.target.value)}
                                    ></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Gunakan tanda (-) atau angka untuk membuat daftar poin.</p>
                                    <InputError message={errors.tata_tertib_kartu} className="mt-2" />
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
                                        <div className="col-span-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                                value={data.kota}
                                                onChange={e => setData('kota', e.target.value)}
                                                placeholder="Contoh: Kota Bogor"
                                            />
                                            {errors.kota && <div className="text-danger text-xs mt-1">{errors.kota}</div>}
                                        </div>
                                        <div className="col-span-2 md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Propinsi</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                                value={data.propinsi}
                                                onChange={e => setData('propinsi', e.target.value)}
                                                placeholder="Contoh: Jawa Barat"
                                            />
                                            {errors.propinsi && <div className="text-danger text-xs mt-1">{errors.propinsi}</div>}
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
                                            placeholder="Kosongkan jika tidak ada"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">NUPTK</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                            value={data.nuptk}
                                            onChange={e => setData('nuptk', e.target.value)}
                                            placeholder="Alternatif jika NIP kosong"
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
        </AuthenticatedLayout >
    );
}
