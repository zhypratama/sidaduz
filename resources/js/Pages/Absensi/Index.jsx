import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, Filter, Download, Upload, BarChart2, Calendar } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

export default function Index({ auth, attendances, kelas_list, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [bulan, setBulan] = useState(filters.bulan);
    const [tahun, setTahun] = useState(filters.tahun);

    // Import Modal State
    const [isImportOpen, setIsImportOpen] = useState(false);
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, reset: resetImport, errors: importErrors } = useForm({
        file: null,
        bulan: filters.bulan,
        tahun: filters.tahun
    });

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            route('absensi.index'),
            { search: value, bulan, tahun, kelas: filters.kelas },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (key, value) => {
        router.get(
            route('absensi.index'),
            { search, bulan: key === 'bulan' ? value : bulan, tahun: key === 'tahun' ? value : tahun, kelas: key === 'kelas' ? value : filters.kelas },
            { preserveState: true, replace: true }
        );
        if (key === 'bulan') setBulan(value);
        if (key === 'tahun') setTahun(value);
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Rekap Kehadiran Siswa</h2>
                        <p className="text-gray-500 text-sm">Rekapitulasi Absensi Bulanan (Sakit, Izin, Alpha)</p>
                    </div>
                </div>
            }
        >
            <Head title="Rekap Kehadiran" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white rounded-[30px] p-6 shadow-sm shadow-gray-200/50">

                    {/* Filters & Actions */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-end lg:items-center">
                        {/* Period & Class Filter */}
                        <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                            <select
                                value={bulan}
                                onChange={(e) => handleFilter('bulan', e.target.value)}
                                className="bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer py-2.5 px-4"
                            >
                                {monthNames.map((m, i) => (
                                    <option key={i + 1} value={i + 1}>{m}</option>
                                ))}
                            </select>

                            <select
                                value={tahun}
                                onChange={(e) => handleFilter('tahun', e.target.value)}
                                className="bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer py-2.5 px-4"
                            >
                                {[2024, 2025, 2026, 2027].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            <select
                                value={filters.kelas || 'all'}
                                onChange={(e) => handleFilter('kelas', e.target.value)}
                                className="bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer py-2.5 px-4 min-w-[120px]"
                            >
                                <option value="all">Semua Kelas</option>
                                {kelas_list.map(k => (
                                    <option key={k.id} value={k.nama}>{k.nama}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search & Buttons */}
                        <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto justify-end">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari Siswa..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-gray-700 text-sm"
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>

                            <button
                                onClick={() => setIsImportOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Upload size={18} />
                                <span className="hidden sm:inline">Import Excel</span>
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-colors">
                                <Download size={18} />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary (Optional, simple cards) */}
                    {/* ... */}

                    {/* Table */}
                    <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-2xl">Siswa</th>
                                    <th className="px-6 py-4">Kelas</th>
                                    <th className="px-6 py-4 text-center">Sakit (S)</th>
                                    <th className="px-6 py-4 text-center">Izin (I)</th>
                                    <th className="px-6 py-4 text-center">Alpha (A)</th>
                                    <th className="px-6 py-4 text-center">Hadir</th>
                                    <th className="px-6 py-4 text-center rounded-tr-2xl">% Kehadiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((item) => {
                                        const totalDays = 25; // Assumption or dynamic
                                        const presence = totalDays - (item.sakit + item.izin + item.alpha);
                                        // OR use item.hadir if manually sourced

                                        return (
                                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-100">
                                                    <div>{item.student.nama_lengkap}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{item.student.nis}</div>
                                                </td>
                                                <td className="px-6 py-4 border-r border-gray-100">
                                                    <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs font-bold">
                                                        {item.student.kelas_temp}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-yellow-600 bg-yellow-50/50">{item.sakit}</td>
                                                <td className="px-6 py-4 text-center font-bold text-blue-600 bg-blue-50/50">{item.izin}</td>
                                                <td className="px-6 py-4 text-center font-bold text-red-600 bg-red-50/50">{item.alpha}</td>
                                                <td className="px-6 py-4 text-center font-bold text-green-600 bg-green-50/50">{item.hadir}</td>
                                                <td className="px-6 py-4 text-center font-mono">
                                                    {/* Percentage Placeholder */}
                                                    -
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <Calendar size={40} className="mb-2 opacity-20" />
                                                <p>Belum ada data rekap kehadiran untuk periode ini.</p>
                                                <button onClick={() => setIsImportOpen(true)} className="mt-2 text-primary hover:underline">
                                                    Upload Data Excel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center">
                        <Pagination links={attendances.links} />
                    </div>

                </div>
            </div>

            {/* Import Modal */}
            {isImportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Import Rekap Kehadiran</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            postImport(route('absensi.import'), {
                                onSuccess: () => setIsImportOpen(false)
                            });
                        }}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Periode Data</label>
                                <div className="flex gap-2">
                                    <select
                                        value={importData.bulan}
                                        onChange={e => setImportData('bulan', e.target.value)}
                                        className="w-1/2 rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                                    >
                                        {monthNames.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                                    </select>
                                    <input
                                        type="number"
                                        value={importData.tahun}
                                        onChange={e => setImportData('tahun', e.target.value)}
                                        className="w-1/2 rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">File Excel</label>
                                <input
                                    type="file"
                                    onChange={e => setImportData('file', e.target.files[0])}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept=".xlsx,.xls,.csv"
                                />
                                {importErrors.file && <div className="text-red-500 text-xs mt-1">{importErrors.file}</div>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsImportOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Batal</button>
                                <button type="submit" disabled={importProcessing} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                                    {importProcessing ? 'Mengupload...' : 'Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
