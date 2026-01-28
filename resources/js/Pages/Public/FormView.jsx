import { useForm, Head } from '@inertiajs/react';
import { CheckCircle, AlertCircle, Calendar, UploadCloud, Save } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function FormView({ form }) {
    // Construct initial form state dynamically
    const initialState = {
        consent: false
    };
    form.fields.forEach(field => {
        initialState['field_' + field.id] = '';
    });

    const { data, setData, post, processing, errors, reset, progress } = useForm(initialState);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.consent) {
            Swal.fire({
                title: 'Persetujuan Diperlukan',
                text: 'Anda harus menyetujui pernyataan privasi sebelum mengirim formulir.',
                icon: 'warning'
            });
            return;
        }

        post(route('public.form.submit', form.slug), {
            onSuccess: () => {
                reset();
                setSuccessMessage('Terima kasih! Jawaban Anda telah berhasil dikirim.');
                Swal.fire({
                    title: 'Terkirim!',
                    text: 'Formulir berhasil disubmit.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            },
            onError: (err) => {
                console.error(err);
                Swal.fire({
                    title: 'Gagal',
                    text: 'Mohon periksa kembali isian Anda. Pastikan semua field wajib diisi.',
                    icon: 'error'
                });
            }
        });
    };

    if (successMessage) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Head title={form.title} />
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300">
                    <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sukses!</h2>
                    <p className="text-gray-600 mb-8">{successMessage}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-primary hover:underline font-medium"
                    >
                        Isi formulir lagi
                    </button>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} SIDADU System
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <Head title={form.title} />

            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Card */}
                <div className="bg-white rounded-t-2xl shadow-sm border-t-8 border-t-primary overflow-hidden">
                    <div className="p-6 sm:p-10">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{form.title}</h1>
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed text-base sm:text-lg">
                            {form.description || 'Silakan lengkapi formulir berikut dengan data yang benar.'}
                        </p>

                        {(form.start_at || form.end_at) && (
                            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 items-start">
                                <Calendar size={16} className="mt-0.5" />
                                <div>
                                    {form.start_at && <span className="block">Dibuka: {new Date(form.start_at).toLocaleString('id-ID')}</span>}
                                    {form.end_at && <span className="block text-red-500">Ditutup: {new Date(form.end_at).toLocaleString('id-ID')}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {form.fields.map((field) => (
                        <div key={field.id} className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all ${errors['field_' + field.id] ? 'ring-2 ring-red-500 border-red-500' : 'hover:shadow-md'}`}>
                            <label className="block text-lg font-medium text-gray-900 mb-2">
                                {field.label}
                                {field.is_required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {field.description && (
                                <p className="text-sm text-gray-500 mb-4">{field.description}</p>
                            )}

                            <div className="mt-2">
                                {/* TEXT INPUT */}
                                {field.type === 'text' && (
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary py-3 text-base shadow-sm"
                                        placeholder="Jawaban Anda"
                                        value={data['field_' + field.id]}
                                        onChange={e => setData('field_' + field.id, e.target.value)}
                                        required={field.is_required}
                                    />
                                )}

                                {/* TEXTAREA */}
                                {field.type === 'textarea' && (
                                    <textarea
                                        rows="4"
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary py-3 text-base shadow-sm"
                                        placeholder="Jawaban Anda"
                                        value={data['field_' + field.id]}
                                        onChange={e => setData('field_' + field.id, e.target.value)}
                                        required={field.is_required}
                                    ></textarea>
                                )}

                                {/* NUMBER */}
                                {field.type === 'number' && (
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary py-3 text-base shadow-sm"
                                        placeholder="Angka"
                                        value={data['field_' + field.id]}
                                        onChange={e => setData('field_' + field.id, e.target.value)}
                                        required={field.is_required}
                                    />
                                )}

                                {/* DATE */}
                                {field.type === 'date' && (
                                    <input
                                        type="date"
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary py-3 text-base shadow-sm"
                                        value={data['field_' + field.id]}
                                        onChange={e => setData('field_' + field.id, e.target.value)}
                                        required={field.is_required}
                                    />
                                )}

                                {/* TIME */}
                                {field.type === 'time' && (
                                    <input
                                        type="time"
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary py-3 text-base shadow-sm"
                                        value={data['field_' + field.id]}
                                        onChange={e => setData('field_' + field.id, e.target.value)}
                                        required={field.is_required}
                                    />
                                )}

                                {/* SELECT */}
                                {field.type === 'select' && (
                                    <select
                                        className="w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary py-3 text-base shadow-sm"
                                        value={data['field_' + field.id]}
                                        onChange={e => setData('field_' + field.id, e.target.value)}
                                        required={field.is_required}
                                    >
                                        <option value="">-- Pilih --</option>
                                        {(field.options || []).map((opt, idx) => (
                                            <option key={idx} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                )}

                                {/* RADIO */}
                                {field.type === 'radio' && (
                                    <div className="space-y-3">
                                        {(field.options || []).map((opt, idx) => (
                                            <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name={`field_${field.id}`}
                                                    className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                                                    value={opt}
                                                    checked={data['field_' + field.id] === opt}
                                                    onChange={e => setData('field_' + field.id, e.target.value)}
                                                    required={field.is_required}
                                                />
                                                <span className="text-gray-700">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* CHECKBOX (Multi Select) */}
                                {field.type === 'checkbox' && (
                                    <div className="space-y-3">
                                        {(field.options || []).map((opt, idx) => {
                                            const currentVal = Array.isArray(data['field_' + field.id]) ? data['field_' + field.id] : [];
                                            const isChecked = currentVal.includes(opt);

                                            return (
                                                <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                                        value={opt}
                                                        checked={isChecked}
                                                        onChange={e => {
                                                            let newVal = [...currentVal];
                                                            if (e.target.checked) newVal.push(opt);
                                                            else newVal = newVal.filter(v => v !== opt);
                                                            setData('field_' + field.id, newVal);
                                                        }}
                                                    />
                                                    <span className="text-gray-700">{opt}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* FILE UPLOAD */}
                                {field.type === 'file' && (
                                    <div className="mt-2">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-8 h-8 mb-3 text-gray-400 group-hover:text-primary transition-colors" />
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span></p>
                                                <p className="text-xs text-gray-500">Maksimal 1GB (Video/PDF/Gambar)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={e => setData('field_' + field.id, e.target.files[0])}
                                            />
                                        </label>
                                        {data['field_' + field.id] && (
                                            <div className="mt-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg inline-flex items-center gap-2">
                                                <CheckCircle size={14} className="text-blue-500" />
                                                File terpilih: {data['field_' + field.id]?.name}
                                            </div>
                                        )}
                                        {progress && (
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors['field_' + field.id] && (
                                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2 animate-pulse">
                                        <AlertCircle size={14} /> {errors['field_' + field.id].replace('field_', 'Isian ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Privacy & COPPA Consent */}
                    <div className={`p-6 rounded-2xl border transition-all ${errors.consent ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-100'}`}>
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="flex items-center h-6">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-0"
                                    checked={data.consent}
                                    onChange={e => setData('consent', e.target.checked)}
                                />
                            </div>
                            <div className="text-sm leading-relaxed text-slate-700">
                                <p className="font-bold text-slate-900 mb-1">Persetujuan Pengolahan Data (Privacy Consent)</p>
                                <p>Saya menyatakan bahwa data yang saya berikan adalah benar. Saya memahami dan setuju bahwa data ini akan disimpan sesuai dengan <a href="#" onClick={(e) => { e.preventDefault(); Swal.fire({ title: 'Ringkasan Legal', html: '<div class="text-left text-xs space-y-4 font-sans"><p class="text-justify">Data Anda dilindungi di bawah <b>UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi</b>.</p><div class="bg-blue-50 p-3 rounded-lg border border-blue-100"><h4 class="font-bold text-blue-900 mb-1">Ketentuan Utama:</h4><ul class="list-disc pl-4 space-y-1 text-blue-800"><li>Data disimpan mandiri (Self-Hosted) di server sekolah.</li><li>Enkripsi AES-256-CBC untuk data sensitif.</li><li>Hak Subjek Data dijamin penuh oleh Institusi.</li></ul></div><p class="text-slate-500 italic border-t pt-2 mt-2">Untuk membaca <b>Dokumen Legal Lengkap (15 BAB)</b> termasuk Syarat Penggunaan & Disclaimer, silakan akses menu "Kebijakan Privasi" pada halaman Login Aplikasi.</p></div>', icon: 'info', confirmButtonText: 'Saya Mengerti' }) }} className="text-primary font-bold hover:underline">Kebijakan Privasi & Syarat Penggunaan</a>.</p>
                                {errors.consent && (
                                    <p className="text-red-600 font-bold mt-2 flex items-center gap-1">
                                        <AlertCircle size={14} /> Anda wajib menyetujui pernyataan ini.
                                    </p>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-between items-center pt-6 pb-12">
                        <div className="text-sm text-gray-500">
                            * Wajib diisi
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg shadow-primary/30 flex items-center gap-2 transform transition-all ${processing ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}`}
                        >
                            {processing ? 'Mengirim...' : 'KIRIM JAWABAN'} <Save size={20} />
                        </button>
                    </div>

                </form>

                <div className="text-center pb-8 border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-400">Powered by <b>SIDADU Forms</b></p>
                </div>

            </div>
        </div>
    );
}
