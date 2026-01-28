import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Cleaned up imports
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Save, User, FileText, Calendar, CheckSquare } from 'lucide-react';

export default function Create({ auth, pembelajarans, selectedPembelajaran, students }) {

    // Initialize form with existing data if available
    const { data, setData, post, processing, errors, reset } = useForm({
        pembelajaran_id: selectedPembelajaran?.id || '',
        judul: '',
        jenis: 'UH', // Default
        tanggal: new Date().toISOString().split('T')[0],
        scores: []
    });

    // Populate scores when students data changes (e.g. after selecting class)
    useEffect(() => {
        if (students && students.length > 0) {
            setData('scores', students.map(student => ({
                student_id: student.id,
                nilai: '',
                keterangan: ''
            })));
        }
    }, [students]);

    const handlePembelajaranChange = (e) => {
        const id = e.target.value;
        setData('pembelajaran_id', id);
        // Reload page to fetch students for this subject
        router.get(route('kurikulum.nilai.create'), { pembelajaran_id: id }, {
            preserveState: true, // Keep form state if possible, but actually we want to reset mostly?
            preserveScroll: true,
            only: ['students', 'selectedPembelajaran']
        });
    };

    const handleScoreChange = (index, field, value) => {
        const newScores = [...data.scores];
        newScores[index] = { ...newScores[index], [field]: value };
        setData('scores', newScores);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('kurikulum.nilai.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Input Nilai Harian</h2>}
        >
            <Head title="Input Nilai" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    <form onSubmit={submit} className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100 p-6 sm:p-8">

                        {/* 1. Header & Configuration */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-blue-600" />
                                Konfigurasi Penilaian
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Mata Pelajaran Select */}
                                <div>
                                    <InputLabel value="Mata Pelajaran & Kelas" className="mb-2" />
                                    <select
                                        value={data.pembelajaran_id}
                                        onChange={handlePembelajaranChange}
                                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                    >
                                        <option value="">-- Pilih Mata Pelajaran --</option>
                                        {pembelajarans.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.mata_pelajaran?.nama} - Kelas {p.kelas?.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.pembelajaran_id} className="mt-2" />
                                </div>

                                {/* Judul Penilaian */}
                                <div>
                                    <InputLabel value="Judul Penilaian" className="mb-2" />
                                    <TextInput
                                        placeholder="Contoh: Ulangan Harian Bab 1"
                                        className="w-full"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.judul} className="mt-2" />
                                </div>

                                {/* Jenis & Tanggal */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Jenis" className="mb-2" />
                                        <select
                                            value={data.jenis}
                                            onChange={(e) => setData('jenis', e.target.value)}
                                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                        >
                                            <option value="UH">Ulangan Harian</option>
                                            <option value="Tugas">Tugas</option>
                                            <option value="UTS">UTS / PTS</option>
                                            <option value="UAS">UAS / PAS</option>
                                            <option value="Praktek">Praktek</option>
                                            <option value="Proyek">Proyek</option>
                                            <option value="Sikap">Sikap</option>
                                        </select>
                                    </div>
                                    <div>
                                        <InputLabel value="Tanggal" className="mb-2" />
                                        <div className="relative">
                                            <TextInput
                                                type="date"
                                                className="w-full pl-10"
                                                value={data.tanggal}
                                                onChange={(e) => setData('tanggal', e.target.value)}
                                            />
                                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Students List & Inputs */}
                        {selectedPembelajaran ? (
                            students.length > 0 ? (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <User size={20} className="text-blue-600" />
                                            Daftar Siswa Kelas {selectedPembelajaran.kelas?.nama_kelas}
                                        </h3>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            Total: {students.length} Siswa
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">No</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Nilai (0-100)</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan (Opsional)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {students.map((student, index) => (
                                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-gray-900">{student.nama_lengkap}</div>
                                                            <div className="text-xs text-gray-500">{student.nisn || student.nis}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-semibold text-center"
                                                                placeholder="0"
                                                                value={data.scores[index]?.nilai || ''}
                                                                onChange={(e) => handleScoreChange(index, 'nilai', e.target.value)}
                                                                tabIndex={index + 1}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="text"
                                                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-600"
                                                                placeholder="Catatan..."
                                                                value={data.scores[index]?.keterangan || ''}
                                                                onChange={(e) => handleScoreChange(index, 'keterangan', e.target.value)}
                                                                tabIndex={students.length + index + 1}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="sticky bottom-4  mt-8 flex justify-end">
                                        <PrimaryButton
                                            disabled={processing}
                                            className="px-8 py-3 text-base shadow-xl shadow-blue-600/20"
                                        >
                                            <Save size={18} className="mr-2" />
                                            Simpan Semua Nilai
                                        </PrimaryButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada siswa</h3>
                                    <p className="mt-1 text-sm text-gray-500">Tidak ada siswa yang terdaftar di kelas ini.</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-100">
                                <CheckSquare className="mx-auto h-12 w-12 text-blue-400 mb-2" />
                                <h3 className="text-lg font-bold text-blue-900">Pilih Mata Pelajaran Terlebih Dahulu</h3>
                                <p className="text-blue-600">Silakan pilih mata pelajaran di bagian atas untuk memuat daftar siswa.</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
