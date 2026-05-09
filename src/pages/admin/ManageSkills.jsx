import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import adminService from '../../services/adminService';

const { Plus, Edit2, Trash2, Save, X, GraduationCap, Loader2 } = Lucide;

const ICON_LIST = [
    'Code', 'Script', 'Cpu', 'Database', 'Globe', 'Smartphone', 'Server', 'Terminal', 'Figma', 'Box', 'Hexagon', 'Component', 'GraduationCap', 'Layout', 'Layers', 'Hash', 'ListOrdered'
];

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSkill, setCurrentSkill] = useState({ Name: '', Category: '', Proficiency: '', IconName: '', DisplayOrder: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSkills(); }, []);

    const fetchSkills = async () => {
        try {
            const data = await adminService.getSkills();
            setSkills(data);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    const handleEdit = (skill) => {
        setCurrentSkill({ ...skill });
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;
        try { await adminService.deleteSkill(id); fetchSkills(); } catch (err) { console.error(err); }
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
                await adminService.updateSkill(currentSkill.Id, currentSkill);
                showToast("Skill updated successfully!");
            } else {
                await adminService.createSkill({ ...currentSkill, ProfileId: 1 });
                showToast("Skill created successfully!");
            }
            fetchSkills();
            setModalOpen(false);
            resetForm();
        } catch (err) {
            console.error("Submit failed:", err);
            showToast("Operation failed. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setCurrentSkill({ Name: '', Category: '', Proficiency: '', IconName: '', DisplayOrder: 0 });
        setIsEditing(false);
    };

    const DynamicIcon = ({ name, size = 24, className }) => {
        const IconComponent = Lucide[name] || GraduationCap;
        return <IconComponent size={size} className={className} />;
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Updating Skill Matrix</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 relative">
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

            <div className="flex justify-between items-end border-b border-white/5 pb-12 mb-12">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-normal bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent uppercase italic">Technical Skills</h2>
                    <p className="text-slate-400 font-medium max-w-2xl text-lg">Manage your technical stack. Categorize your skills and define your proficiency levels.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setModalOpen(true); }}
                    className="group bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-10 py-5 rounded-3xl flex items-center gap-4 font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(8,145,178,0.2)] active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500 text-cyan-200" /> Add New Skill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {skills.map((skill) => (
                    <motion.div
                        key={skill.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 hover:bg-white/[0.05] transition-all relative group shadow-2xl"
                    >
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(skill)} className="p-3 bg-white/5 rounded-2xl hover:bg-purple-600 transition-all shadow-xl"><Edit2 size={12} /></button>
                            <button onClick={() => handleDelete(skill.Id)} className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all shadow-xl"><Trash2 size={12} /></button>
                        </div>
                        <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
                            <DynamicIcon name={skill.IconName} size={24} />
                        </div>
                        <h4 className="text-xl font-bold tracking-tight mb-2 uppercase text-white">{skill.Name}</h4>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">{skill.Category}</p>
                            <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest leading-none">Order: {skill.DisplayOrder}</p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Proficiency</span>
                            <span className="text-xs font-bold text-emerald-500">{skill.Proficiency}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 selection:bg-purple-600">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl rounded-[60px] relative z-[101] p-16">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-3xl font-bold tracking-tighter text-white">{isEditing ? 'Edit Skill' : 'New Skill'}</h3>
                                <button onClick={() => setModalOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-red-500/20 transition-all text-white"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-2 gap-8 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Skill Name</label>
                                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 outline-none transition-all text-white" value={currentSkill.Name} onChange={(e) => setCurrentSkill({ ...currentSkill, Name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Category</label>
                                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 outline-none transition-all text-white" value={currentSkill.Category} onChange={(e) => setCurrentSkill({ ...currentSkill, Category: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Proficiency</label>
                                        <input className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 outline-none transition-all text-white" value={currentSkill.Proficiency} onChange={(e) => setCurrentSkill({ ...currentSkill, Proficiency: e.target.value })} placeholder="Beginner/Intermediate/Advanced" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Display Order</label>
                                        <input type="number" className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 outline-none transition-all text-white" value={currentSkill.DisplayOrder} onChange={(e) => setCurrentSkill({ ...currentSkill, DisplayOrder: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>
                                <div className="space-y-4 text-left">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 px-1">Icon (Select Icon)</label>
                                    <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-[35px]">
                                        {ICON_LIST.map(key => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setCurrentSkill({ ...currentSkill, IconName: key })}
                                                className={`p-3 rounded-xl transition-all ${currentSkill.IconName === key ? 'bg-purple-600 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                                            >
                                                <DynamicIcon name={key} size={16} />
                                            </button>
                                        ))}
                                    </div>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 focus:border-purple-600 outline-none transition-all text-xs text-gray-400" value={currentSkill.IconName} onChange={(e) => setCurrentSkill({ ...currentSkill, IconName: e.target.value })} placeholder="Custom Lucide name..." />
                                </div>
                                <div className="pt-10 flex justify-end gap-6 border-t border-white/5">
                                    <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white px-16 py-5 rounded-full flex items-center justify-center gap-4 font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-purple-600/30">
                                        {saving ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? 'Update Skill' : 'Create Skill')} <Save size={18} />
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

export default ManageSkills;
