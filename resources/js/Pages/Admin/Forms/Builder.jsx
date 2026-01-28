import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Save, Plus, Trash, ArrowLeft, Move, Type, AlignLeft, CheckSquare, List as ListIcon, FileText, Settings, Calendar, Globe, Power } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Builder({ auth, form }) {
    const [activeTab, setActiveTab] = useState('builder'); // builder, settings
    const [fields, setFields] = useState(form.fields || []);

    // Form for Settings
    const { data: settingsData, setData: setSettingsData, put: putSettings, processing: processingSettings } = useForm({
        settings: true,
        title: form.title,
        description: form.description,
        is_active: Boolean(form.is_active),
        is_public: Boolean(form.is_public),
        start_at: form.start_at || '',
        end_at: form.end_at || '',
    });

    // Save Fields Logic
    const [savingFields, setSavingFields] = useState(false);

    const saveFields = () => {
        setSavingFields(true);
        router.put(route('forms.update', form.id), {
            fields: fields
        }, {
            onSuccess: () => {
                setSavingFields(false);
                Swal.fire('Tersimpan', 'Struktur formulir berhasil diperbarui!', 'success');
            },
            onError: () => {
                setSavingFields(false);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan.', 'error');
            }
        });
    };

    const addField = (type) => {
        const newField = {
            id: 'temp_' + Date.now(),
            type: type,
            label: 'Pertanyaan Baru',
            description: '',
            is_required: false,
            options: ['Opsi 1', 'Opsi 2', 'Opsi 3'] // Default options for choice fields
        };
        setFields([...fields, newField]);
    };

    const updateField = (index, key, value) => {
        const updatedFields = [...fields];
        updatedFields[index] = { ...updatedFields[index], [key]: value };
        setFields(updatedFields);
    };

    const removeField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    const moveField = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newFields = [...fields];
            [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
            setFields(newFields);
        } else if (direction === 'down' && index < fields.length - 1) {
            const newFields = [...fields];
            [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
            setFields(newFields);
        }
    };

    const handleOptionChange = (fieldIndex, optionIndex, value) => {
        const updatedFields = [...fields];
        // Ensure options is array
        if (!Array.isArray(updatedFields[fieldIndex].options)) {
            updatedFields[fieldIndex].options = [];
        }
        updatedFields[fieldIndex].options[optionIndex] = value;
        setFields(updatedFields);
    };

    const fs = (fieldIndex) => {
        const updatedFields = [...fields];
        if (!updatedFields[fieldIndex].options) updatedFields[fieldIndex].options = [];
        updatedFields[fieldIndex].options.push(`Opsi ${updatedFields[fieldIndex].options.length + 1}`);
        setFields(updatedFields);
    }

    const removeOption = (fieldIndex, optionIndex) => {
        const updatedFields = [...fields];
        updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
        setFields(updatedFields);
    }

    const FieldIcon = ({ type }) => {
        switch (type) {
            case 'text': return <Type size={16} />;
            case 'textarea': return <AlignLeft size={16} />;
            case 'select': return <ListIcon size={16} />;
            case 'checkbox':
            case 'radio':
                return <CheckSquare size={16} />;
            case 'file': return <FileText size={16} />;
            default: return <Type size={16} />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href={route('forms.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Formulir</h2>
                            <p className="text-xs text-gray-500">{form.title}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href={route('public.form.show', form.slug)}
                            target="_blank"
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                        >
                            Preview
                        </a>
                        <button
                            onClick={activeTab === 'builder' ? saveFields : () => document.getElementById('settingsFormBtn').click()}
                            disabled={savingFields || processingSettings}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg"
                        >
                            <Save size={18} /> {savingFields || processingSettings ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Edit: ${form.title}`} />

            <div className="py-6 h-[calc(100vh-100px)] overflow-hidden flex flex-col">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex gap-6 overflow-hidden">

                    {/* Sidebar / Tools */}
                    <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-fit">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab('builder')}
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'builder' ? 'text-primary bg-blue-50 border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <ListIcon size={16} /> Builder
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'text-primary bg-blue-50 border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Settings size={16} /> Pengaturan
                            </button>
                        </div>

                        {activeTab === 'builder' && (
                            <div className="p-4 space-y-2 overflow-auto">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tambahkan Field</p>
                                <button onClick={() => addField('text')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><Type size={14} /></div> Teks Singkat
                                </button>
                                <button onClick={() => addField('textarea')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><AlignLeft size={14} /></div> Paragraf
                                </button>
                                <button onClick={() => addField('select')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><ListIcon size={14} /></div> Pilihan Ganda (Dropdown)
                                </button>
                                <button onClick={() => addField('radio')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><CheckSquare size={14} /></div> Pilihan (Radio)
                                </button>
                                <button onClick={() => addField('checkbox')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><CheckSquare size={14} /></div> Checkbox
                                </button>
                                <button onClick={() => addField('file')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><FileText size={14} /></div> Upload File
                                </button>
                                <button onClick={() => addField('date')} className="w-full flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg text-gray-700 hover:text-blue-700 text-sm transition-all group">
                                    <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-blue-200"><Calendar size={14} /></div> Tanggal
                                </button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="p-4 space-y-4 overflow-auto">
                                <p className="text-xs text-gray-500">Pengaturan ini mengubah properti Formulir utama.</p>
                            </div>
                        )}
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 bg-gray-100 rounded-xl overflow-y-auto p-4 md:p-8 space-y-4 shadow-inner">

                        {activeTab === 'settings' ? (
                            <form
                                onSubmit={(e) => { e.preventDefault(); putSettings(route('forms.update', form.id)); }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto"
                            >
                                <h3 className="text-lg font-bold mb-6 pb-2 border-b">Pengaturan Formulir</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Formulir</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                                            value={settingsData.title}
                                            onChange={e => setSettingsData('title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                        <textarea
                                            rows="3"
                                            className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                                            value={settingsData.description}
                                            onChange={e => setSettingsData('description', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai (Opsional)</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full rounded-lg border-gray-300"
                                                value={settingsData.start_at ? settingsData.start_at.slice(0, 16) : ''}
                                                onChange={e => setSettingsData('start_at', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir (Opsional)</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full rounded-lg border-gray-300"
                                                value={settingsData.end_at ? settingsData.end_at.slice(0, 16) : ''}
                                                onChange={e => setSettingsData('end_at', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t space-y-3">
                                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-primary focus:ring-primary w-5 h-5"
                                                checked={settingsData.is_active}
                                                onChange={e => setSettingsData('is_active', e.target.checked)}
                                            />
                                            <div>
                                                <span className="block font-medium text-gray-800">Status Aktif</span>
                                                <span className="text-xs text-gray-500">Jika tidak aktif, formulir tidak bisa diakses publik (Draft).</span>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-primary focus:ring-primary w-5 h-5"
                                                checked={settingsData.is_public}
                                                onChange={e => setSettingsData('is_public', e.target.checked)}
                                            />
                                            <div>
                                                <span className="block font-medium text-gray-800">Akses Publik Tanpa Login</span>
                                                <span className="text-xs text-gray-500">Izinkan orang tua/umum mengisi formulir ini tanda login.</span>
                                            </div>
                                        </label>
                                    </div>

                                    <button type="submit" id="settingsFormBtn" className="hidden">Simpan</button>
                                </div>
                            </form>
                        ) : (
                            // BUILDER CANVAS
                            <div className="max-w-3xl mx-auto space-y-4 pb-20">
                                {fields.length === 0 ? (
                                    <div className="bg-white p-12 rounded-xl text-center border border-dashed border-gray-300">
                                        <div className="bg-blue-50 p-4 rounded-full inline-block mb-4">
                                            <Settings size={32} className="text-blue-400" />
                                        </div>
                                        <h3 className="font-bold text-gray-800">Belum ada pertanyaan</h3>
                                        <p className="text-gray-500 mb-6">Klik tombol di sidebar kiri untuk menambahkan pertanyaan.</p>
                                        <button onClick={() => addField('text')} className="text-primary hover:underline">Tambah Pertanyaan Pertama</button>
                                    </div>
                                ) : (
                                    fields.map((field, index) => (
                                        <div key={field.id || index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group hover:border-blue-300 hover:shadow-md transition-all">

                                            {/* Drag Handle & Type Label - Always Visible */}
                                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <FieldIcon type={field.type} />
                                                    <span className="text-xs font-mono uppercase bg-gray-100 px-1.5 py-0.5 rounded">{field.type}</span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => moveField(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowLeft size={14} className="rotate-90" /></button>
                                                    <button onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowLeft size={14} className="-rotate-90" /></button>
                                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                                    <button onClick={() => removeField(index)} className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-500"><Trash size={14} /></button>
                                                </div>
                                            </div>

                                            {/* Field Editor */}
                                            <div className="space-y-3">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            className="w-full text-lg font-bold border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-primary focus:ring-0 px-0 bg-transparent placeholder-gray-300 transition-colors"
                                                            placeholder="Tulis Pertanyaan Anda..."
                                                            value={field.label}
                                                            onChange={e => updateField(index, 'label', e.target.value)}
                                                        />
                                                    </div>
                                                    <label className="flex items-center gap-2 text-sm text-gray-500 shrink-0 bg-gray-50 px-3 rounded-lg border border-transparent hover:border-gray-200 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded text-red-500 focus:ring-red-500"
                                                            checked={field.is_required}
                                                            onChange={e => updateField(index, 'is_required', e.target.checked)}
                                                        />
                                                        Wajib Diisi*
                                                    </label>
                                                </div>

                                                <input
                                                    type="text"
                                                    className="w-full text-sm border-0 focus:ring-0 px-0 text-gray-500 bg-transparent"
                                                    placeholder="Deskripsi tambahan (opsional)"
                                                    value={field.description || ''}
                                                    onChange={e => updateField(index, 'description', e.target.value)}
                                                />

                                                {/* Options Editor for Select/Radio/Checkbox */}
                                                {['select', 'radio', 'checkbox'].includes(field.type) && (
                                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Pilihan Jawaban</p>
                                                        <div className="space-y-2">
                                                            {(field.options || []).map((opt, optIndex) => (
                                                                <div key={optIndex} className="flex items-center gap-2">
                                                                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                                                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        className="flex-1 py-1 px-2 text-sm border-gray-200 rounded focus:border-blue-500 focus:ring-blue-500"
                                                                        value={opt}
                                                                        onChange={e => handleOptionChange(index, optIndex, e.target.value)}
                                                                    />
                                                                    <button onClick={() => removeOption(index, optIndex)} className="text-gray-400 hover:text-red-500"><Trash size={14} /></button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => {
                                                                    const currentOpts = field.options ? [...field.options] : [];
                                                                    currentOpts.push(`Pilihan ${currentOpts.length + 1}`);
                                                                    updateField(index, 'options', currentOpts);
                                                                }}
                                                                className="text-xs text-primary hover:underline font-medium flex items-center gap-1 mt-2 mb-2"
                                                            >
                                                                <Plus size={12} /> Tambah Opsi Lain
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {field.type === 'file' && (
                                                    <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 mt-2">
                                                        Preview: Area Upload File User
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
