import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Loader2, Upload, Camera } from 'lucide-react';
import adminService from '../../services/adminService';

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [current, setCurrent] = useState({ ClientName: '', ClientRole: '', Company: '', Feedback: '', ImageUrl: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        try { const data = await adminService.getTestimonials(); setTestimonials(data); setLoading(false); }
        catch (err) { console.error(err); }
    };

    const handleEdit = (t) => { setCurrent(t); setIsEditing(true); setModalOpen(true); };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try { await adminService.deleteTestimonial(id); fetchTestimonials(); } catch (err) { console.error(err); }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await adminService.uploadImage(file);
            setCurrent({ ...current, ImageUrl: result.url });
        } catch (err) {
            console.error(err);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const [notification, setNotification] = useState(null);

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing) {
                await adminService.updateTestimonial(current.Id, current);
                showToast("Testimonial updated successfully!");
            } else {
                await adminService.createTestimonial({ ...current, ProfileId: 1 });
                showToast("Testimonial created successfully!");
            }
            fetchTestimonials();
            setModalOpen(false);
            resetForm();
        } catch (err) { 
            console.error(err); 
            showToast("Operation failed. Please try again.", "error");
        } finally { 
            setSaving(false); 
        }
    };

    const resetForm = () => { setCurrent({ ClientName: '', ClientRole: '', Company: '', Feedback: '', ImageUrl: '' }); setIsEditing(false); };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Client Testimonials</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 relative">
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-0 left-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 border ${
                            notification.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}
                    >
                        {notification.type === 'success' ? <Save size={16} /> : <X size={16} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold tracking-tighter mb-2">Social Proof</h2>
                    <p className="text-gray-500 font-light">Manage client testimonials. These will be displayed as social proof of your professional integrity.</p>
                </div>
                <button onClick={() => { resetForm(); setModalOpen(true); }} className="bg-purple-600 px-8 py-4 rounded-full flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-600/30">
                    <Plus size={18} /> Add Testimonial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {testimonials.map((t, idx) => (
                    <motion.div key={t.Id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.03] border border-white/5 rounded-[45px] p-10 hover:bg-white/[0.05] transition-all relative group flex gap-8">
                        <div className="w-24 h-24 rounded-[30px] overflow-hidden bg-gray-800 flex-shrink-0 animate-in fade-in duration-1000">
                            <img src={t.ImageUrl || `https://i.pravatar.cc/150?u=${t.Id}`} alt={t.ClientName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-bold tracking-tight uppercase leading-none">{t.ClientName}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">{t.ClientRole} @ {t.Company}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="p-3 bg-white/5 rounded-2xl hover:bg-purple-600 transition-all shadow-xl"><Edit2 size={12} /></button>
                                    <button onClick={() => handleDelete(t.Id)} className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all shadow-xl"><Trash2 size={12} /></button>
                                </div>
                            </div>
                            <p className="text-gray-500 font-light leading-relaxed italic text-sm">"{t.Feedback}"</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 selection:bg-purple-600">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-[60px] relative z-[101] p-16">
                            <h3 className="text-3xl font-bold tracking-tighter mb-12">{isEditing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Client Name</label>
                                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 transition-all" value={current.ClientName} onChange={(e) => setCurrent({ ...current, ClientName: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Client Role</label>
                                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 transition-all" value={current.ClientRole} onChange={(e) => setCurrent({ ...current, ClientRole: e.target.value })} />
                                    </div>
                                </div>
                                 <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex items-center gap-2">
                                            <Camera size={14} className="text-purple-500" /> Client Photo Reference
                                        </label>
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current.click()} 
                                            disabled={uploading}
                                            className="text-[9px] font-black uppercase tracking-widest text-purple-400 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                            {uploading ? 'Processing' : 'Upload Image'}
                                        </button>
                                    </div>
                                    <input 
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 outline-none transition-all text-xs text-gray-400" 
                                        value={current.ImageUrl} 
                                        onChange={(e) => setCurrent({ ...current, ImageUrl: e.target.value })} 
                                        placeholder="Paste URL or use upload button..."
                                    />
                                    {current.ImageUrl && (
                                        <div className="mt-4 flex justify-center">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
                                                <img src={current.ImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Testimonial Feedback</label>
                                    <textarea required rows="4" className="w-full bg-white/5 border border-white/10 rounded-[35px] p-8 focus:border-purple-600 outline-none transition-all resize-none" value={current.Feedback} onChange={(e) => setCurrent({ ...current, Feedback: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
                                    <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white px-16 py-5 rounded-full flex items-center justify-center gap-4 font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-purple-600/30">
                                        {saving ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? 'Update Feedback' : 'Save Testimonial')} <Save size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageTestimonials;
