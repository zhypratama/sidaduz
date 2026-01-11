import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, FileText, Tag, Layout, Table, Plus, X, ChevronDown, Settings } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useState } from 'react';

// Register Custom Font Sizes (Numbers)
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px', '30px'];
Quill.register(Size, true);

// Register Custom Fonts
const Font = Quill.import('attributors/style/font');
Font.whitelist = ['arial', 'calibri', 'times-new-roman', 'sans-serif'];
Quill.register(Font, true);

export default function Create({ auth, template, klasifikasis }) {
    const quillRef = React.useRef(null);
    const [activeTab, setActiveTab] = useState('data');
    const [isKlasifikasiModalOpen, setIsKlasifikasiModalOpen] = useState(false);

    // Initial Data Setup
    const { data, setData, post, put, processing, errors } = useForm({
        nama: template?.nama || '',
        kategori: template?.kategori || 'Umum',
        klasifikasi_surat_id: template?.klasifikasi_surat_id || '',
        isi_surat: template?.isi_surat || '<p>Ketik isi template disini...</p>',
        paper_size: template?.paper_size || 'F4',
        margins: template?.margins ? { top: 2.54, right: 2.54, bottom: 2.54, left: 2.54, ...template.margins } : { top: 2.54, right: 2.54, bottom: 2.54, left: 2.54 },
        spacing: template?.spacing ? { header: 0, body: 0, footer: 0, line_height: 1.15, ...template.spacing } : { header: 0, body: 0, footer: 0, line_height: 1.15 }
    });

    // Form for new classification
    const {
        data: klasifData,
        setData: setKlasifData,
        post: postKlasif,
        processing: klasifProcessing,
        reset: resetKlasif,
        errors: klasifErrors
    } = useForm({
        kode: '',
        nama: ''
    });

    const submit = (e) => {
        e.preventDefault();
        // convert objects to JSON strings before sending if needed? 
        // Controller expects standard inputs, depends on implementation. 
        // Assuming cast changes in Model or Controller handling json_encode provided by Eloquent cast 'array'.
        // But Controller might expect direct values. 
        // For margins/spacing, usually we send as JSON or array. Inertia sends as JSON automatically.
        // We will assume Controller handles it (casts = 'array').

        if (template) {
            put(route('surat-template.update', template.id));
        } else {
            post(route('surat-template.store'));
        }
    };

    const submitKlasifikasi = (e) => {
        e.preventDefault();
        postKlasif(route('klasifikasi-surat.store'), {
            onSuccess: () => {
                setIsKlasifikasiModalOpen(false);
                resetKlasif();
                // Ideally reload props but Inertia handles this automatically if preserveState is managed well
            },
            preserveScroll: true
        });
    };

    // Custom Toolbar Configuration
    const modules = React.useMemo(() => ({
        toolbar: {
            container: "#toolbar-container",
            handlers: {
                // Custom handlers can be added here if needed
            }
        },
        keyboard: {
            bindings: {
                tab: {
                    key: 9,
                    handler: function (range, context) {
                        this.quill.insertText(range.index, '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'); // 8 spaces for "Hanging" jump
                        return false;
                    }
                }
            }
        }
    }), []);

    // Ruler Component (Internal)
    const Ruler = ({ width }) => (
        <div className="absolute top-[-30px] left-0 h-[25px] bg-gray-50 border-b border-gray-300 flex text-[10px] text-gray-500 select-none overflow-hidden" style={{ width: width }}>
            {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 relative" style={{ width: '1cm' }}>
                    <span className="absolute left-[-4px] top-0">{i}</span>
                    <div className="h-full w-full border-l border-gray-300 relative">
                        {/* mm ticks */}
                        <div className="absolute left-[0.25cm] bottom-0 h-[5px] w-px bg-gray-200"></div>
                        <div className="absolute left-[0.5cm] bottom-0 h-[8px] w-px bg-gray-300"></div>
                        <div className="absolute left-[0.75cm] bottom-0 h-[5px] w-px bg-gray-200"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{template ? 'Edit Template' : 'Buat Template Baru'}</h2>}
        >
            <Head title={template ? 'Edit Template' : 'Buat Template Baru'} />

            <form onSubmit={submit} className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* SETTINGS SIDEBAR */}
                <div className="w-[350px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg flex-shrink-0">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <Settings size={18} />
                            Pengaturan Template
                        </h3>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <Save size={16} />
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                        {/* Nama Template */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={e => setData('nama', e.target.value)}
                                placeholder="Contoh: Surat Undangan Rapat"
                                className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                            />
                            {errors.nama && <div className="text-red-500 text-xs mt-1">{errors.nama}</div>}
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <div className="relative">
                                <select
                                    value={data.kategori}
                                    onChange={e => setData('kategori', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary appearance-none py-2 px-3 pr-10"
                                >
                                    <option value="Umum">Umum</option>
                                    <option value="Khusus">Khusus</option>
                                    <option value="SK">Surat Keputusan (SK)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                            </div>
                            {errors.kategori && <div className="text-red-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>

                        {/* Klasifikasi */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Klasifikasi Default</label>
                                <button
                                    type="button"
                                    onClick={() => setIsKlasifikasiModalOpen(true)}
                                    className="text-primary text-[10px] font-bold hover:underline flex items-center"
                                >
                                    <Plus size={12} className="mr-0.5" />
                                    BARU
                                </button>
                            </div>
                            <div className="relative">
                                <select
                                    value={data.klasifikasi_surat_id}
                                    onChange={e => setData('klasifikasi_surat_id', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary appearance-none py-2 px-3 pr-10"
                                >
                                    <option value="">Pilih Klasifikasi...</option>
                                    {klasifikasis.map(k => (
                                        <option key={k.id} value={k.id}>{k.kode} - {k.nama}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                            </div>
                            {errors.klasifikasi_surat_id && <div className="text-red-500 text-xs mt-1">{errors.klasifikasi_surat_id}</div>}
                        </div>

                        <hr className="border-gray-100" />

                        {/* Layout Settings toggle */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                <Layout size={16} />
                                Tata Letak Default
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kertas</label>
                                    <select
                                        value={data.paper_size}
                                        onChange={e => setData('paper_size', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 py-1.5 text-sm"
                                    >
                                        <option value="F4">F4 (Folio)</option>
                                        <option value="A4">A4</option>
                                        <option value="Letter">Letter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Spasi Baris</label>
                                    <input
                                        type="number"
                                        step="0.05"
                                        value={data.spacing?.line_height || 1.15}
                                        onChange={e => setData(d => ({ ...d, spacing: { ...d.spacing, line_height: e.target.value } }))}
                                        className="w-full rounded-lg border-gray-300 py-1.5 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Margins */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Margin (cm)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] w-8 text-gray-400">Atas</span>
                                        <input type="number" step="0.1" value={data.margins.top} onChange={e => setData('margins', { ...data.margins, top: parseFloat(e.target.value) })} className="w-full rounded border-gray-300 text-xs py-1" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] w-8 text-gray-400">Bawah</span>
                                        <input type="number" step="0.1" value={data.margins.bottom} onChange={e => setData('margins', { ...data.margins, bottom: parseFloat(e.target.value) })} className="w-full rounded border-gray-300 text-xs py-1" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] w-8 text-gray-400">Kiri</span>
                                        <input type="number" step="0.1" value={data.margins.left} onChange={e => setData('margins', { ...data.margins, left: parseFloat(e.target.value) })} className="w-full rounded border-gray-300 text-xs py-1" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] w-8 text-gray-400">Kanan</span>
                                        <input type="number" step="0.1" value={data.margins.right} onChange={e => setData('margins', { ...data.margins, right: parseFloat(e.target.value) })} className="w-full rounded border-gray-300 text-xs py-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EDITOR AREA */}
                <div className="flex-1 flex flex-col bg-gray-100 relative overflow-hidden">
                    {/* TOOLBAR */}
                    <div id="toolbar-container" className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 sticky top-0 z-20 shadow-sm flex-wrap">
                        <span className="ql-formats">
                            <select className="ql-font" defaultValue="times-new-roman">
                                <option value="arial">Arial</option>
                                <option value="calibri">Calibri</option>
                                <option value="times-new-roman">Times New Roman</option>
                                <option value="sans-serif">Sans Serif</option>
                            </select>
                            <select className="ql-size" defaultValue="12px">
                                {['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px', '30px'].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </span>

                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                        <span className="ql-formats">
                            <button className="ql-bold" />
                            <button className="ql-italic" />
                            <button className="ql-underline" />
                            <button className="ql-strike" />
                        </span>

                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                        <span className="ql-formats">
                            <select className="ql-color" />
                            <select className="ql-background" />
                        </span>

                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                        <span className="ql-formats">
                            <button className="ql-list" value="ordered" />
                            <button className="ql-list" value="bullet" />
                            <button className="ql-indent" value="-1" />
                            <button className="ql-indent" value="+1" />
                        </span>

                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                        <span className="ql-formats">
                            <select className="ql-align" />
                        </span>

                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                        <span className="ql-formats">
                            <button className="ql-link" />
                            <button className="ql-image" />
                        </span>

                        <div className="ml-auto">
                            <span className="ql-formats">
                                <button className="ql-clean" title="Hapus Format" />
                            </span>
                        </div>
                    </div>

                    {/* PAPER AREA (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-gray-200 custom-scrollbar relative">
                        <div
                            className="bg-white shadow-xl relative flex flex-col transition-all duration-300 ease-in-out origin-top"
                            style={{
                                width: data.paper_size === 'F4' ? '215mm' : data.paper_size === 'Letter' ? '216mm' : '210mm',
                                minHeight: data.paper_size === 'F4' ? '330mm' : data.paper_size === 'Letter' ? '279mm' : '297mm',
                                padding: `${data.margins.top}cm ${data.margins.right}cm ${data.margins.bottom}cm ${data.margins.left}cm`,
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '11pt',
                                marginTop: '30px', // Space for Ruler
                                lineHeight: data.spacing?.line_height || 1.15
                            }}
                        >
                            {/* RULER */}
                            <Ruler width="100%" />

                            {/* EDITOR */}
                            <div className="flex-1 relative group min-h-[300px]">
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={data.isi_surat}
                                    onChange={content => setData('isi_surat', content)}
                                    modules={modules}
                                    placeholder="Ketik isi template disini..."
                                    className="h-full focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Modal Tambah Klasifikasi */}
            {isKlasifikasiModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Tambah Klasifikasi Baru</h3>
                            <button
                                onClick={() => setIsKlasifikasiModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitKlasifikasi} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Klasifikasi</label>
                                <input
                                    type="text"
                                    value={klasifData.kode}
                                    onChange={e => setKlasifData('kode', e.target.value)}
                                    placeholder="Contoh: 421.3"
                                    className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                                />
                                {klasifErrors.kode && <div className="text-red-500 text-xs mt-1">{klasifErrors.kode}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klasifikasi</label>
                                <input
                                    type="text"
                                    value={klasifData.nama}
                                    onChange={e => setKlasifData('nama', e.target.value)}
                                    placeholder="Contoh: Pendidikan"
                                    className="w-full rounded-xl border-gray-300 focus:ring-primary focus:border-primary"
                                />
                                {klasifErrors.nama && <div className="text-red-500 text-xs mt-1">{klasifErrors.nama}</div>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsKlasifikasiModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={klasifProcessing}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {klasifProcessing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
