import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft, Trophy, ShieldAlert, Users, Calendar } from 'lucide-react';

export default function LaporanShow({ auth, student, schoolProfile }) {
    const handlePrint = () => {
        window.print();
    };

    const totalPelanggaran = student.pelanggarans?.reduce((acc, curr) => acc + (curr.poin_saat_ini || 0), 0) || 0;
    const totalPrestasi = student.prestasis?.reduce((acc, curr) => acc + (curr.poin_apresiasi || 0), 0) || 0;
    const finalScore = totalPelanggaran - totalPrestasi;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center no-print">
                    <div className="flex items-center gap-4">
                        <Link href={route('bk.laporan.index')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Raport Karakter Siswa</h2>
                            <p className="text-gray-500 text-sm">Detail perkembangan perilaku dan prestasi</p>
                        </div>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/30 transition-all"
                    >
                        <Printer size={18} />
                        Cetak Raport
                    </button>
                </div>
            }
        >
            <Head title={`Raport Karakter - ${student.nama_lengkap}`} />

            <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0 print:m-0">
                {/* Printable Header / Kop Surat (Hidden in UI, visible in print) */}
                <div className="hidden print:block text-center border-b-4 border-double border-gray-900 pb-4 mb-8">
                    <h1 className="text-2xl font-black uppercase tracking-widest">{schoolProfile?.nama_sekolah || 'DATA SEKOLAH BELUM DIATUR'}</h1>
                    <p className="text-sm italic">{schoolProfile?.alamat || '-'}</p>
                    <p className="text-sm font-bold mt-2">LAPORAN REKAPITULASI BIMBINGAN KONSELING & PRESTASI</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-[40px] p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="w-24 h-24 rounded-[30px] bg-primary/10 flex items-center justify-center text-primary text-4xl font-black shrink-0">
                            {student.nama_lengkap?.charAt(0)}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nama Lengkap</p>
                                <p className="font-black text-xl text-gray-900 dark:text-gray-100">{student.nama_lengkap}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">NIS / NISN</p>
                                <p className="font-bold text-gray-700 dark:text-gray-300">{student.nis} / {student.nisn || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kelas</p>
                                <p className="font-bold text-gray-700 dark:text-gray-300">{student.kelas?.nama}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-50 dark:border-gray-700">
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-3xl border border-red-100 dark:border-red-900/30 text-center">
                            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Total Poin Pelanggaran</p>
                            <span className="text-3xl font-black text-red-600">{totalPelanggaran}</span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Total Poin Prestasi</p>
                            <span className="text-3xl font-black text-emerald-600">{totalPrestasi}</span>
                        </div>
                        <div className={`p-4 rounded-3xl text-center border shadow-xl ${finalScore > 0 ? 'bg-red-600 border-red-700 text-white' : 'bg-emerald-600 border-emerald-700 text-white'}`}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Skor Karakter Akhir</p>
                            <span className="text-3xl font-black">{finalScore}</span>
                        </div>
                    </div>
                </div>

                {/* Details Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Violations List */}
                    <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm border border-gray-50 dark:border-gray-700">
                        <h3 className="font-black text-lg text-gray-800 dark:text-gray-100 flex items-center gap-3 mb-6">
                            <ShieldAlert className="text-red-500" size={24} />
                            Riwayat Pelanggaran
                        </h3>
                        <div className="space-y-4">
                            {student.pelanggarans?.length > 0 ? (
                                student.pelanggarans.map((p) => (
                                    <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex justify-between items-start border-l-4 border-red-500">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight">{p.jenis_pelanggaran?.nama_pelanggaran}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{p.tanggal_kejadian}</p>
                                        </div>
                                        <span className="font-black text-red-600 text-sm">+{p.poin_saat_ini}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-8 text-gray-400 italic text-sm">Tidak ada catatan pelanggaran.</p>
                            )}
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div className="bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm border border-gray-50 dark:border-gray-700">
                        <h3 className="font-black text-lg text-gray-800 dark:text-gray-100 flex items-center gap-3 mb-6">
                            <Trophy className="text-amber-500" size={24} />
                            Prestasi & Penghargaan
                        </h3>
                        <div className="space-y-4">
                            {student.prestasis?.length > 0 ? (
                                student.prestasis.map((p) => (
                                    <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex justify-between items-start border-l-4 border-amber-500">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight">{p.nama_prestasi}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{p.tingkat} • {p.tanggal}</p>
                                        </div>
                                        <span className="font-black text-emerald-600 text-sm">-{p.poin_apresiasi}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-8 text-gray-400 italic text-sm">Belum ada catatan prestasi.</p>
                            )}
                        </div>
                    </div>

                    {/* Counseling History */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[30px] p-6 shadow-sm border border-gray-50 dark:border-gray-700">
                        <h3 className="font-black text-lg text-gray-800 dark:text-gray-100 flex items-center gap-3 mb-6">
                            <Users className="text-blue-500" size={24} />
                            Log Bimbingan & Konseling
                        </h3>
                        {student.konselings?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-700">
                                            <th className="pb-3 px-2">Tanggal</th>
                                            <th className="pb-3 px-2">Layanan</th>
                                            <th className="pb-3 px-2">Masalah / Topik</th>
                                            <th className="pb-3 px-2">Hasil / Tindak Lanjut</th>
                                            <th className="pb-3 px-2">Guru/Pembimbing</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700 text-sm">
                                        {student.konselings.map((k) => (
                                            <tr key={k.id}>
                                                <td className="py-4 px-2 whitespace-nowrap font-medium">{k.tanggal_konseling}</td>
                                                <td className="py-4 px-2 tracking-tight">{k.jenis_layanan}</td>
                                                <td className="py-4 px-2 max-w-xs">{k.masalah}</td>
                                                <td className="py-4 px-2 max-w-xs">{k.hasil || '-'}</td>
                                                <td className="py-4 px-2 font-bold text-blue-600">{k.guru_bk?.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-400 italic text-sm">Tidak ada riwayat bimbingan.</p>
                        )}
                    </div>
                </div>

                {/* Print Signatures */}
                <div className="hidden print:grid grid-cols-2 gap-20 mt-20 text-center text-sm font-bold">
                    <div>
                        <p>Orang Tua / Wali Siswa</p>
                        <div className="h-24"></div>
                        <p className="border-t border-gray-900 pt-1 inline-block min-w-[200px]">( ................................ )</p>
                    </div>
                    <div>
                        <p>Guru BK / Wali Kelas</p>
                        <div className="h-24"></div>
                        <p className="border-t border-gray-900 pt-1 inline-block min-w-[200px]">{auth.user?.name}</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                    .print\\:block { display: block !important; }
                    .print\\:grid { display: grid !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:m-0 { margin: 0 !important; }
                }
            `}} />
        </AuthenticatedLayout>
    );
}
