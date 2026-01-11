import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Mail, FileText, Upload, Calendar, User, Settings } from 'lucide-react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        no_surat_pengirim: '',
        pengirim: '',
        perihal: '',
        tanggal_surat: new Date().toISOString().split('T')[0],
        tanggal_diterima: new Date().toISOString().split('T')[0],
        tujuan_divisi: '',
        file_scan: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('surat-masuk.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('surat-masuk.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800">Catat Surat Masuk</h2>
                            <p className="text-gray-500 text-sm">Arsipkan surat yang diterima sekolah</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Catat Surat Masuk" />

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar Settings (Left) */}
                <div className="space-y-6 lg:order-1 order-2">
                    <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Settings className="text-secondary" size={20} />
                            Data Surat
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat Pengirim</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 focus:ring-secondary focus:border-secondary font-mono text-sm"
                                    value={data.no_surat_pengirim}
                                    onChange={e => setData('no_surat_pengirim', e.target.value)}
                                    placeholder="No. Surat"
                                />
                                {errors.no_surat_pengirim && <div className="text-danger text-xs mt-1">{errors.no_surat_pengirim}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pengirim / Instansi</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 focus:ring-secondary focus:border-secondary"
                                    value={data.pengirim}
                                    onChange={e => setData('pengirim', e.target.value)}
                                    placeholder="Contoh: Dinas Pendidikan"
                                />
                                {errors.pengirim && <div className="text-danger text-xs mt-1">{errors.pengirim}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat</label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-gray-200 focus:ring-secondary focus:border-secondary"
                                    value={data.tanggal_surat}
                                    onChange={e => setData('tanggal_surat', e.target.value)}
                                />
                                {errors.tanggal_surat && <div className="text-danger text-xs mt-1">{errors.tanggal_surat}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Diterima</label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-gray-200 focus:ring-secondary focus:border-secondary"
                                    value={data.tanggal_diterima}
                                    onChange={e => setData('tanggal_diterima', e.target.value)}
                                />
                                {errors.tanggal_diterima && <div className="text-danger text-xs mt-1">{errors.tanggal_diterima}</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content (Right) */}
                <div className="lg:col-span-2 space-y-6 lg:order-2 order-1">
                    <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Mail className="text-primary" size={20} />
                            Konten & Arsip
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Perihal</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 focus:ring-primary focus:border-primary"
                                    rows="2"
                                    value={data.perihal}
                                    onChange={e => setData('perihal', e.target.value)}
                                    placeholder="Ringkasan isi surat..."
                                ></textarea>
                                {errors.perihal && <div className="text-danger text-xs mt-1">{errors.perihal}</div>}
                            </div>

                            {/* Upload Scan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Scan Surat</label>
                                <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${data.file_scan ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                        <Upload className={`w-10 h-10 mb-3 ${data.file_scan ? 'text-primary' : 'text-gray-400'}`} />
                                        {data.file_scan ? (
                                            <div className="text-primary font-medium">
                                                <p className="text-sm truncate max-w-xs">{data.file_scan.name}</p>
                                                <p className="text-xs opacity-70 mt-1">Klik untuk ganti file</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-gray-500 mb-1"><span className="font-semibold">Klik untuk upload</span></p>
                                                <p className="text-xs text-gray-400">PDF, JPG, PNG (Max. 2MB)</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={e => setData('file_scan', e.target.files[0])}
                                    />
                                </label>
                                {errors.file_scan && <div className="text-danger text-xs mt-1">{errors.file_scan}</div>}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg shadow-gray-900/20"
                            >
                                {processing ? 'Menyimpan...' : (
                                    <>
                                        <Save size={18} /> Simpan Arsip
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
