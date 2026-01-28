import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { Search, Save, Trash2, BookOpen, Clock, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Index({ auth, kelas_list }) {
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [schedule, setSchedule] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Days and Times Configuration
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    const timeSlots = Array.from({ length: 10 }, (_, i) => i + 1); // 1 to 10

    const fetchSchedule = async (kelasId) => {
        if (!kelasId) return;
        setLoading(true);
        try {
            // Updated: Also fetch distribution data to show teacher name in subject list
            const response = await axios.get(route('kurikulum.jadwal.show', kelasId));
            const { jadwal, subjects } = response.data;

            // Note: subjects now should ideally contain default teacher info, but for now we rely on backend auto-assign.
            // Or we could fetch /pembelajaran/show/{kelasId} to get the mapping.
            // Let's stick to the current flow: simple names.

            setSubjects(subjects);

            // Transform schedule array to object map: "Senin-1" => { subject, teacher }
            const scheduleMap = {};
            jadwal.forEach(item => {
                const key = `${item.hari}-${item.jam_ke}`;
                scheduleMap[key] = item;
            });
            setSchedule(scheduleMap);

        } catch (error) {
            console.error("Error loading schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedKelas) {
            fetchSchedule(selectedKelas.id);
        }
    }, [selectedKelas]);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        // Ensure dropping onto a valid slot
        if (!destination.droppableId.includes('-')) return;

        const [day, time] = destination.droppableId.split('-');

        // Find subject details
        const subject = subjects.find(s => s.id.toString() === draggableId);
        if (!subject) return;

        // Optimistic UI Update
        const newSchedule = { ...schedule };
        const key = `${day}-${time}`;

        newSchedule[key] = {
            ...newSchedule[key],
            mata_pelajaran: subject,
            mata_pelajaran_id: subject.id,
            hari: day,
            jam_ke: parseInt(time)
        };

        setSchedule(newSchedule);
        setSaving(true);

        try {
            await axios.post(route('kurikulum.jadwal.store'), {
                kelas_id: selectedKelas.id,
                mata_pelajaran_id: subject.id,
                hari: day,
                jam_ke: parseInt(time),
                guru_id: null // Backend will auto-fill from Pembelajaran table
            });
            // Swal.fire({ icon: 'success', title: 'Tersimpan', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        } catch (error) {
            console.error("Failed to save:", error);
            // Revert on error could be implemented here
            Swal.fire({ icon: 'error', title: 'Gagal menyimpan', text: 'Terjadi kesalahan server' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (day, time) => {
        const key = `${day}-${time}`;
        if (!schedule[key]) return;

        // Optimistic UI remove
        const newSchedule = { ...schedule };
        delete newSchedule[key];
        setSchedule(newSchedule);

        try {
            await axios.delete(route('kurikulum.jadwal.destroy'), {
                data: {
                    kelas_id: selectedKelas.id,
                    hari: day,
                    jam_ke: parseInt(time)
                }
            });
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Jadwal Pelajaran (Smart Builder)</h2>}
        >
            <Head title="Penyusun Jadwal" />

            <div className="py-6 px-4 max-w-7xl mx-auto">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">

                        {/* LEFT: Sidebar Control */}
                        <div className="w-full lg:w-1/4 flex flex-col gap-4">
                            {/* Class Selector */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kelas</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                                    onChange={(e) => setSelectedKelas(kelas_list.find(k => k.id == e.target.value))}
                                    value={selectedKelas?.id || ''}
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelas_list.map(kelas => (
                                        <option key={kelas.id} value={kelas.id}>{kelas.nama}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subjects List (Draggable Source) */}
                            {selectedKelas && (
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <BookOpen size={18} /> Mata Pelajaran
                                    </h3>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                                        <Droppable droppableId="subjects-source" isDropDisabled={true}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                                    {subjects.map((subject, index) => (
                                                        <Draggable key={subject.id} draggableId={subject.id.toString()} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`p-3 rounded-lg border ${snapshot.isDragging ? 'bg-primary text-white shadow-lg rotate-2' : 'bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-white'} cursor-grab active:cursor-grabbing transition-all mb-2 flex items-center justify-between group`}
                                                                    style={{ ...provided.draggableProps.style }}
                                                                >
                                                                    <span className="font-medium text-sm">{subject.nama}</span>
                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {/* <Grid size={14} /> */}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Schedule Grid (Target) */}
                        <div className="w-full lg:w-3/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-auto relative">
                            {!selectedKelas ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 z-10">
                                    <Calendar size={48} className="mb-4 opacity-50" />
                                    <p>Silakan pilih kelas terlebih dahulu untuk mengatur jadwal.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-gray-800">Jadwal: {selectedKelas.nama}</h3>
                                            {saving && <span className="text-xs text-primary animate-pulse flex items-center gap-1"><Save size={12} /> Menyimpan...</span>}
                                        </div>
                                    </div>

                                    <div className="min-w-[800px]">
                                        <div className="grid grid-cols-6 gap-2 mb-2">
                                            <div className="font-bold text-center text-gray-400 text-xs uppercase bg-gray-50 p-2 rounded">Jam</div>
                                            {days.map(day => (
                                                <div key={day} className="font-bold text-center text-gray-700 text-sm bg-blue-50/50 p-2 rounded uppercase tracking-wider">{day}</div>
                                            ))}
                                        </div>

                                        {timeSlots.map(time => (
                                            <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                                                {/* Time Label */}
                                                <div className="flex items-center justify-center font-mono text-xs font-bold text-gray-400 bg-gray-50 rounded">
                                                    {time}
                                                </div>

                                                {/* Day Slots */}
                                                {days.map(day => {
                                                    const key = `${day}-${time}`;
                                                    const item = schedule[key];

                                                    return (
                                                        <Droppable key={key} droppableId={key}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.droppableProps}
                                                                    className={`min-h-[80px] rounded-lg border-2 transition-all relative group
                                                                         ${snapshot.isDraggingOver ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-dashed border-gray-200 bg-white hover:border-gray-300'}
                                                                         ${item ? 'border-solid border-l-4 border-l-secondary bg-white shadow-sm' : ''}
                                                                     `}
                                                                >
                                                                    {item ? (
                                                                        <div className="p-2 h-full flex flex-col justify-between">
                                                                            <div>
                                                                                <div className="font-bold text-xs text-gray-800 line-clamp-2">{item.mata_pelajaran?.nama}</div>
                                                                                {/* <div className="text-[10px] text-gray-500 mt-1">{item.guru?.name || 'Belum ada guru'}</div> */}
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleDelete(day, time)}
                                                                                className="self-end text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                                                title="Hapus"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            {/* Optional placeholder icon */}
                                                                        </div>
                                                                    )}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </DragDropContext>
            </div>
        </AuthenticatedLayout>
    );
}
