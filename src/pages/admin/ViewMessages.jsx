import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Calendar, Trash2, Loader2, MessageSquare, ArrowRight, CheckCircle, Search, Filter } from 'lucide-react';
import adminService from '../../services/adminService';

const ViewMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await adminService.getMessages();
            setMessages(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        setDeleting(id);
        try {
            await adminService.deleteMessage(id);
            setMessages(messages.filter(m => m.Id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Retrieving Communications</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tighter mb-2 text-white">Inbound Messages</h2>
                    <p className="text-gray-400 font-medium">Manage your client inquiries. All messages sent from the contact form appear here.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500">
                        <Filter size={14} /> Sort By: Newest
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {messages.length === 0 ? (
                    <div className="p-24 bg-white/[0.02] border border-white/5 border-dashed rounded-[50px] flex flex-col items-center justify-center text-center opacity-40">
                        <MessageSquare size={64} className="mb-6 text-gray-600" />
                        <p className="text-2xl font-bold tracking-tight text-gray-500">No messages yet.</p>
                        <p className="text-sm font-light text-gray-700">Client inquiries will appear here as soon as they reach out.</p>
                    </div>
                ) : (
                    messages.map((message, idx) => (
                        <motion.div
                            key={message.Id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/[0.03] border border-white/5 rounded-[40px] p-10 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                        >
                            <div className="grid md:grid-cols-4 gap-10 items-start">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-purple-500">
                                        <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-xl font-bold">{message.Name.charAt(0)}</div>
                                        <div>
                                            <h4 className="font-bold tracking-tight text-lg text-white">{message.Name}</h4>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2"><Mail size={10} /> {message.Email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <h5 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{message.Subject || 'Portfolio Inquiry'}</h5>
                                    <p className="text-gray-200 font-medium leading-relaxed italic">"{message.Message}"</p>
                                </div>

                                <div className="flex flex-col items-end justify-between self-stretch text-right">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest flex items-center gap-2 justify-end"><Calendar size={10} /> {new Date(message.CreatedAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">{new Date(message.CreatedAt).toLocaleTimeString()}</p>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(message.Id)}
                                        disabled={deleting === message.Id}
                                        className="mt-10 p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all self-end opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                    >
                                        {deleting === message.Id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ViewMessages;
