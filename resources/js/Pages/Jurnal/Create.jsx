import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, X, Check, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Create({ auth, pembelajarans }) {
    const { data, setData, post, processing, errors } = useForm({
        pembelajaran_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        jam_ke: '',
        materi: '',
        catatan: '',
        foto_kegiatan: null,
        status_guru: 'Hadir',
        attendance: [], // Will be populated with students
    });

    const [loadingStudents, setLoadingStudents] = useState(false);
    const [students, setStudents] = useState([]);

    // Fetch students when Pembelajaran (Mapel/Kelas) is selected
    useEffect(() => {
        if (data.pembelajaran_id) {
            setLoadingStudents(true);
            axios.get(route('kurikulum.jurnal.students', data.pembelajaran_id))
                .then(res => {
                    setStudents(res.data);
                    // Initialize attendance with 'H' (Hadir) for all
                    const initialAttendance = res.data.map(s => ({
                        student_id: s.id,
                        status: 'H'
                    }));
                    setData('attendance', initialAttendance);
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingStudents(false));
        } else {
            setStudents([]);
            setData('attendance', []);
        }
    }, [data.pembelajaran_id]);

    const updateStudentStatus = (studentId, status) => {
        const updated = data.attendance.map(item =>
            item.student_id === studentId ? { ...item, status } : item
        );
        setData('attendance', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('kurikulum.jurnal.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Isi Jurnal Mengajar</h2>
                        <p className="text-gray-500 text-sm">Catat aktivitas dan absensi siswa</p>
                    </div>
                    <Link
                        href={route('kurikulum.jurnal.index')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Isi Jurnal" />

            <form onSubmit={submit} className="max-w-5xl mx-auto space-y-6 mb-12">
                {/* 1. Informasi Dasar */}
                <div className="bg-white dark:bg-gray-800 rounded-[30px] p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Informasi Pembelajaran</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran & Kelas</label>
                            <select
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                value={data.pembelajaran_id}
                                onChange={(e) => setData('pembelajaran_id', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Jadwal --</option>
                                {pembelajarans.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.mata_pelajaran?.nama_mapel} - {p.kelas?.nama_kelas}
                                    </option>
                                ))}
                            </select>
                            {errors.pembelajaran_id && <p className="text-red-500 text-sm mt-1">{errors.pembelajaran_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                required
                            />
                            {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Ke-</label>
                            <input
                                type="text"
                                placeholder="Contoh: 1-2"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                value={data.jam_ke}
                                onChange={(e) => setData('jam_ke', e.target.value)}
                                required
                            />
                            {errors.jam_ke && <p className="text-red-500 text-sm mt-1">{errors.jam_ke}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Kehadiran Guru</label>
                            <select
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                value={data.status_guru}
                                onChange={(e) => setData('status_guru', e.target.value)}
                                required
                            >
                                <option value="Hadir">Hadir</option>
                                <option value="Izin">Izin</option>
                                <option value="Sakit">Sakit</option>
                                <option value="Tugas Luar">Tugas Luar</option>
                            </select>
                            {errors.status_guru && <p className="text-red-500 text-sm mt-1">{errors.status_guru}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Kegiatan (Opsional)</label>
                            <input
                                type="file"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                onChange={(e) => setData('foto_kegiatan', e.target.files[0])}
                                accept="image/*"
                            />
                            {errors.foto_kegiatan && <p className="text-red-500 text-sm mt-1">{errors.foto_kegiatan}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Materi Pembelajaran</label>
                        <textarea
                            rows="3"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            placeholder="Ringkasan materi yang diajarkan..."
                            value={data.materi}
                            onChange={(e) => setData('materi', e.target.value)}
                            required
                        ></textarea>
                        {errors.materi && <p className="text-red-500 text-sm mt-1">{errors.materi}</p>}
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Kejadian (Opsional)</label>
                        <textarea
                            rows="2"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            placeholder="Catatan khusus, kejadian, atau kendala..."
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                        ></textarea>
                        {errors.catatan && <p className="text-red-500 text-sm mt-1">{errors.catatan}</p>}
                    </div>
                </div>

                {/* 2. Absensi Siswa */}
                {data.pembelajaran_id && (
                    <div className="bg-white dark:bg-gray-800 rounded-[30px] p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Absensi Siswa</h3>
                        {loadingStudents ? (
                            <div className="text-center py-8 text-gray-500">Memuat data siswa...</div>
                        ) : students.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map((student, index) => {
                                    const currentStatus = data.attendance.find(a => a.student_id === student.id)?.status || 'H';
                                    return (
                                        <div key={student.id} className={`p-4 rounded-xl border transition-all ${currentStatus === 'H' ? 'border-gray-200 bg-white' :
                                                currentStatus === 'S' ? 'border-blue-200 bg-blue-50' :
                                                    currentStatus === 'I' ? 'border-yellow-200 bg-yellow-50' :
                                                        currentStatus === 'A' ? 'border-red-200 bg-red-50' :
                                                            'border-gray-200 bg-gray-100' // B - Bolos
                                            }`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-bold text-gray-800">{student.nama_lengkap}</p>
                                                    <p className="text-xs text-gray-500">{student.nis || student.nipd}</p>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentStatus === 'H' ? 'bg-green-100 text-green-700' :
                                                        currentStatus === 'S' ? 'bg-blue-100 text-blue-700' :
                                                            currentStatus === 'I' ? 'bg-yellow-100 text-yellow-700' :
                                                                currentStatus === 'A' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-200 text-gray-700'
                                                    }`}>
                                                    {currentStatus === 'H' ? 'Hadir' :
                                                        currentStatus === 'S' ? 'Sakit' :
                                                            currentStatus === 'I' ? 'Izin' :
                                                                currentStatus === 'A' ? 'Alpha' : 'Bolos'}
                                                </span>
                                            </div>

                                            <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                                                {['H', 'S', 'I', 'A', 'B'].map((status) => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        onClick={() => updateStudentStatus(student.id, status)}
                                                        className={`flex-1 py-1 rounded-md text-xs font-bold transition-colors ${currentStatus === status
                                                                ? (status === 'H' ? 'bg-green-500 text-white' :
                                                                    status === 'S' ? 'bg-blue-500 text-white' :
                                                                        status === 'I' ? 'bg-yellow-500 text-white' :
                                                                            status === 'A' ? 'bg-red-500 text-white' :
                                                                                'bg-gray-500 text-white')
                                                                : 'hover:bg-gray-100 text-gray-400'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">Tidak ada siswa di kelas ini.</div>
                        )}
                    </div>
                )}

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/30 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {processing ? 'Menyimpan...' : 'Simpan Jurnal'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
