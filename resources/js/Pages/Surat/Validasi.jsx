import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, FileText, Calendar, User, Download, ShieldCheck, AlertTriangle, UserCheck, Clock } from 'lucide-react';

export default function Validasi({ surat, status, penandatangan, jabatan, validasi_info, school_name }) {
    const isValid = status === 'valid';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <Head title={`Validasi Surat - ${surat?.no_surat || 'Invalid'}`} />

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header Status */}
                <div className={`p-8 flex flex-col items-center text-center ${isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isValid ? 'bg-green-100/80 text-green-600' : 'bg-red-100/80 text-red-600'}`}>
                        {isValid ? <ShieldCheck size={48} strokeWidth={1.5} /> : <AlertTriangle size={48} strokeWidth={1.5} />}
                    </div>
                    <h1 className={`text-2xl font-bold mb-1 ${isValid ? 'text-green-800' : 'text-red-800'}`}>
                        {isValid ? 'Dokumen Valid & Asli' : 'Dokumen Tidak Valid'}
                    </h1>
                    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isValid
                            ? 'Surat ini terdaftar resmi dan telah ditandatangani secara digital.'
                            : 'Token tidak ditemukan atau surat belum disetujui dalam sistem kami.'}
                    </p>
                </div>

                {/* Surat Details */}
                {isValid && surat && (
                    <div className="p-8 space-y-6">
                        {/* Info Utama */}
                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-5">
                            <h3 className="text-gray-900 font-bold text-lg text-center border-b border-blue-200 pb-3">Informasi Dokumen</h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex gap-3">
                                    <FileText className="text-blue-500 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Nomor Surat</p>
                                        <p className="font-semibold text-gray-800 break-all">{surat.no_surat}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="text-blue-500 mt-0.5 shrink-0 font-bold text-sm">Pr</div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Perihal</p>
                                        <p className="font-semibold text-gray-800">{surat.perihal}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <User className="text-blue-500 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Tujuan</p>
                                        <p className="font-semibold text-gray-800">{surat.tujuan}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Calendar className="text-blue-500 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Tanggal Surat</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(surat.tanggal_surat).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Penandatangan & Waktu */}
                        <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100 space-y-4">
                            <h3 className="text-gray-900 font-bold text-lg text-center border-b border-green-200 pb-3">Status Pengesahan</h3>

                            <div className="flex gap-3">
                                <UserCheck className="text-green-600 mt-0.5 shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Ditandatangani Oleh</p>
                                    <p className="font-bold text-gray-900 text-lg">{penandatangan}</p>
                                    <p className="text-sm text-gray-600">{jabatan}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Clock className="text-green-600 mt-0.5 shrink-0" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Waktu Pengesahan</p>
                                    <p className="font-medium text-gray-800">Hari {validasi_info?.hari}, {validasi_info?.tanggal}</p>
                                    <p className="text-sm font-mono text-gray-600 bg-gray-100 inline-block px-1 rounded">Pukul {validasi_info?.jam}</p>
                                </div>
                            </div>
                        </div>

                        {/* PDF Smart View */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-700">Smart View Dokumen</h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">Preview</span>
                            </div>

                            <div className="w-full h-[500px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group">
                                <iframe
                                    src={route('surat-keluar.pdf-token', surat.token)}
                                    className="w-full h-full"
                                    title="Preview Surat"
                                />
                                {/* Overlay hint */}
                                <div className="absolute inset-0 pointer-events-none bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">Scroll untuk membaca</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex flex-col gap-3">
                                <a
                                    href={route('surat-keluar.pdf-token', surat.token)}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5"
                                >
                                    <Download size={20} />
                                    Download Dokumen Asli
                                </a>
                                <p className="text-center text-xs text-gray-400">
                                    Dokumen ini sah di mata hukum sesuai UU ITE No. 11 Tahun 2008.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Verifikasi keaslian surat ini dilindungi oleh sistem digital SISKO.<br />
                        &copy; {new Date().getFullYear()} {school_name || '[NAMA INSTITUSI SEKOLAH]'}
                    </p>
                </div>
            </div>
        </div>
    );
}
