import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, FileText, Settings, PenTool, Layout, ChevronDown, ChevronUp, Table } from 'lucide-react';
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

    // Standard Quill Toolbar Configuration
    // MEMOIZED to prevent editor re-rendering/losing focus on every keystroke
    const modules = React.useMemo(() => ({
        toolbar: [
            [{ 'font': ['arial', 'calibri', 'times-new-roman', 'sans-serif'] }],
            [{ 'size': ['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px', '30px'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }], // Border and Shading (Colors)
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ]
    }), []);

    // CSS to fix Quill Toolbar Labels for Custom Sizes & Fonts
    const customQuillStyles = `
        /* FONT SIZES */
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
            content: attr(data-value) !important;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=""]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=""]::before {
             content: 'Normal';
        }

        /* FONTS LABELS */
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
            content: "Arial";
            font-family: "Arial", sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="calibri"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="calibri"]::before {
            content: "Calibri";
            font-family: "Calibri", sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
            content: "Times New Roman";
            font-family: "Times New Roman", serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
            content: "Sans Serif";
        }

        /* APPLY FONTS TO EDITOR CONTENT */
        .ql-font-arial { font-family: "Arial", sans-serif; }
        .ql-font-calibri { font-family: "Calibri", sans-serif; }
        .ql-font-times-new-roman { font-family: "Times New Roman", serif; }
    `;

    const isSK = React.useMemo(() => {
        const k = klasifikasis.find(item => item.id == data.klasifikasi_surat_id);
        return k?.kode === 'SK';
    }, [data.klasifikasi_surat_id, klasifikasis]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href={route('surat-keluar.index')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h2 className="font-bold text-2xl text-gray-800">Buat Surat Keluar</h2>
                            <p className="text-gray-500 text-sm">Editor surat dengan penomoran otomatis & fitur lengkap</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Buat Surat Keluar" />
            <style>{customQuillStyles}</style>

            <form onSubmit={submit} className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-140px)]">

                {/* LEFT SIDEBAR - Basic Settings Only */}
                <div className="w-full xl:w-72 flex-shrink-0 space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-10">
                    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                            <Settings className="text-primary" size={16} />
                            Pengaturan Dasar
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Klasifikasi</label>
                                <select
                                    className="w-full rounded-lg border-gray-200 focus:ring-primary focus:border-primary text-xs py-2"
                                    value={data.klasifikasi_surat_id}
                                    onChange={e => setData('klasifikasi_surat_id', e.target.value)}
                                >
                                    <option value="">-- Pilih Klasifikasi --</option>
                                    {klasifikasis.map(k => (
                                        <option key={k.id} value={k.id}>{k.kode} - {k.nama}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Template Selector (Dynamic) */}
                            {data.klasifikasi_surat_id && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Template Surat</label>
                                    <select
                                        className="w-full rounded-lg border-gray-200 focus:ring-primary focus:border-primary text-xs py-2 bg-blue-50/50"
                                        onChange={(e) => {
                                            const content = e.target.value;
                                            if (content) {
                                                if (confirm('Ganti isi surat dengan template terpilih? Isi saat ini akan ditimpa.')) {
                                                    setData('isi_surat', content);
                                                }
                                            } else {
                                                // Default
                                                if (confirm('Kembalikan ke template kosong default?')) {
                                                    setData('isi_surat', '<p>Dengan hormat,</p><p><br></p><p>Sehubungan dengan...</p><p><br></p><p>Demikian surat ini kami sampaikan.</p>');
                                                }
                                            }
                                        }}
                                    >
                                        <option value="">-- Standar (Kosong) --</option>
                                        {templates
                                            .filter(t => t.klasifikasi_surat_id == data.klasifikasi_surat_id)
                                            .map(t => (
                                                <option key={t.id} value={t.isi_surat}>{t.nama}</option>
                                            ))}
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-1 italic">
                                        *Pilih untuk memuat isi surat otomatis
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Surat</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-200 focus:ring-primary font-mono text-xs py-2 bg-gray-50"
                                    value={data.no_surat}
                                    onChange={e => setData('no_surat', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal Surat</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-200 focus:ring-primary text-xs py-2"
                                    value={data.tanggal_surat}
                                    onChange={e => setData('tanggal_surat', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                            <PenTool className="text-purple-600" size={16} />
                            Tanda Tangan & Footer
                        </h3>
                        {/* Opsi Tanda Tangan */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Posisi Tanggal</label>
                            <select
                                className="w-full rounded-lg border-gray-200 focus:ring-primary focus:border-primary text-xs py-2"
                                value={data.posisi_tanggal}
                                onChange={e => setData('posisi_tanggal', e.target.value)}
                            >
                                <option value="kanan_atas">Kanan Atas (Di bawah Kop)</option>
                                <option value="kanan_bawah">Kanan Bawah (Di atas TTD)</option>
                            </select>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-xs font-semibold text-gray-600 mb-2">Jenis Tanda Tangan</label>
                            <div className="space-y-2">
                                {['tte', 'manual', 'polos'].map((type) => (
                                    <label key={type} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${data.opsi_tanda_tangan === type ? 'border-primary bg-primary/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="opsi_tanda_tangan"
                                            value={type}
                                            checked={data.opsi_tanda_tangan === type}
                                            onChange={() => setData('opsi_tanda_tangan', type)}
                                            className="text-primary focus:ring-primary w-4 h-4"
                                        />
                                        <span className="text-xs font-medium capitalize">
                                            {type === 'tte' ? 'Digital (QR)' : type === 'manual' ? 'Basah (Manual)' : 'Tanpa TTD'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Footer Settings */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 border border-gray-100 rounded-lg">
                                <span className="text-xs font-semibold text-gray-600">Gunakan Footer</span>
                                <button
                                    type="button"
                                    onClick={() => setData('footer_enabled', !data.footer_enabled)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${data.footer_enabled ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <span
                                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${data.footer_enabled ? 'translate-x-5' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            {data.footer_enabled && (
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-[10px] text-gray-500 italic">
                                        Teks footer akan otomatis mengambil dari Pengaturan Sistem dan menyesuaikan variabel data sekolah.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-gray-900/20"
                    >
                        {processing ? 'Menyimpan...' : (
                            <>
                                <Save size={18} /> Simpan Surat
                            </>
                        )}
                    </button>
                </div>

                {/* RIGHT EDITOR AREA */}
                <div className="flex-1 flex flex-col h-full bg-gray-100/50 rounded-[20px] border border-gray-200 overflow-hidden relative">

                    {/* CUSTOM TOOLBAR HEAD - FIXED TOP */}
                    {/* CUSTOM TOOLBAR HEAD - FIXED TOP */}
                    <div className="bg-white border-b border-gray-200 p-2 shadow-sm z-10 flex flex-col gap-2">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Smart Visual Editor
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    const quill = quillRef.current?.getEditor();
                                    if (quill) {
                                        const table = quill.getModule('table');
                                        if (table && typeof table.insertTable === 'function') {
                                            table.insertTable(3, 3);
                                        } else {
                                            // Fallback: manually insert table HTML at cursor
                                            const range = quill.getSelection(true);
                                            const tableHTML = '<table border="1" style="width:100%; border-collapse: collapse; border: 1px solid black;"><tbody><tr><td style="border: 1px solid black; padding: 5px;">Cell 1</td><td style="border: 1px solid black; padding: 5px;">Cell 2</td><td style="border: 1px solid black; padding: 5px;">Cell 3</td></tr><tr><td style="border: 1px solid black; padding: 5px;">Cell 4</td><td style="border: 1px solid black; padding: 5px;">Cell 5</td><td style="border: 1px solid black; padding: 5px;">Cell 6</td></tr></tbody></table><p><br/></p>';
                                            quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
                                        }
                                    }
                                }}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                            >
                                <Table size={14} /> Insert Table
                            </button>
                        </div>

                        {/* Layout Settings Panel (Always Visible) */}
                        <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Ukuran Kertas</label>
                                <select
                                    className="w-full text-xs rounded border-gray-200 py-1"
                                    value={data.paper_size}
                                    onChange={e => setData('paper_size', e.target.value)}
                                >
                                    <option value="F4">F4 (Folio)</option>
                                    <option value="A4">A4</option>
                                    <option value="Letter">Letter</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Page Margins (cm)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <input type="number" step="0.1" className="w-full rounded text-xs py-1 px-1 border-gray-200" value={data.margins.top} onChange={e => setData('margins', { ...data.margins, top: e.target.value })} />
                                        <label className="text-[9px] text-gray-400 block text-center">Atas</label>
                                    </div>
                                    <div>
                                        <input type="number" step="0.1" className="w-full rounded text-xs py-1 px-1 border-gray-200" value={data.margins.bottom} onChange={e => setData('margins', { ...data.margins, bottom: e.target.value })} />
                                        <label className="text-[9px] text-gray-400 block text-center">Bawah</label>
                                    </div>
                                    <div>
                                        <input type="number" step="0.1" className="w-full rounded text-xs py-1 px-1 border-gray-200" value={data.margins.left} onChange={e => setData('margins', { ...data.margins, left: e.target.value })} />
                                        <label className="text-[9px] text-gray-400 block text-center">Kiri</label>
                                    </div>
                                    <div>
                                        <input type="number" step="0.1" className="w-full rounded text-xs py-1 px-1 border-gray-200" value={data.margins.right} onChange={e => setData('margins', { ...data.margins, right: e.target.value })} />
                                        <label className="text-[9px] text-gray-400 block text-center">Kanan</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Section Spacing (cm)</label>
                                <div className="grid grid-cols-2 gap-1">
                                    <div title="Jarak Header ke Body">
                                        <input type="number" step="0.5" className="w-full rounded text-xs py-1 px-1 border-gray-200" value={data.spacing?.header || 0} onChange={e => setData('spacing', { ...data.spacing, header: e.target.value })} />
                                        <span className="text-[8px] text-gray-400 block text-center">Header Gap</span>
                                    </div>
                                    <div title="Jarak Body ke Footer">
                                        <input type="number" step="0.5" className="w-full rounded text-xs py-1 px-1 border-gray-200" value={data.spacing?.footer || 0} onChange={e => setData('spacing', { ...data.spacing, footer: e.target.value })} />
                                        <span className="text-[8px] text-gray-400 block text-center">Footer Gap</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Line Spacing</label>
                                <select
                                    className="w-full text-xs rounded border-gray-200 py-1"
                                    value={data.spacing?.line_height || 1.15}
                                    onChange={e => setData('spacing', { ...data.spacing, line_height: e.target.value })}
                                >
                                    <option value="1.0">1.0 (Single)</option>
                                    <option value="1.15">1.15 (Default)</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2.0">2.0 (Double)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Paper Area (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-200 custom-scrollbar">
                        <div
                            className="bg-white shadow-xl relative flex flex-col transition-all duration-300 ease-in-out origin-top"
                            style={{
                                width: data.paper_size === 'F4' ? '215mm' : data.paper_size === 'Letter' ? '216mm' : '210mm',
                                minHeight: data.paper_size === 'F4' ? '330mm' : data.paper_size === 'Letter' ? '279mm' : '297mm',
                                padding: `${data.margins.top}cm ${data.margins.right}cm ${data.margins.bottom}cm ${data.margins.left}cm`,
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '11pt',
                                lineHeight: data.spacing?.line_height || 1.15
                            }}
                        >
                            {/* KOP SURAT */}
                            <div className="w-full flex justify-center mb-0" style={{ marginBottom: `${data.spacing?.header || 0}cm` }}>
                                {school?.kop_surat ? (
                                    <img
                                        src={`/storage/${school.kop_surat}`}
                                        alt="Kop Surat"
                                        className="w-full h-auto object-contain max-h-[4cm]"
                                    />
                                ) : (
                                    // Default Fallback Kop
                                    <div className="w-full border-b-4 border-double border-black pb-4 mb-2 flex items-center gap-4 select-none">
                                        <img src={`/storage/${school?.logo}`} alt="Logo" className="h-24 w-auto object-contain" onError={(e) => e.target.style.display = 'none'} />
                                        <div className="text-center w-full">
                                            <h1 className="font-bold text-xl uppercase tracking-wide">Pemerintah Kabupaten Bogor</h1>
                                            <h2 className="font-bold text-2xl uppercase tracking-wider">{school?.nama_sekolah || 'Nama Sekolah'}</h2>
                                            <p className="text-sm italic">{school?.alamat || 'Alamat Sekolah'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* DATE */}
                            {data.posisi_tanggal === 'kanan_atas' && (
                                <div className="text-right mb-4">
                                    Bogor, {new Date(data.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            )}

                            {/* HEADER INFO (Nomor, Lampiran, Perihal) - Tight Spacing */}
                            {!isSK ? (
                                <>
                                    <div className="mb-4">
                                        <table className="w-full border-none border-collapse">
                                            <tbody>
                                                <tr>
                                                    <td className="w-24 align-top py-0 leading-tight">Nomor</td>
                                                    <td className="w-4 align-top py-0 leading-tight">:</td>
                                                    <td className="py-0 leading-tight font-bold">{data.no_surat || '...'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="align-top py-0 leading-tight">Lampiran</td>
                                                    <td className="align-top py-0 leading-tight">:</td>
                                                    <td className="py-0 leading-tight">
                                                        <input
                                                            type="text"
                                                            className="w-full border-none p-0 h-auto text-inherit focus:ring-0 bg-transparent placeholder-gray-400 leading-tight"
                                                            placeholder="-"
                                                            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                                                            value={data.lampiran}
                                                            onChange={e => setData('lampiran', e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="align-top py-0 leading-tight">Perihal</td>
                                                    <td className="align-top py-0 leading-tight">:</td>
                                                    <td className="py-0 leading-tight font-bold">
                                                        <input
                                                            type="text"
                                                            className="w-full border-none p-0 h-auto font-bold focus:ring-0 bg-transparent placeholder-gray-400 leading-tight"
                                                            placeholder="Ketik Perihal..."
                                                            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                                                            value={data.perihal}
                                                            onChange={e => setData('perihal', e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mb-4">
                                        <p className="leading-tight">Kepada Yth.</p>
                                        <input
                                            type="text"
                                            className="w-full border-none p-0 h-auto font-bold focus:ring-0 bg-transparent placeholder-gray-400 leading-tight"
                                            placeholder="Ketik Tujuan..."
                                            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                                            value={data.tujuan}
                                            onChange={e => setData('tujuan', e.target.value)}
                                        />
                                        <p className="leading-tight">di Tempat</p>
                                    </div>
                                </>
                            ) : (
                                /* SK Layout */
                                <div className="text-center mb-8">
                                    <h3 className="font-bold text-lg underline uppercase mb-1">SURAT KEPUTUSAN</h3>
                                    <p className="font-bold text-lg mb-6">{data.no_surat}</p>

                                    <div className="font-bold text-base space-y-1">
                                        <p>Kepala Sekolah {school?.nama_sekolah}</p>
                                        <p>Memutuskan</p>
                                        <div className="flex justify-center mt-2">
                                            <input
                                                type="text"
                                                className="w-full text-center border-none p-0 h-auto font-bold focus:ring-0 bg-transparent placeholder-gray-400 leading-tight uppercase"
                                                placeholder="[PERIHAL KEPUTUSAN]"
                                                style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                                                value={data.perihal}
                                                onChange={e => setData('perihal', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WYSIWYG Editor Body */}
                            <div className="flex-1 relative group min-h-[300px]" style={{ marginTop: `${data.spacing?.body || 0}cm` }}>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={data.isi_surat}
                                    onChange={content => setData('isi_surat', content)}
                                    modules={modules}
                                    placeholder="Ketik isi surat di sini..."
                                    className="h-full focus:outline-none"
                                />
                            </div>

                            {/* DATE BOTTOM */}
                            {data.posisi_tanggal === 'kanan_bawah' && (
                                <div className="text-right mt-8 mb-2">
                                    Bogor, {new Date(data.tanggal_surat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            )}

                            {/* SIGNATURE */}
                            <div className="flex justify-end mt-4">
                                <div className="text-center min-w-[200px]">
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
                                    </div>

                                    <p className="font-bold border-b border-black inline-block min-w-[150px] pb-1 z-20 relative">
                                        {school?.kepala_sekolah || '...'}
                                    </p>
                                    <p>NIP. {school?.nip_kepala_sekolah || '-'}</p>
                                </div>
                            </div>

                            {/* FOOTER */}
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
        </AuthenticatedLayout>
    );
}
