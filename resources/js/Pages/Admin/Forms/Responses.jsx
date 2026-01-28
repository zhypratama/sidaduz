import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, User } from 'lucide-react';

export default function Responses({ auth, form, responses }) {

    const getFieldValue = (response, fieldId) => {
        const val = response.values.find(v => v.form_field_id === fieldId);
        if (!val) return '-';

        // Check if value is JSON (for checkbox array)
        try {
            const parsed = JSON.parse(val.value);
            if (Array.isArray(parsed)) return parsed.join(', ');
            return val.value;
        } catch (e) {
            // Check if it looks like a file path
            if (val.value.startsWith('form_uploads/')) {
                return (
                    <a href={`/storage/${val.value}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                        <FileText size={14} /> Lihat Fiel
                    </a>
                );
            }
            return val.value;
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
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Jawaban Masuk</h2>
                            <p className="text-xs text-gray-500">{form.title}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Respon: ${form.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 table-responsive">

                        {responses.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                Belum ada jawaban yang masuk.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 whitespace-nowrap">Waktu Submit</th>
                                            <th className="px-6 py-3 whitespace-nowrap">User / IP</th>
                                            {form.fields.map(field => (
                                                <th key={field.id} className="px-6 py-3 min-w-[150px]">{field.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {responses.data.map(response => (
                                            <tr key={response.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(response.created_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {response.user_id ? (
                                                        <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded w-fit">
                                                            <User size={12} /> {response.user_id}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 font-mono text-xs">{response.ip_address}</span>
                                                    )}
                                                </td>
                                                {form.fields.map(field => (
                                                    <td key={field.id} className="px-6 py-4">
                                                        {getFieldValue(response, field.id)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {responses.links && responses.links.length > 3 && (
                            <div className="p-4 border-t border-gray-100 flex justify-center">
                                <div className="flex gap-1">
                                    {responses.links.map((link, k) => (
                                        <Link
                                            key={k}
                                            href={link.url}
                                            className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
