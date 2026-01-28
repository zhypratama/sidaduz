import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, ChevronRight, Minimize2, ExternalLink } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function AiAssistant() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: `Halo ${auth?.user?.name || 'Admin'}! 👋\nSaya SIDADU AI Assistant. Saya bisa membantu Anda merekap data atau navigasi menu.\n\nContoh: "Berapa jumlah siswa?" atau "Buka data guru".`
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            // Focus input when opened
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');

        // Add User Message
        const newMsgId = Date.now();
        setMessages(prev => [...prev, { id: newMsgId, type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await axios.post(route('ai.chat'), { message: userMessage });
            const data = response.data;

            // Add Bot Response
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: data.text,
                action: data.action,
                url: data.url
            }]);

            // Handle Auto Navigation
            if (data.action === 'navigate' && data.url) {
                // Determine if we wait or go immediately. Maybe a small delay for UX.
                // For now, let's just let the user click the link if they want, OR auto navigate?
                // Auto navigate feels "AI-ish".
                setTimeout(() => {
                    if (window.confirm(`AI ingin mengarahkan Anda ke halaman: ${data.url}\nLanjutkan?`)) {
                        router.visit(data.url);
                        setIsOpen(false); // Close chat on nav
                    }
                }, 1000);
            }

        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Maaf, terjadi kesalahan pada server. Coba lagi nanti."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Quick Prompts
    const prompts = [
        "Jumlah siswa?",
        "Buka Surat Masuk",
        "Total Guru?",
        "Cari siswa..."
    ];

    const handlePromptClick = (text) => {
        setInput(text);
        // Optional: auto submit
        // handleSend({ preventDefault: () => {} });
        inputRef.current?.focus();
    };

    // Formatter for bold text from server (**text**)
    const formatText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    if (!auth.user) return null;

    return (
        <>
            {/* Trigger Button (Floating) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed z-40 bottom-6 right-6 p-0 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isOpen ? 'rotate-90 bg-slate-800 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white animate-bounce-slow'}`}
                title="SIDADU AI Assistant"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
            </button>

            {/* Chat Window */}
            <div className={`fixed z-50 bottom-24 right-6 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`} style={{ maxHeight: '600px', height: '80vh' }}>

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <Bot size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">SIDADU AI</h3>
                            <p className="text-slate-400 text-xs flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    {/* Controls */}
                    {/* <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                        <Minimize2 size={16} />
                    </button> */}
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.type === 'bot' && (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                                    <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                }`}>
                                <div className="whitespace-pre-line">{formatText(msg.text)}</div>

                                {msg.action === 'navigate' && msg.url && (
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                                        <button
                                            onClick={() => {
                                                router.visit(msg.url);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            <ExternalLink size={12} />
                                            Buka Halaman
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 mr-2 mt-1"></div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts & Input */}
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">

                    {messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
                            {prompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePromptClick(prompt)}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full whitespace-nowrap transition-colors border border-transparent hover:border-slate-300"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik perintah..."
                            className="w-full bg-slate-100 dark:bg-slate-800 border-0 text-slate-800 dark:text-white rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-slate-400">Powered by SIDADU Logic Engine v1.0</span>
                    </div>
                </div>
            </div>
        </>
    );
}

// Add global styles for detailed scrollbar in App.css / index.css if needed,
// usually Tailwind scrollbar-hide or custom class handles it.
