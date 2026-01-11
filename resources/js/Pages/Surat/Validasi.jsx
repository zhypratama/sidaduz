import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, FileText, Calendar, User, Download, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Validasi({ surat, status }) {
    const isValid = status === 'valid';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <Head title={`Validasi Surat - ${surat?.no_surat || 'Invalid'}`} />

            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header Status */}
                <div className={`p-8 flex flex-col items-center text-center ${isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isValid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isValid ? <ShieldCheck size={48} strokeWidth={1.5} /> : <AlertTriangle size={48} strokeWidth={1.5} />}
                    </div>
                    <h1 className={`text-2xl font-bold mb-1 ${isValid ? 'text-green-800' : 'text-red-800'}`}>
                        {isValid ? 'Dokumen Valid' : 'Dokumen Tidak Valid'}
                    </h1>
                    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isValid
                            ? 'Surat ini terdaftar resmi dalam sistem kami.'
                            : 'Token tidak ditemukan atau surat belum disetujui.'}
                    </p>
                </div>

                {/* Surat Details */}
                {isValid && surat && (
                    <div className="p-8 space-y-6">
                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="text-gray-900 font-bold text-lg mb-4 text-center border-b border-blue-200 pb-2">Detail Dokumen</h3>

                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <FileText className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Nomor Surat</p>
                                        <p className="font-medium text-gray-800">{surat.no_surat}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <div className="text-blue-500 mt-1 flex-shrink-0 font-bold text-sm">Perihal</div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Perihal</p>
                                        <p className="font-medium text-gray-800">{surat.perihal}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <User className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Tujuan</p>
                                        <p className="font-medium text-gray-800">{surat.tujuan}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <Calendar className="text-blue-500 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Tanggal Surat</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(surat.tanggal_surat).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <a
                                href={route('surat-keluar.pdf-token', surat.token)}
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-200"
                            >
                                <Download size={20} />
                                Download / Lihat Dokumen
                            </a>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Verifikasi keaslian surat ini dilindungi oleh sistem digital SISKO.
                        <br />
                        &copy; {new Date().getFullYear()} SMP Al-Irsyad Bogor
                    </p>
                </div>
            </div>
        </div>
    );
}
