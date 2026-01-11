import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, FileText, Settings, PenTool, Layout, ChevronDown, ChevronUp, Table, Info } from 'lucide-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useEffect, useState } from 'react';

// Register Custom Font Sizes (Numbers)
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px', '30px'];
Quill.register(Size, true);

// Register Custom Fonts
const Font = Quill.import('attributors/style/font');
Font.whitelist = ['arial', 'calibri', 'times-new-roman', 'sans-serif'];
Quill.register(Font, true);

export default function Create({ auth, klasifikasis, templates, school, nextNumber, defaultFooter }) {
    const quillRef = React.useRef(null);
    const [activeTab, setActiveTab] = useState('surat');
    const { data, setData, post, processing, errors } = useForm({
        no_surat: '',
        klasifikasi_surat_id: '',
        lampiran: '-',
        tujuan: '',
        perihal: '',
        isi_surat: '',
        tanggal_surat: new Date().toISOString().split('T')[0],
        jenis_surat: 'standar',
        opsi_tanda_tangan: 'tte',
        posisi_tanggal: 'kanan_atas',
        footer_enabled: true,
        footer_text: defaultFooter || 'Dokumen ini telah ditandatangani secara elektronik yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), BSSN.', // Default from DB
        paper_size: 'F4',
        // Global Margins
        margins: { top: 0.8, right: 1.8, bottom: 0.8, left: 1.8 },
        // Granular Spacing (in cm or rem)
        spacing: {
            header: 0.4, // Space AFTER Kop
            body: 0,   // Space BEFORE content
            footer: 0.4, // Space BEFORE footer
            line_height: 1.15 // Default Word spacing
        }
    });

    // Default content
    useEffect(() => {
        if (!data.isi_surat) {
            setData('isi_surat', '<p>Dengan hormat,</p><p><br></p><p>Sehubungan dengan...</p><p><br></p><p>Demikian surat ini kami sampaikan.</p>');
        }
    }, []);

    // Change footer text based on signature type if user hasn't typed custom
    useEffect(() => {
        // Use default footer for all, or allow override. 
        // User requested: "Manual Signature Footer not taking from Settings".
        // So we should use defaultFooter for Manual too.
        if (data.opsi_tanda_tangan === 'tte' || data.opsi_tanda_tangan === 'manual') {
            setData(d => ({ ...d, footer_text: defaultFooter || 'Dokumen ini telah ditandatangani secara elektronik yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE), BSSN.' }));
        }
    }, [data.opsi_tanda_tangan]);

    // Auto-Margin for Manual Signature (Smart Visual Editor)
    useEffect(() => {
        setData(d => {
            const newBottom = d.opsi_tanda_tangan === 'manual' ? 1.2 : 0.8;
            if (d.margins.bottom !== newBottom) {
                return { ...d, margins: { ...d.margins, bottom: newBottom } };
            }
            return d;
        });
    }, [data.opsi_tanda_tangan]);


    // Auto Numbering & SK Template Logic
    useEffect(() => {
        if (data.klasifikasi_surat_id && school?.singkatan) {
            const date = new Date(data.tanggal_surat);
            const month = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][date.getMonth() + 1];
            const year = date.getFullYear();
            const klasifikasi = klasifikasis.find(k => k.id == data.klasifikasi_surat_id);
            const kode = klasifikasi ? klasifikasi.kode : 'CODE';
            const autoNumber = `${String(nextNumber).padStart(3, '0')}/${kode}/${school.singkatan}/${month}/${year}`;

            // Generate Updated Data object
            let updates = { no_surat: autoNumber };

            // Logic khusus Surat Keputusan (SK)
            if (kode === 'SK') {
                updates.posisi_tanggal = 'kanan_bawah';
                // Title handled by Layout
            }

            setData(d => ({ ...d, ...updates }));
        }
    }, [data.klasifikasi_surat_id, school, nextNumber, data.tanggal_surat, data.perihal]); // Added perihal dependency to update text dynamically

    const submit = (e) => {
        e.preventDefault();
        post(route('surat-keluar.store'), {
            onSuccess: () => {
                // Ensure redirect happens or show alert if needed
                // Inertia should handle redirect automatically from Controller
            },
            onError: (errors) => {
                console.error("Submission Errors:", errors);
                alert("Gagal menyimpan surat. Periksa inputan Anda.");
            }
        });
    };

    // Custom Sticky Toolbar Configuration
    // MEMOIZED to prevent editor re-rendering/losing focus on every keystroke
    const modules = React.useMemo(() => ({
        toolbar: {
            container: "#toolbar-container",
            handlers: {}
        },
        keyboard: {
            bindings: {
                tab: {
                    key: 9,
                    handler: function (range, context) {
                        this.quill.insertText(range.index, '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'); // 8 spaces for Hanging jump
                        return false;
                    }
                }
            }
        }
    }), []);

    // Ruler Component
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

    const isSK = React.useMemo(() => {
        const k = klasifikasis.find(item => item.id == data.klasifikasi_surat_id);
        return k?.kode === 'SK';
    }, [data.klasifikasi_surat_id, klasifikasis]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={< h2 className="font-semibold text-xl text-gray-800 leading-tight" > Buat Surat Keluar</h2>}
        >
            <Head title="Buat Surat Keluar" />

            <form onSubmit={submit} className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* SETTINGS SIDEBAR (LEFT - TABBED) */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col z-30 shadow-lg flex-shrink-0">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <FileText size={20} />
                            <span>Pengaturan</span>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors shadow-sm disabled:opacity-50"
                            title="Simpan Surat"
                        >
                            <Save size={16} />
                            {processing ? '...' : 'Simpan'}
                        </button>
                    </div>

                    {/* TAB NAVIGATION */}
                    <div className="flex border-b border-gray-200 bg-white">
                        <button
                            type="button"
                            onClick={() => setActiveTab('surat')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'surat' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Surat
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('layout')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'layout' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Layout
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('otorisasi')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'otorisasi' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Validasi
                        </button>
                    </div>

                    {/* TAB CONTENT */}
                    <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">

                        {/* TAB 1: SURAT */}
                        {activeTab === 'surat' && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Template */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Load Template</label>
                                    <div className="relative">
                                        <select
                                            onChange={(e) => {
                                                const t = templates.find(t => t.id == e.target.value);
                                                if (t && confirm('Isi surat akan ditimpa dengan template ini. Lanjutkan?')) {
                                                    setData(d => ({
                                                        ...d,
                                                        isi_surat: t.isi_surat,
                                                        paper_size: t.paper_size || d.paper_size,
                                                        margins: t.margins ? JSON.parse(t.margins) : d.margins,
                                                        spacing: t.spacing ? JSON.parse(t.spacing) : d.spacing
                                                    }));
                                                }
                                                e.target.value = '';
                                            }}
                                            className="w-full rounded-lg border-gray-300 py-1.5 text-sm"
                                        >
                                            <option value="">Pilih Template...</option>
                                            {templates.map(t => (
                                                <option key={t.id} value={t.id}>{t.nama}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Mengganti isi surat dengan template tersimpan.</p>
                                </div>

                                <hr className="border-dashed border-gray-200" />

                                {/* Klasifikasi */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Klasifikasi / Kode</label>
                                    <div className="relative">
                                        <select
                                            value={data.klasifikasi_surat_id}
                                            onChange={e => setData('klasifikasi_surat_id', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 py-1.5 text-sm pr-8"
                                        >
                                            <option value="">Pilih Klasifikasi...</option>
                                            {klasifikasis.map(k => (
                                                <option key={k.id} value={k.id}>{k.kode} - {k.nama}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.klasifikasi_surat_id && <div className="text-red-500 text-xs mt-1">{errors.klasifikasi_surat_id}</div>}
                                </div>

                                {/* Nomor Surat */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nomor Surat</label>
                                    <input
                                        type="text"
                                        value={data.no_surat}
                                        onChange={e => setData('no_surat', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 py-1.5 text-sm"
                                    />
                                    {errors.no_surat && <div className="text-red-500 text-xs mt-1">{errors.no_surat}</div>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tanggal</label>
                                        <input
                                            type="date"
                                            value={data.tanggal_surat}
                                            onChange={e => setData('tanggal_surat', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 py-1.5 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Posisi Tanggal</label>
                                        <select
                                            value={data.posisi_tanggal}
                                            onChange={e => setData('posisi_tanggal', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 py-1.5 text-sm"
                                        >
                                            <option value="kanan_atas">Kanan Atas</option>
                                            <option value="kanan_bawah">Kanan Bawah</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: LAYOUT */}
                        {activeTab === 'layout' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                                    <p className="text-xs text-blue-600 flex gap-2">
                                        <Info size={14} className="shrink-0 mt-0.5" />
                                        Pengaturan ini mempengaruhi hasil cetak fisik PDF.
                                    </p>
                                </div>

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

                                {/* Footer Toggle */}
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                    <input
                                        type="checkbox"
                                        id="footer_toggle"
                                        checked={data.footer_enabled}
                                        onChange={e => setData('footer_enabled', e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                                    />
                                    <label htmlFor="footer_toggle" className="text-sm text-gray-700 cursor-pointer select-none">
                                        Cetakan Kaki Surat (Footer)
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: OTORISASI */}
                        {activeTab === 'otorisasi' && (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Opsi Tanda Tangan</label>
                                    <select
                                        value={data.opsi_tanda_tangan}
                                        onChange={e => setData('opsi_tanda_tangan', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 py-1.5 text-sm bg-gray-50"
                                    >
                                        <option value="tte">Tanda Tangan Elektronik (QR)</option>
                                        <option value="manual">Tanda Tangan Basah (Manual)</option>
                                        <option value="polos">Tanpa TTE (Polos)</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {data.opsi_tanda_tangan === 'tte' && "Menampilkan QR Code validasi BSrE."}
                                        {data.opsi_tanda_tangan === 'manual' && "Menampilkan area kosong untuk tanda tangan basah & QR validasi footer."}
                                        {data.opsi_tanda_tangan === 'polos' && "Hanya menampilkan nama Kepala Sekolah tanpa atribut validasi."}
                                    </p>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <h5 className="text-xs font-bold text-gray-700 mb-2 border-b pb-1">Penandatangan</h5>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <p><span className="font-semibold">Nama:</span> {school?.kepala_sekolah || '-'}</p>
                                        <p><span className="font-semibold">NIP:</span> {school?.nip_kepala_sekolah || '-'}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 italic">Data diambil dari Profil Sekolah.</p>
                                </div>
                            </div>
                        )}
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

                            {/* KOP SURAT */}
                            <div className="w-full flex justify-center mb-0" style={{ marginBottom: `${data.spacing?.header || 0}cm` }}>
                                {school?.kop_surat ? (
                                    <img
                                        src={`/storage/${school.kop_surat}`}
                                        alt="Kop Surat"
                                        className="w-full h-auto object-contain max-h-[4cm]"
                                    />
                                ) : (
                                    <div className="w-full text-center border-b-2 border-double border-gray-800 pb-2 mb-2">
                                        <h1 className="font-bold text-lg uppercase font-serif tracking-widest">{school?.nama_sekolah || 'NAMA SEKOLAH'}</h1>
                                        <p className="text-sm font-serif">{school?.alamat || 'Alamat Sekolah'}</p>
                                    </div>
                                )}
                            </div>

                            {/* JUDUL SK (Khusus SK) */}
                            {isSK && (
                                <div className="text-center mb-4">
                                    <h2 className="font-bold underline text-md uppercase">KEPUTUSAN KEPALA {school?.nama_sekolah?.toUpperCase()}</h2>
                                    <p className="text-sm">Nomor: {data.no_surat}</p>
                                    <p className="font-bold uppercase mt-2">TENTANG</p>
                                    <p className="font-bold uppercase">{data.perihal}</p>
                                </div>
                            )}

                            {/* HEADER SURAT (Non-SK) */}
                            {!isSK && (
                                <div className="w-full grid grid-cols-[auto_1fr] gap-x-2 gap-y-0 text-left mb-6 relative">
                                    {data.posisi_tanggal === 'kanan_atas' && (
                                        <div className="col-span-2 text-right mb-2">
                                            Bogor, {new Date(data.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    )}

                                    <div>Nomor</div>   <div>: {data.no_surat}</div>
                                    <div>Lampiran</div><div>: {data.lampiran}</div>
                                    <div>Perihal</div>
                                    <div className="relative group">
                                        <span className="mr-1">:</span>
                                        <input
                                            type="text"
                                            value={data.perihal}
                                            onChange={e => setData('perihal', e.target.value)}
                                            placeholder="Ketik Perihal..."
                                            className="bg-transparent border-0 border-b border-transparent focus:border-gray-400 focus:ring-0 p-0 text-gray-800 w-[90%] font-inherit placeholder:italic placeholder:text-gray-400"
                                            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                                        />
                                    </div>

                                    <div className="col-span-2 mt-4">
                                        Kepada Yth.<br />
                                        <input
                                            type="text"
                                            value={data.tujuan}
                                            onChange={e => setData('tujuan', e.target.value)}
                                            placeholder="Ketik Tujuan..."
                                            className="bg-transparent border-0 border-b border-transparent focus:border-gray-400 focus:ring-0 p-0 font-bold text-gray-900 w-full placeholder:text-gray-400 placeholder:font-normal"
                                            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                                        />
                                        <br />
                                        di Tempat
                                    </div>
                                </div>
                            )}

                            {/* EDITOR */}
                            <div className="flex-1 relative group min-h-[300px]" style={{ marginTop: `${data.spacing?.body || 0}cm` }}>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={data.isi_surat}
                                    onChange={content => setData('isi_surat', content)}
                                    modules={modules}
                                    placeholder="Ketik isi surat disini..."
                                    className="h-full focus:outline-none"
                                />
                            </div>

                            {/* SIGNATURE */}
                            <div className="flex justify-end mt-4">
                                <div className="text-center min-w-[200px]">
                                    {/* Date: Bottom Right Position */}
                                    {data.posisi_tanggal === 'kanan_bawah' && (
                                        <div className="mb-2 font-serif text-[11pt]">
                                            {isSK ? (
                                                <>
                                                    Ditetapkan di Bogor<br />
                                                    pada tanggal {new Date(data.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </>
                                            ) : (
                                                <>
                                                    Bogor, {new Date(data.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <p className="mb-1">Kepala Sekolah,</p>

                                    <div className="h-20 flex items-center justify-center my-1 relative">
                                        {/* QR Code Validation - ONLY FOR TTE */}
                                        {data.opsi_tanda_tangan === 'tte' && (
                                            <div className="border-2 rounded border-gray-400 p-1 bg-white">
                                                <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center">
                                                    <span className="text-[8px] text-gray-500 text-center">QR<br />Validasi</span>
                                                </div>
                                            </div>
                                        )}

                                        {data.opsi_tanda_tangan === 'manual' && (
                                            <div className="z-10 h-full w-full flex items-center justify-center">
                                                <div className="text-gray-300 italic text-sm select-none">
                                                    (Tanda Tangan Basah)
                                                </div>
                                            </div>
                                        )}

                                        {data.opsi_tanda_tangan === 'polos' && (
                                            <div className="z-10 h-full w-full flex items-center justify-center">
                                                {/* Kosong / Space Only */}
                                            </div>
                                        )}
                                    </div>

                                    <p className="font-bold border-b border-black inline-block min-w-[150px] pb-1 z-20 relative">
                                        {school?.kepala_sekolah || '...'}
                                    </p>
                                    <p>NIP. {school?.nip_kepala_sekolah || '-'}</p>
                                </div>
                            </div>

                            {/* FOOTER */}
                            {data.footer_enabled && (
                                <div className={`mt-auto pt-4 border-t-2 border-double border-gray-800 text-left text-[10px] text-gray-600 font-sans italic relative ${data.opsi_tanda_tangan === 'manual' ? 'pl-24' : ''}`} style={{ marginTop: `${data.spacing?.footer || 0}cm` }}>

                                    {/* Footer QR Preview for Manual Signature */}
                                    {data.opsi_tanda_tangan === 'manual' && (
                                        <div className="absolute left-2 top-2 w-16 h-16 border border-gray-300 bg-white flex items-center justify-center opacity-80">
                                            <span className="text-[8px] text-gray-400 text-center">QR<br />Validasi</span>
                                        </div>
                                    )}

                                    <p className="whitespace-pre-line">
                                        {data.footer_text
                                            .replace(/\[NAMA_SEKOLAH\]|\[NAMA\]/g, school?.nama_sekolah || 'SMP Al-Irsyad Bogor')
                                            .replace(/{token}/g, btoa(data.no_surat + school?.id).substring(0, 16)) // Simple simulation
                                            .replace(/{hari, tanggal, jam}/g, new Date().toLocaleString('id-ID'))
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout >
    );
}
