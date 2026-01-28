import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react'; // Use router instead of useForm for custom actions
import { Calendar, Save, Trash2, User, Clock, Search, GripVertical, Plus, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Piket({ auth, gtks, pikets }) {
    // --- State ---
    const initialColumns = {
        'Senin': [], 'Selasa': [], 'Rabu': [], 'Kamis': [], 'Jumat': [], 'Sabtu': [],
        ...pikets // Override with DB data
    };

    const [columns, setColumns] = useState(initialColumns);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    // --- DnD Logic ---
    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Dropped outside
        if (!destination) return;

        // Source: GTK Sidebar (New Assignment)
        if (source.droppableId === 'gtk-sidebar') {
            const gtkId = parseInt(result.draggableId.split('-')[1]);
            const gtk = gtks.find(g => g.id === gtkId);
            const day = destination.droppableId;

            // Create new item
            const newItem = {
                id: `new-${Date.now()}`, // Temp ID
                gtk_id: gtk.id,
                gtk: gtk, // Embed complete object for display
                hari: day,
                jam_mulai: '07:00',
                jam_selesai: '15:00',
                is_new: true
            };

            const newDayList = [...columns[day], newItem];

            setColumns({
                ...columns,
                [day]: newDayList
            });
            setIsDirty(true);
            return;
        }

        // Source: Day Column (Move or Reorder)
        if (source.droppableId === destination.droppableId) {
            // Reorder in same column
            const list = [...columns[source.droppableId]];
            const [removed] = list.splice(source.index, 1);
            list.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: list
            });
            // We don't strictly need to save reordering if time is what matters, 
            // but let's flag dirty anyway.
            setIsDirty(true);
        } else {
            // Move to another day
            const sourceList = [...columns[source.droppableId]];
            const destList = [...columns[destination.droppableId]];
            const [removed] = sourceList.splice(source.index, 1);

            // Update the day property
            removed.hari = destination.droppableId;

            destList.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: sourceList,
                [destination.droppableId]: destList
            });
            setIsDirty(true);
        }
    };

    // --- Actions ---
    const handleRemove = (day, index, itemId) => {
        // Confirm?
        // If it's a real ID (from DB), we might want to delete immediately or wait for save.
        // For simplicity: Remove from UI, flag dirty. If it was real, backend needs to know to delete it?
        // Better strategy: Delete immediately via API for existing ones to keep sync simple?
        // Or: Batch sync everything. Let's do Batch Sync.
        // Actually, for delete, immediate is safer to avoid complexity of "deleted items" tracking.

        const item = columns[day][index];

        if (String(itemId).startsWith('new-')) {
            // Just local remove
            const newList = [...columns[day]];
            newList.splice(index, 1);
            setColumns({ ...columns, [day]: newList });
        } else {
            // Server remove
            if (confirm('Hapus petugas ini dari jadwal?')) {
                router.delete(route('gtk.piket.destroy', itemId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        const newList = [...columns[day]];
                        newList.splice(index, 1);
                        setColumns({ ...columns, [day]: newList });
                    }
                });
            }
        }
    };

    const handleTimeChange = (day, index, field, value) => {
        const newList = [...columns[day]];
        newList[index][field] = value;
        setColumns({
            ...columns,
            [day]: newList
        });
        setIsDirty(true);
    };

    // --- Conflict Detection ---
    const checkConflict = (day, currentItem) => {
        const list = columns[day];
        const currentStart = currentItem.jam_mulai ? parseInt(currentItem.jam_mulai.replace(':', '')) : 700;
        const currentEnd = currentItem.jam_selesai ? parseInt(currentItem.jam_selesai.replace(':', '')) : 1500;

        return list.some(other => {
            if (other.id === currentItem.id) return false; // Skip self

            const otherStart = other.jam_mulai ? parseInt(other.jam_mulai.replace(':', '')) : 700;
            const otherEnd = other.jam_selesai ? parseInt(other.jam_selesai.replace(':', '')) : 1500;

            // Simple Overlap Logic: StartA < EndB && EndA > StartB
            return (currentStart < otherEnd && currentEnd > otherStart);
        });
    };

    const handleSave = () => {
        // Check for ANY conflict
        let hasConflict = false;
        Object.keys(columns).forEach(day => {
            columns[day].forEach(item => {
                if (checkConflict(day, item)) hasConflict = true;
            });
        });

        if (hasConflict) {
            if (!confirm('Terdapat jadwal yang bentrok (waktu tumpang tindih). Apakah Anda yakin tetap ingin menyimpan?')) {
                return;
            }
        }

        // Prepare payload
        // We need to flatten columns to a list of schedules
        // Only include necessary fields
        const schedules = [];

        Object.keys(columns).forEach(day => {
            columns[day].forEach(item => {
                schedules.push({
                    id: String(item.id).startsWith('new-') ? null : item.id, // Null ID for new
                    gtk_id: item.gtk_id,
                    hari: day,
                    jam_mulai: item.jam_mulai, // Could add time inputs later
                    jam_selesai: item.jam_selesai
                });
            });
        });

        router.post(route('gtk.piket.store'), { schedules }, {
            onSuccess: () => setIsDirty(false)
        });
    };

    // Filtered GTK List
    const filteredGtks = gtks.filter(g =>
        g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.jabatan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-200">Jadwal Piket</h2>
                        <p className="text-gray-500 text-sm">Drag & Drop Guru ke Hari yang diinginkan</p>
                    </div>
                    {isDirty && (
                        <button
                            onClick={handleSave}
                            className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/30 animate-pulse hover:animate-none hover:bg-primary/90 flex items-center gap-2"
                        >
                            <Save size={18} /> Simpan Perubahan
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Jadwal Piket" />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col lg:flex-row gap-6 py-6 h-[calc(100vh-10rem)]">

                    {/* --- Sidebar Source (GTK) --- */}
                    <div className="w-full lg:w-72 bg-white dark:bg-gray-800 rounded-[30px] shadow-sm flex flex-col h-full border border-gray-100 dark:border-gray-700">
                        <div className="p-4 border-b dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                <User size={18} /> Daftar Guru
                            </h3>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari Guru..."
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-primary focus:border-primary"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <Droppable droppableId="gtk-sidebar" isDropDisabled={true}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
                                >
                                    {filteredGtks.map((gtk, index) => (
                                        <Draggable key={`gtk-${gtk.id}`} draggableId={`source-${gtk.id}`} index={index}>
                                            {(provided, snapshot) => (
                                                <>
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-grab hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200"
                                                        style={{ ...provided.draggableProps.style }}
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                            {gtk.nama.charAt(0)}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-semibold truncate dark:text-gray-200">{gtk.nama}</p>
                                                            <p className="text-xs text-gray-500 truncate">{gtk.jabatan || 'Guru'}</p>
                                                        </div>
                                                        <GripVertical size={16} className="ml-auto text-gray-300" />
                                                    </div>
                                                    {/* Clone for "Copy" effect? Pangea doesn't support clone natively easily without complex setup. 
                                                        For now, we move. If user wants to assign same person multiple times, they can find them again (if we don't remove from list).
                                                        Wait, actually, usually Drag from Sidebar REMOVES it from sidebar?
                                                        Or copies? Standard Kanban is Move. But for "Assigning", Copy is better.
                                                        However, implementing Copy in dnd-kit/react-beautiful-dnd requires a clone approach.
                                                        Let's stick to "Move" conceptual, but since we map `filteredGtks` directly from props (which don't change on drag), 
                                                        the item stays in the list VISUALLY if we don't modify `gtks` state.
                                                        Wait, `Draggable` needs unique ID. If we drag `source-1` to `Senin`, `source-1` moves there.
                                                        We need a "Clone" behavior. 
                                                        
                                                        TRICK: We keep the sidebar list immutable. We provide a `Draggable` that when dragged, 
                                                        we're actually moving a representation. 
                                                        But `react-beautiful-dnd` monitors the DOM.
                                                        
                                                        SIMPLER APPROACH for v1:
                                                        The sidebar items are draggable. When dropped on a Day, we run logic to ADD to Day.
                                                        The Sidebar item snaps back? No, `isDropDisabled={true}` on Sidebar? 
                                                        Actually, to support "Copy", usually we need `isCombineEnabled` or a library feature.
                                                        
                                                        Let's use the standard behavior: Drag moves the item.
                                                        BUT, since `gtks` prop is fixed, react might render it back?
                                                        No, the library handles the DOM.
                                                        
                                                        Let's try this:
                                                        We use a mapped ID `source-${id}`.
                                                        In `onDragEnd` from sidebar, we detect it was from sidebar.
                                                        We don't remove it from sidebar state (since we don't manage sidebar state via `columns`).
                                                        So checking if `source.droppableId === 'gtk-sidebar'` is enough.
                                                        The library might complain if the item disappears or stays?
                                                        
                                                        Actually, for "Clone" behavior in standard RBD:
                                                        It's tricky.
                                                        
                                                        ALTERNATIVE:
                                                        Just make it simple. Drag moves it. Updating the list might require refreshing the page or manual add?
                                                        No, user expects the list to stay.
                                                        
                                                        Let's rely on the fact that `filteredGtks` is re-rendered.
                                                        If we don't remove it from `filteredGtks`, it should reappear?
                                                        RBD might glitch.
                                                        
                                                        Let's try. If glitchy, we'll refine.
                                                    */}
                                                </>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>

                    {/* --- Board (Days) --- */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex gap-4 min-w-max h-full">
                            {days.map(day => (
                                <Droppable key={day} droppableId={day}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`w-64 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col h-full border transition-colors ${snapshot.isDraggingOver ? 'border-primary bg-blue-50/50' : 'border-transparent'}`}
                                        >
                                            {/* Header */}
                                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-2xl">
                                                <h4 className="font-bold text-gray-700 dark:text-gray-200">{day}</h4>
                                                <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-lg text-gray-500 font-mono">
                                                    {columns[day]?.length || 0}
                                                </span>
                                            </div>

                                            {/* List */}
                                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                                {columns[day]?.map((item, index) => {
                                                    const isConflict = checkConflict(day, item);
                                                    return (
                                                        <Draggable
                                                            key={item.id} // Must be stable unique ID
                                                            draggableId={String(item.id)}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm border group relative transition-all ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105 z-50 ring-2 ring-primary' : (isConflict ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-100 dark:border-gray-600 hover:border-primary/50')}`}
                                                                    style={{ ...provided.draggableProps.style }}
                                                                >
                                                                    {/* Remove Button */}
                                                                    <button
                                                                        onClick={() => handleRemove(day, index, item.id)}
                                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1 bg-white dark:bg-gray-800 rounded shadow-sm"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>

                                                                    <div className="flex items-center gap-3">
                                                                        {/* Avatar */}
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${isConflict ? 'bg-red-100 text-red-600' : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'}`}>
                                                                            {isConflict ? <AlertTriangle size={14} /> : item.gtk?.nama?.charAt(0)}
                                                                        </div>

                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`text-xs font-bold truncate leading-tight mb-1 ${isConflict ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                                                {item.gtk?.nama}
                                                                            </p>
                                                                            <div className="flex items-center gap-1 mt-1" onMouseDown={(e) => e.stopPropagation()}>
                                                                                <input
                                                                                    type="time"
                                                                                    className="text-[10px] p-0.5 border border-gray-200 rounded bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary h-6 w-16"
                                                                                    value={item.jam_mulai ? item.jam_mulai.substring(0, 5) : '07:00'}
                                                                                    onChange={(e) => handleTimeChange(day, index, 'jam_mulai', e.target.value)}
                                                                                />
                                                                                <span className="text-gray-400 text-[10px]">-</span>
                                                                                <input
                                                                                    type="time"
                                                                                    className="text-[10px] p-0.5 border border-gray-200 rounded bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-primary h-6 w-16"
                                                                                    value={item.jam_selesai ? item.jam_selesai.substring(0, 5) : '15:00'}
                                                                                    onChange={(e) => handleTimeChange(day, index, 'jam_selesai', e.target.value)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                                {columns[day]?.length === 0 && !snapshot.isDraggingOver && (
                                                    <div className="h-24 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                                        <Plus size={24} />
                                                        <span className="text-xs font-medium mt-1">Drop Guru Disini</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </AuthenticatedLayout>
    );
}
