import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles, Search, BookOpen, ArrowRight, Loader2, Download } from 'lucide-react';
import axios from 'axios';

export default function Index({ auth }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults(null);
        setAiMessage('');

        // Simulate "Thinking" steps
        setTimeout(() => setAiMessage('Menganalisis Kurikulum Merdeka...'), 500);
        setTimeout(() => setAiMessage('Mencari referensi modul ajar yang relevan...'), 1500);
        setTimeout(() => setAiMessage('Menyusun rekomendasi pembelajaran...'), 2500);

        try {
            const response = await axios.post(route('modul-ajar.search'), { query });
            // Artificial delay to let the animation play
            setTimeout(() => {
                setResults(response.data.results);
                setAiMessage(response.data.ai_analysis);
                setLoading(false);
            }, 3000);
        } catch (error) {
            setLoading(false);
            setAiMessage('Maaf, terjadi kesalahan saat menghubungi AI.');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Modul Ajar AI</h2>}
        >
            <Head title="Modul Ajar AI" />

            <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-12 px-4 transition-all">

                {/* Hero Section */}
                <div className={`w-full max-w-3xl text-center transition-all duration-700 ${results ? 'mt-0 mb-8' : 'mt-20'}`}>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in shadow-lg shadow-blue-500/20">
                        <Sparkles size={16} className="animate-pulse" />
                        <span>Powered by Educational Intelligence</span>
                    </div>

                    {!results && (
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Apa yang ingin Anda ajarkan hari ini?
                        </h1>
                    )}

                    {!results && (
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                            Temukan modul ajar, RPP, dan materi pembelajaran yang dipersonalisasi dalam hitungan detik.
                        </p>
                    )}

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative group z-10">
                        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${loading ? 'animate-pulse opacity-75' : ''}`}></div>
                        <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="pl-6 text-gray-400">
                                {loading ? <Loader2 className="animate-spin text-primary" /> : <Search />}
                            </div>
                            <input
                                type="text"
                                className="w-full py-5 px-4 text-lg border-none focus:ring-0 text-gray-800 dark:text-gray-100 bg-transparent placeholder-gray-400"
                                placeholder="Contoh: Modul Ajar Matematika Fase E tentang Logaritma..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="mr-3 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                            >
                                Cari
                            </button>
                        </div>
                    </form>

                    {/* AI Message / Loading State */}
                    {loading && (
                        <div className="mt-8 flex flex-col items-center animate-fade-in">
                            <div className="h-1 w-64 bg-gray-200 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 w-1/2 animate-shimmer"></div>
                            </div>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium animate-pulse">
                                {aiMessage}
                            </p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {results && (
                    <div className="w-full max-w-5xl animate-fade-in-up">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 mb-8 flex gap-4 items-start">
                            <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg shrink-0">
                                <Sparkles className="text-blue-600 dark:text-blue-300" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-1">Analisis AI</h3>
                                <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-sm">
                                    {aiMessage}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((item, index) => (
                                <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <BookOpen size={24} />
                                        </div>
                                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            {item.relevance}% Match
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
                                        {item.summary}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {item.tags.map((tag, idx) => (
                                            <span key={idx} className="text-[10px] font-mono uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center justify-center gap-2">
                                        <Download size={16} /> Download Modul
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
