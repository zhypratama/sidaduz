import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Printer, Search, Filter, CheckSquare, Square, QrCode, Download, RotateCcw } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import { QRCodeSVG } from 'qrcode.react';

// --- Smart Card Component ---
const StudentCard = ({ student, isSelected, onToggle, schoolName }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // ID Card Standard Ratio: 85.6mm x 53.98mm (approx 1.58)
    return (
        <div className="relative group perspective-1000 w-full aspect-[1.58/1]">
            {/* Selection Checkbox (Absolute Top-Right) */}
            <div
                className={`absolute top-2 right-2 z-50 cursor-pointer p-1 rounded-full bg-white/50 backdrop-blur-sm transition-all hover:bg-white ${isSelected ? 'text-primary' : 'text-gray-400'}`}
                onClick={(e) => { e.stopPropagation(); onToggle(student.id); }}
            >
                {isSelected ? <CheckSquare size={24} fill="currentColor" className="text-blue-600" /> : <Square size={24} />}
            </div>

            {/* Flip Button */}
            <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute bottom-2 right-2 z-50 p-1.5 rounded-full bg-white/80 text-gray-600 hover:text-primary hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                title="Putar Kartu"
            >
                <RotateCcw size={16} />
            </button>

            {/* Card Container (Preserve 3D) */}
            <div
                className={`w-full h-full relative transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => onToggle(student.id)}
            >
                {/* --- FRONT SIDE --- */}
                <div className="absolute inset-0 backface-hidden w-full h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="h-[30%] w-full bg-[#1e3a8a] border-b-4 border-[#fbbf24] relative flex items-center px-4">
                        <div className="w-10 h-10 bg-white rounded-full p-0.5 flex items-center justify-center mr-3 shrink-0">
                            <img src="/images/logo-sekolah.png" className="h-8 w-auto" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <div className="text-white">
                            <h1 className="text-[10px] font-bold uppercase tracking-wider leading-tight text-shadow">{schoolName || '[NAMA INSTITUSI SEKOLAH]'}</h1>
                            <h2 className="text-[7px] uppercase tracking-[0.2em] opacity-90 mt-0.5">Kartu Tanda Siswa</h2>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="h-[70%] w-full p-4 flex gap-3">
                        {/* Photo */}
                        <div className="w-[28%] h-[85%] bg-gray-100 border border-gray-300 rounded overflow-hidden relative shrink-0">
                            {student.foto ? (
                                <img src={`/storage/${student.foto}`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold bg-[#f3f4f6]">?</div>
                            )}
                        </div>

                        {/* Data */}
                        <div className="flex-1 pt-0.5">
                            <div className="border-b border-[#1e3a8a] mb-1.5 pb-0.5">
                                <h3 className="font-bold text-[#111827] text-xs uppercase truncate leading-tight">{student.nama_lengkap}</h3>
                            </div>

                            <table className="w-full text-[8px] text-gray-700 leading-tight">
                                <tbody>
                                    <tr>
                                        <td className="w-12 text-gray-500 py-0.5">NISN/NIS</td>
                                        <td className="w-2 text-center">:</td>
                                        <td className="font-bold">{student.nisn || '-'}/{student.nipd || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-12 text-gray-500 py-0.5">Kelas</td>
                                        <td className="w-2 text-center">:</td>
                                        <td className="font-bold">{student.kelas?.nama}</td>
                                    </tr>
                                    <tr>
                                        <td className="w-12 text-gray-500 py-0.5">TTL</td>
                                        <td className="w-2 text-center">:</td>
                                        <td className="font-bold truncate">
                                            {student.tempat_lahir}, {student.tanggal_lahir ? new Date(student.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-12 text-gray-500 py-0.5">Berlaku</td>
                                        <td className="w-2 text-center">:</td>
                                        <td className="font-bold">Selama menjadi siswa</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Date */}
                    <div className="absolute bottom-2 right-3 text-[7px] text-[#1e3a8a] font-bold text-right leading-tight">
                        <span className="text-gray-400 block font-normal text-[6px]">Dicetak pada</span>
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>

                {/* --- BACK SIDE --- */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 w-full h-full bg-[#f9fafb] rounded-xl shadow-md overflow-hidden border border-gray-200 p-4 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <img src="/images/logo-sekolah.png" className="w-32 grayscale" />
                    </div>

                    <div className="flex h-full relative z-10 gap-3">
                        {/* QR Section */}
                        <div className="w-[40%] flex flex-col items-center justify-center border-r border-dashed border-gray-300 pr-2">
                            <div className="bg-white p-2 border border-gray-200 rounded mb-1">
                                <QRCodeSVG
                                    value={student.nisn || student.nipd || student.id.toString()}
                                    size={64}
                                    level="H"
                                    className="w-full h-auto"
                                />
                            </div>
                            <span className="font-mono text-[8px] font-bold tracking-widest text-gray-600">{student.nipd}</span>
                        </div>

                        {/* Rules & Sign */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="bg-white/80 p-2 rounded border border-gray-200 border-dashed backdrop-blur-sm">
                                <h4 className="text-[7px] font-bold uppercase border-b border-gray-300 mb-1 pb-0.5">Tata Tertib Kartu</h4>
                                <ul className="text-[6px] list-disc list-inside text-gray-600 leading-tight space-y-0.5">
                                    <li>Kartu identitas resmi siswa.</li>
                                    <li>Wajib dibawa ke sekolah.</li>
                                    <li>Dilarang meminjamkan ke orang lain.</li>
                                    <li>Hilang/rusak lapor Tata Usaha.</li>
                                </ul>
                            </div>

                            <div className="text-right pt-2 relative">
                                <p className="text-[7px] mb-6 mr-4">Bogor, {new Date().getFullYear()}</p>

                                {/* Stempel & TTD Mockup (In Real App, fetch from props) */}
                                {/* Since we don't have access to global props easily here without Prop drilling or context, we might skip actual image unless passed */}

                                <div className="border-b border-gray-800 w-24 ml-auto mb-0.5 relative">
                                    {/* Placeholder for visual consistency with PDF */}
                                </div>
                                <p className="text-[7px] font-bold mr-2 uppercase">Kepala Sekolah</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Styles */}
            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .text-shadow { text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
};

export default function Index({ auth, students, kelas_list, filters, profile }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas || 'all');

    // Debounce Search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('siswa.kartu.index'), {
                    search: search,
                    kelas: selectedKelas
                }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleKelasChange = (e) => {
        const val = e.target.value;
        setSelectedKelas(val);
        router.get(route('siswa.kartu.index'), {
            search: search,
            kelas: val
        }, { preserveState: true, replace: true });
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === students.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.data.map(s => s.id));
        }
    };

    const handlePrint = (mode = 'selected') => {
        let url = route('siswa.kartu.print');
        let params = {};

        if (mode === 'selected') {
            if (selectedIds.length === 0) return alert('Pilih siswa terlebih dahulu!');
            params.ids = selectedIds.join(',');
        } else if (mode === 'class') {
            if (selectedKelas === 'all' || !selectedKelas) return alert('Pilih kelas terlebih dahulu!');
            params.kelas = selectedKelas;
        }

        // Open in new tab
        const queryString = new URLSearchParams(params).toString();
        window.open(`${url}?${queryString}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">Kartu Pelajar</h2>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <span className="text-sm font-medium text-blue-600 mr-2 bg-blue-50 px-3 py-1 rounded-lg">
                                {selectedIds.length} terpilih
                            </span>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePrint('selected')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedIds.length > 0 ? 'bg-primary text-white shadow-lg hover:bg-primary/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                <Printer size={16} /> Cetak ({selectedIds.length})
                            </button>
                            <button
                                onClick={() => handlePrint('class')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            >
                                <Download size={16} /> Cetak Satu Kelas
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Kartu Siswa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <TextInput
                                className="w-full pl-10"
                                placeholder="Cari nama siswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <select
                                className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={selectedKelas}
                                onChange={handleKelasChange}
                            >
                                <option value="all">Semua Kelas</option>
                                {kelas_list.map(k => (
                                    <option key={k.id} value={k.nama}>{k.nama}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={toggleSelectAll}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap"
                        >
                            {selectedIds.length === students.data.length ? 'Batal Pilih' : 'Pilih Semua'}
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {students.data.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                isSelected={selectedIds.includes(student.id)}
                                onToggle={toggleSelect}
                                schoolName={profile?.nama_sekolah}
                            />
                        ))}
                    </div>

                    {students.data.length === 0 && (
                        <div className="text-center py-20 text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-dashed">
                            <Filter size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Tidak ada data siswa ditemukan.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-center">
                        {/* Simple Pagination Implementation or use Component */}
                        {students.links && <Pagination links={students.links} />}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
