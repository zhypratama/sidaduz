import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon,
    RefreshCw, Trash, Save, Info, CheckCircle, AlertCircle
} from 'lucide-react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO
} from 'date-fns';
import { id } from 'date-fns/locale';
import FormInput from '@/Components/FormInput';

export default function Index({ auth, events }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        title: '',
        start: '',
        end: '',
        all_day: true,
        type: 'kegiatan',
        description: '',
        is_holiday: false,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Event Categories & Colors
    const categories = [
        { value: 'kegiatan', label: 'Kegiatan Sekolah', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', bgSoft: 'bg-blue-50' },
        { value: 'libur', label: 'Hari Libur', color: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', bgSoft: 'bg-red-50' },
        { value: 'ujian', label: 'Ujian / Asesmen', color: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', bgSoft: 'bg-amber-50' },
        { value: 'rapat', label: 'Rapat Dinas', color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', bgSoft: 'bg-emerald-50' },
    ];

    const openModal = (input = null) => {
        if (input && input.id) {
            // Edit
            setData({
                id: input.id,
                title: input.title,
                start: input.start.split(' ')[0],
                end: input.end ? input.end.split(' ')[0] : '',
                all_day: input.allDay,
                type: input.extendedProps.type || 'kegiatan',
                description: input.extendedProps.description,
                is_holiday: input.extendedProps.is_holiday || false
            });
            setSelectedDate(new Date(input.start));
        } else if (input instanceof Date) {
            // New
            reset();
            const dateStr = format(input, 'yyyy-MM-dd');
            setData({
                ...data,
                id: null,
                start: dateStr,
                type: 'kegiatan' // Default
            });
            setSelectedDate(input);
        } else {
            // New Today
            reset();
            setData({
                ...data,
                id: null,
                start: format(new Date(), 'yyyy-MM-dd'),
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        // Auto-set holiday boolean if type is libur
        if (data.type === 'libur') {
            data.is_holiday = true;
        }

        if (data.id) {
            patch(route('kurikulum.kalender.update', data.id), { onSuccess: closeModal });
        } else {
            post(route('kurikulum.kalender.store'), { onSuccess: closeModal });
        }
    };

    const handleDelete = () => {
        if (confirm('Hapus agenda ini?')) {
            destroy(route('kurikulum.kalender.destroy', data.id), { onSuccess: closeModal });
        }
    };

    const handleSync = () => {
        if (confirm('Fitur ini akan menambahkan agenda dari referensi Kalender Pendidikan Jawa Barat 2024/2025 ke kalender Anda. Lanjutkan?')) {
            router.post(route('kurikulum.kalender.sync'));
        }
    };

    const getEventsForDay = (day) => {
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800">Kalender Akademik</h2>
                        <p className="text-gray-500 text-sm">Visualisasi agenda pendidikan standar nasional</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSync}
                            className="bg-white text-gray-700 px-4 py-2 rounded-xl border border-gray-200 font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw size={16} />
                            Sync Referensi
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-primary/30 text-sm font-medium"
                        >
                            <Plus size={18} />
                            Agenda Baru
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Kalender Akademik" />

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-200px)]">

                {/* Visual Editor & Legend Sidebar */}
                <div className="w-full lg:w-72 flex flex-col gap-6 shrink-0 order-2 lg:order-1">

                    {/* Mini Calendar / Date Picker Navigation could go here, but focusing on Legend/Smart Tools */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Info size={18} className="text-primary" />
                            Keterangan Warna
                        </h3>
                        <div className="space-y-3">
                            {categories.map(cat => (
                                <div key={cat.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                                    reset();
                                    setData({ ...data, type: cat.value });
                                    setIsModalOpen(true);
                                }}>
                                    <div className={`w-4 h-4 rounded-full ${cat.color} shadow-sm ring-2 ring-white`}></div>
                                    <span className="text-sm font-medium text-gray-600">{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-5">
                        <h3 className="font-bold text-primary mb-2 text-sm">Smart Visual Editor</h3>
                        <p className="text-xs text-gray-500 mb-4">
                            Klik pada tanggal di kalender untuk menambahkan agenda. Gunakan tombol "Sync Referensi" untuk memuat kalender pendidikan standar.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pintasan</div>
                            <button onClick={goToToday} className="text-left px-3 py-2 bg-white rounded-lg text-sm text-gray-700 border border-gray-100 hover:border-primary/50 transition-colors">
                                Lompat ke Hari Ini
                            </button>
                            <button onClick={() => setCurrentDate(new Date('2024-07-01'))} className="text-left px-3 py-2 bg-white rounded-lg text-sm text-gray-700 border border-gray-100 hover:border-primary/50 transition-colors">
                                Awal Tahun Ajaran (Juli)
                            </button>
                        </div>
                    </div>

                    {/* Daftar Agenda Bulan Ini */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1 overflow-hidden flex flex-col min-h-[300px]">
                        <h3 className="font-bold text-gray-800 mb-4 text-sm flex items-center justify-between shrink-0">
                            <span>Agenda {format(currentDate, 'MMMM yyyy', { locale: id })}</span>
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{events.filter(e => isSameMonth(new Date(e.start), currentDate)).length} Agenda</span>
                        </h3>
                        <div className="space-y-3 overflow-y-auto pr-1">
                            {events
                                .filter(e => isSameMonth(new Date(e.start), currentDate))
                                .sort((a, b) => new Date(a.start) - new Date(b.start))
                                .map(event => {
                                    const cat = categories.find(c => c.value === event.extendedProps.type) || categories[0];
                                    const isPast = new Date(event.start) < new Date().setHours(0, 0, 0, 0);
                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() => openModal(event)}
                                            className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start group ${isPast ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-gray-100 hover:border-primary/30 hover:shadow-sm'}`}
                                        >
                                            <div className={`shrink-0 w-10 h-10 rounded-lg ${cat.bgSoft} flex flex-col items-center justify-center border ${cat.border}`}>
                                                <span className={`text-[10px] uppercase font-bold ${cat.text}`}>{format(new Date(event.start), 'MMM')}</span>
                                                <span className={`text-sm font-bold ${cat.text}`}>{format(new Date(event.start), 'd')}</span>
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors line-clamp-2`}>{event.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${cat.bgSoft} ${cat.text} font-medium`}>{cat.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            {events.filter(e => isSameMonth(new Date(e.start), currentDate)).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Belum ada agenda bulan ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Calendar View */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col order-1 lg:order-2">
                    {/* Header Controls */}
                    <div className="p-6 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                {format(currentDate, 'MMMM yyyy', { locale: id })}
                            </h2>
                        </div>
                        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                            <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm transition-all"><ChevronLeft size={20} className="text-gray-600" /></button>
                            <div className="w-px bg-gray-200"></div>
                            <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm transition-all"><ChevronRight size={20} className="text-gray-600" /></button>
                        </div>
                    </div>

                    {/* Desktop/Tablet Grid - "Official Calendar" Style */}
                    <div className="flex-1 overflow-auto">
                        <div className="min-w-[700px]">
                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50">
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, i) => (
                                    <div key={day} className={`py-3 text-center text-xs font-bold uppercase tracking-wider ${i === 6 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
                                {calendarDays.map((day, dayIdx) => {
                                    const dayEvents = getEventsForDay(day);
                                    // Determine predominant type for background coloring if it's a full-day event (standard for kaldik)
                                    // Priority: Libur > Ujian > Kegiatan
                                    const holidayEvent = dayEvents.find(e => e.extendedProps.type === 'libur');
                                    const examEvent = dayEvents.find(e => e.extendedProps.type === 'ujian');

                                    // Base styles
                                    let bgClass = 'bg-white';
                                    let textClass = 'text-gray-700';

                                    if (holidayEvent) {
                                        bgClass = 'bg-red-50';
                                        textClass = 'text-red-700';
                                    } else if (examEvent) {
                                        bgClass = 'bg-amber-50';
                                        textClass = 'text-amber-800';
                                    } else if (!isSameMonth(day, monthStart)) {
                                        bgClass = 'bg-gray-50/30';
                                        textClass = 'text-gray-300';
                                    }

                                    const isTodayDate = isToday(day);

                                    return (
                                        <div
                                            key={day.toString()}
                                            className={`relative min-h-[140px] p-2 transition-all hover:brightness-95 cursor-pointer flex flex-col gap-1 ${bgClass}`}
                                            onClick={() => openModal(day)}
                                        >
                                            {/* Date Number */}
                                            <div className="flex justify-between items-start">
                                                <span className={`text-lg font-bold ${isTodayDate ? 'bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md' : textClass}`}>
                                                    {format(day, 'd')}
                                                </span>
                                            </div>

                                            {/* Events List */}
                                            <div className="flex flex-col gap-1 mt-1">
                                                {dayEvents.map(event => {
                                                    const cat = categories.find(c => c.value === event.extendedProps.type) || categories[0];
                                                    return (
                                                        <div
                                                            key={event.id}
                                                            className={`text-[10px] sm:text-xs rounded px-1.5 py-1 ${cat.bgSoft} ${cat.text} border ${cat.border} font-medium truncate`}
                                                            title={event.title}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openModal(event);
                                                            }}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-100 transition-all">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">{data.id ? 'Edit Agenda' : 'Tambah Agenda'}</h3>
                                <p className="text-xs text-gray-500">
                                    {data.id ? 'Perbarui detail agenda' : 'Jadwalkan agenda baru'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">&times;</button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={submit} className="p-6 space-y-5">
                            {/* Type Selection - Visual */}
                            <div className="grid grid-cols-4 gap-3">
                                {categories.map(cat => (
                                    <div
                                        key={cat.value}
                                        onClick={() => setData('type', cat.value)}
                                        className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${data.type === cat.value
                                            ? `border-${cat.color.replace('bg-', '')} bg-gray-50`
                                            : 'border-transparent hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full mx-auto mb-2 ${cat.color}`}></div>
                                        <div className="text-[10px] font-bold text-gray-600">{cat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <FormInput
                                label="Judul Agenda"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Contoh: Libur Semester"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Mulai"
                                    type="date"
                                    value={data.start}
                                    onChange={e => setData('start', e.target.value)}
                                    required
                                />
                                <FormInput
                                    label="Selesai"
                                    type="date"
                                    value={data.end}
                                    onChange={e => setData('end', e.target.value)}
                                    placeholder="(Opsional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                                <textarea
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm min-h-[80px]"
                                    rows="3"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                ></textarea>
                            </div>

                            {/* Additional Options */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.all_day}
                                        onChange={e => setData('all_day', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-600">Sepanjang Hari</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_holiday}
                                        onChange={e => setData('is_holiday', e.target.checked)} // Manual override
                                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-600">Libur Nasional</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                {data.id ? (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Trash size={16} /> Hapus
                                    </button>
                                ) : <div></div>}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <Save size={18} /> Simpan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
