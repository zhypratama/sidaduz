import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_barang: '',
        kode_barang: '',
        kategori: '',
        kondisi: 'Baik',
        jumlah: 1,
        lokasi: '',
        deskripsi: '',
        foto: null,
        is_public: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Tambah Barang</h2>
                        <p className="text-gray-500 text-sm">Input data inventaris baru</p>
                    </div>
                    <Link
                        href={route('inventory.index')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Tambah Barang" />

            <div className="bg-white dark:bg-gray-800 rounded-[30px] p-8 shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50 mb-8 max-w-4xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* Header Image Upload */}
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors relative cursor-pointer" onClick={() => document.getElementById('foto').click()}>
                        {data.foto ? (
                            <div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden">
                                <img src={URL.createObjectURL(data.foto)} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setData('foto', null);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium text-primary">Upload Foto</span> atau drag and drop
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF max 2MB</p>
                            </div>
                        )}
                        <input
                            id="foto"
                            type="file"
                            className="hidden"
                            onChange={(e) => setData('foto', e.target.files[0])}
                            accept="image/*"
                        />
                    </div>
                    {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nama_barang" className="block text-sm font-medium text-gray-700">Nama Barang</label>
                            <input
                                id="nama_barang"
                                type="text"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.nama_barang}
                                onChange={(e) => setData('nama_barang', e.target.value)}
                                required
                            />
                            {errors.nama_barang && <p className="text-red-500 text-sm mt-1">{errors.nama_barang}</p>}
                        </div>

                        <div>
                            <label htmlFor="kode_barang" className="block text-sm font-medium text-gray-700">Kode Barang</label>
                            <input
                                id="kode_barang"
                                type="text"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.kode_barang}
                                onChange={(e) => setData('kode_barang', e.target.value)}
                                required
                            />
                            {errors.kode_barang && <p className="text-red-500 text-sm mt-1">{errors.kode_barang}</p>}
                        </div>

                        <div>
                            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700">Kategori</label>
                            <select
                                id="kategori"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Mebel">Mebel</option>
                                <option value="Bangunan">Bangunan</option>
                                <option value="Kendaraan">Kendaraan</option>
                                <option value="Alat Tulis">Alat Tulis</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                            {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
                        </div>

                        <div>
                            <label htmlFor="kondisi" className="block text-sm font-medium text-gray-700">Kondisi</label>
                            <select
                                id="kondisi"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.kondisi}
                                onChange={(e) => setData('kondisi', e.target.value)}
                                required
                            >
                                <option value="Baik">Baik</option>
                                <option value="Rusak Ringan">Rusak Ringan</option>
                                <option value="Rusak Berat">Rusak Berat</option>
                            </select>
                            {errors.kondisi && <p className="text-red-500 text-sm mt-1">{errors.kondisi}</p>}
                        </div>

                        <div>
                            <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">Jumlah</label>
                            <input
                                id="jumlah"
                                type="number"
                                min="0"
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', e.target.value)}
                                required
                            />
                            {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
                        </div>

                        <div>
                            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Lokasi Penempatan</label>
                            <input
                                id="lokasi"
                                type="text"
                                placeholder="Cth: Lab Komputer 1 ..."
                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                required
                            />
                            {errors.lokasi && <p className="text-red-500 text-sm mt-1">{errors.lokasi}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
                        <textarea
                            id="deskripsi"
                            rows="3"
                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                        />
                        {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <input
                            id="is_public"
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                            checked={data.is_public}
                            onChange={(e) => setData('is_public', e.target.checked)}
                        />
                        <div>
                            <label htmlFor="is_public" className="block text-sm font-medium text-gray-900 cursor-pointer">Tampilkan di Website Sekolah</label>
                            <p className="text-xs text-gray-500">Jika dicentang, fasilitas ini akan muncul di halaman publik sekolah.</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing ? 'Menyimpan...' : 'Simpan Barang'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
