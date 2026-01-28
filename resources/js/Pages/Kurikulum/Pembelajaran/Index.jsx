import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Search, CheckCircle2, User, BookOpen } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Index({ auth, kelas_list }) {
    const [selectedKelas, setSelectedKelas] = useState(kelas_list[0] || null);
    const [schedule, setSchedule] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null); // ID of subject being saved

    // Search filter for teachers
    const [teacherSearch, setTeacherSearch] = useState({});

    useEffect(() => {
        if (selectedKelas) {
            fetchData(selectedKelas.id);
        }
    }, [selectedKelas]);

    const fetchData = async (kelasId) => {
        setLoading(true);
        try {
            const response = await axios.get(route('kurikulum.pembelajaran.show', kelasId));
            const { pembelajarans, subjects, teachers } = response.data;

            setSubjects(subjects);
            setTeachers(teachers);
            setSchedule(pembelajarans);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherChange = async (subjectId, gtkId) => {
        setSaving(subjectId);

        // Optimistic Update
        setSchedule(prev => ({
            ...prev,
            [subjectId]: { ...prev[subjectId], gtk_id: gtkId }
        }));

        try {
            await axios.post(route('kurikulum.pembelajaran.store'), {
                kelas_id: selectedKelas.id,
                mata_pelajaran_id: subjectId,
                gtk_id: gtkId
            });
            // Optional: Show tiny success indicator or toast
        } catch (error) {
            console.error("Failed to save:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: 'Terjadi kesalahan saat menyimpan data guru.',
                toast: true,
                position: 'top-end',
                timer: 3000
            });
        } finally {
            setSaving(null);
        }
    };

    // Helper to filter teachers based on search
    const getFilteredTeachers = (subjectId) => {
        const query = (teacherSearch[subjectId] || '').toLowerCase();
        if (!query) return teachers;
        return teachers.filter(t => t.nama.toLowerCase().includes(query) || t.jenis_ptk?.toLowerCase().includes(query));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Distribusi Guru Mata Pelajaran</h2>}
        >
            <Head title="Distribusi Guru" />

            <div className="py-6 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Sidebar: Kelas Selection */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sticky top-6 transition-colors">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Pilih Kelas</label>
                            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                                {kelas_list.map(kelas => (
                                    <button
                                        key={kelas.id}
                                        onClick={() => setSelectedKelas(kelas)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${selectedKelas?.id === kelas.id
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                            }`}
                                    >
                                        <span className="font-medium">{kelas.nama}</span>
                                        {selectedKelas?.id === kelas.id && <CheckCircle2 size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Subject List */}
                    <div className="w-full md:w-3/4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                        Distribusi Guru: {selectedKelas?.nama}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Tentukan guru pengampu untuk setiap mata pelajaran di kelas ini.</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center text-gray-400 dark:text-gray-500 animate-pulse">
                                    Memuat data...
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {subjects.map((subject, index) => {
                                        const currentMapping = schedule[subject.id];
                                        const teacherId = currentMapping?.gtk_id || "";
                                        const isSaving = saving === subject.id;

                                        return (
                                            <div key={subject.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Subject Info */}
                                                <div className="flex-1 flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{subject.nama}</h4>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                                            {subject.kelompok || 'Umum'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Teacher Selection */}
                                                <div className="w-full sm:w-1/2 relative">
                                                    <div className="relative">
                                                        <select
                                                            value={teacherId}
                                                            onChange={(e) => handleTeacherChange(subject.id, e.target.value)}
                                                            className={`w-full rounded-lg border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary pl-10 pr-8 py-2.5 text-sm transition-all dark:text-white ${teacherId ? 'bg-white dark:bg-gray-700' : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
                                                                }`}
                                                        >
                                                            <option value="" className="dark:bg-gray-800">-- Belum ada Pengajar --</option>
                                                            {teachers.map(teacher => (
                                                                <option key={teacher.id} value={teacher.id} className="dark:bg-gray-800">
                                                                    {teacher.nama}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <User className="absolute left-3 top-2.5 text-gray-400" size={16} />

                                                        {isSaving && (
                                                            <div className="absolute right-8 top-3">
                                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
