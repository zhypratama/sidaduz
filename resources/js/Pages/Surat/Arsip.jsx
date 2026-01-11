import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, Download, FileText, Inbox, Send, Archive } from 'lucide-react';
import { useState } from 'react';

export default function Arsip({ auth, archives, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyFilter(search, type);
        }
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        applyFilter(search, newType);
    };

    const applyFilter = (s, t) => {
        router.get(route('surat-arsip.index'), { search: s, type: t }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-2xl text-gray-800 tracking-tight">Arsip Surat</h2>
                        <p className="text-gray-500 text-sm mt-1">Pusat penyimpanan & pencarian seluruh surat sekolah</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                        <Archive className="text-primary" size={20} />
                        <span className="font-bold text-gray-700">{archives.total} Dokumen</span>
                    </div>
                </div>
            }
        >
            <Head title="Arsip Surat" />

            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
                        <button
                            onClick={() => handleTypeChange('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleTypeChange('masuk')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${type === 'masuk' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Inbox size={14} /> Masuk
                        </button>
                        <button
                            onClick={() => handleTypeChange('keluar')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${type === 'keluar' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Send size={14} /> Keluar
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari No Surat, Perihal, atau Pengirim..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 font-medium"
                            value={search}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                {/* Data Grid */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Detail Dokumen</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Entitas (Pengirim/Tujuan)</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Tipe</th>
                                <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">File</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {archives.data.length > 0 ? archives.data.map((item) => (
                                <tr key={`${item.kategori}-${item.id}`} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 bg-white p-2 rounded-lg border border-gray-100 text-gray-300">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base leading-tight mb-1">{item.perihal}</h4>
                                                <p className="text-xs font-mono text-gray-500">{item.no_surat}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                            <span className="text-sm font-semibold text-gray-700">{item.entitas || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className="text-sm text-gray-600 font-medium">
                                            {new Date(item.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${item.kategori === 'Masuk'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        {item.file_scan ? (
                                            <a
                                                href={`/storage/${item.file_scan}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-white hover:shadow-md text-gray-600 rounded-lg transition-all font-bold text-xs border border-transparent hover:border-gray-200"
                                            >
                                                <Download size={14} /> Unduh
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Tidak ada file</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="bg-gray-50 p-4 rounded-full">
                                                <Archive size={32} className="opacity-50" />
                                            </div>
                                            <p>Tidak ada arsip surat yang ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    {archives.links && archives.links.length > 3 && (
                        <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 p-1 gap-1">
                            {archives.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => router.get(link.url, { search, type }, { preserveState: true })}
                                    disabled={!link.url || link.active}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${link.active
                                            ? 'bg-primary text-white'
                                            : !link.url
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
