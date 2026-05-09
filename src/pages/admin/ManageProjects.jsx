import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit2, Trash2, ExternalLink, Github, Loader2, X, Save,
    Image as ImageIcon, Upload
} from 'lucide-react';
import adminService from '../../services/adminService';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        Title: '', Category: '', Description: '', ImageUrl: '',
        Technologies: '', GithubLink: '', LiveLink: '', DisplayOrder: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await adminService.getProjects();
            setProjects(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!id) return;

        const confirmed = window.confirm("Are you sure you want to delete this project?");
        if (!confirmed) return;
        
        try {
            await adminService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.Id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            const errorMsg = err.response?.data?.Message || err.message || "Unknown error";
            alert(`Could not delete: ${errorMsg}`);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await adminService.uploadImage(file);
            setCurrentProject({ ...currentProject, ImageUrl: result.url });
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
                await adminService.updateProject(currentProject.Id, currentProject);
                showToast("Project updated successfully!");
            } else {
                await adminService.createProject({ ...currentProject, ProfileId: 1 });
                showToast("Project created successfully!");
            }
            fetchProjects();
            setModalOpen(false);
            resetForm();
        } catch (err) {
            console.error(err);
            showToast("Operation failed. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    };

    const removeImage = () => {
        setCurrentProject({ ...currentProject, ImageUrl: '' });
    };

    const resetForm = () => {
        setCurrentProject({
            Title: '', Category: '', Description: '', ImageUrl: '',
            Technologies: '', GithubLink: '', LiveLink: '', DisplayOrder: 0
        });
        setIsEditing(false);
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Projects Library</p>
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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-normal bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent uppercase italic">Projects Portfolio</h2>
                    <p className="text-slate-400 font-medium max-w-2xl leading-relaxed text-lg">
                        Curate your showcase. Every project you add here will be beautifully 
                        rendered with premium animations on the live site.
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setModalOpen(true); }}
                    className="group bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white px-10 py-5 rounded-3xl flex items-center gap-4 font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500 text-cyan-400" /> Add New Entry
                </button>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.sort((a,b) => a.DisplayOrder - b.DisplayOrder).map((project, idx) => (
                    <motion.div
                        key={project.Id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05, ease: "easeOut" }}
                        whileHover={{ y: -8 }}
                        className="group bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative backdrop-blur-3xl hover:border-purple-500/30 transition-all duration-500"
                    >
                        <div className="h-56 relative overflow-hidden p-3">
                            <img
                                src={project.ImageUrl || 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=800'}
                                alt={project.Title}
                                className="w-full h-full object-cover rounded-[30px] group-hover:scale-105 transition-all duration-1000 shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                            <span className="absolute bottom-6 left-8 bg-purple-600 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase text-white shadow-xl">{project.Category}</span>
                        </div>

                        <div className="p-10 flex-1 flex flex-col">
                            <h3 className="text-2xl font-black tracking-normal mb-4 group-hover:text-purple-400 transition-colors uppercase italic text-white">{project.Title}</h3>
                            <p className="text-gray-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{project.Description}</p>

                             <div className="mt-auto flex items-center justify-between gap-4 pt-8 border-t border-white/5 relative z-[20]">
                                <div className="flex gap-4 relative z-[30]">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(project);
                                        }}
                                        className="p-4 bg-white/5 hover:bg-purple-600 hover:text-white rounded-2xl transition-all border border-white/5 cursor-pointer pointer-events-auto"
                                        title="Edit Project"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(project.Id);
                                        }}
                                        className="p-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all border border-white/5 cursor-pointer pointer-events-auto"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="flex gap-5 text-gray-500 relative z-[30]">
                                    <a 
                                        href={project.GithubLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-all transform hover:scale-110 cursor-pointer pointer-events-auto"
                                    >
                                        <Github size={20} />
                                    </a>
                                    <a 
                                        href={project.LiveLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:text-purple-400 transition-all transform hover:scale-110 cursor-pointer pointer-events-auto"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 selection:bg-purple-600">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                            onClick={() => setModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#050505] border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[60px] relative z-[101] shadow-2xl p-10 md:p-20"
                        >
                            <div className="flex justify-between items-center mb-16">
                                <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white">
                                    {isEditing ? 'Refine Project' : 'New Creation'}
                                </h3>
                                <button onClick={() => setModalOpen(false)} className="p-5 bg-white/5 rounded-full hover:bg-red-500 transition-all text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                                {/* Left Column: Visuals & Links */}
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-purple-500 px-1 italic">Branding & Assets</label>
                                        <div className="aspect-video bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden relative group/img shadow-2xl">
                                            {currentProject.ImageUrl ? (
                                                <>
                                                    <img src={currentProject.ImageUrl} alt="Preview" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-1000" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                                        <button type="button" onClick={removeImage} className="bg-red-500 p-5 rounded-full text-white hover:scale-110 transition-transform shadow-xl"><Trash2 size={24} /></button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/5 gap-6">
                                                    <ImageIcon size={64} strokeWidth={1} />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-center px-10 leading-relaxed">No Preview Available</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[9px] uppercase font-black text-gray-600 tracking-widest">Image Source Link</span>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    disabled={uploading}
                                                    className="text-[9px] font-black uppercase tracking-widest text-purple-400 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                    {uploading ? 'Processing' : 'Upload Image'}
                                                </button>
                                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" />
                                            </div>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-purple-500 outline-none transition-all placeholder:text-gray-800 text-white font-light text-xs"
                                                value={currentProject.ImageUrl}
                                                onChange={(e) => setCurrentProject({ ...currentProject, ImageUrl: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-purple-500 px-1 italic">Source & Distribution</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <span className="text-[9px] uppercase font-black text-gray-600 px-2 flex items-center gap-2"><Github size={12}/> Repository</span>
                                                <input
                                                    placeholder="GitHub URL"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all text-white text-xs placeholder:text-gray-800"
                                                    value={currentProject.GithubLink || ''}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, GithubLink: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-[9px] uppercase font-black text-gray-600 px-2 flex items-center gap-2"><ExternalLink size={12}/> Live Demo</span>
                                                <input
                                                    placeholder="Website URL"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all text-white text-xs placeholder:text-gray-800"
                                                    value={currentProject.LiveLink || ''}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, LiveLink: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[9px] uppercase font-black text-gray-600 px-2 italic">Stack (Comma Separated)</span>
                                            <input
                                                placeholder="React, .NET, SQL Server..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 outline-none transition-all text-white text-xs placeholder:text-gray-800"
                                                value={currentProject.Technologies || ''}
                                                onChange={(e) => setCurrentProject({ ...currentProject, Technologies: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Content & Controls */}
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <label className="text-[10px] uppercase tracking-[0.4em] font-black text-purple-500 px-1 italic">Core Content</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <span className="text-[9px] uppercase font-black text-gray-600 px-2">Project Title</span>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-purple-500 outline-none transition-all text-white font-black text-xl italic"
                                                    value={currentProject.Title}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, Title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-[9px] uppercase font-black text-gray-600 px-2">Category Tag</span>
                                                <input
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-purple-500 outline-none transition-all text-white font-black text-xl italic"
                                                    value={currentProject.Category}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, Category: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[9px] uppercase font-black text-gray-600 px-2">Extended Description</span>
                                            <textarea
                                                required
                                                rows="8"
                                                className="w-full bg-white/5 border border-white/10 rounded-[40px] p-8 focus:border-purple-500 outline-none transition-all text-white font-light text-sm leading-relaxed resize-none shadow-inner"
                                                value={currentProject.Description}
                                                onChange={(e) => setCurrentProject({ ...currentProject, Description: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 pt-4">
                                            <div className="space-y-2">
                                                <span className="text-[9px] uppercase font-black text-gray-600 px-2">Display Sequence</span>
                                                <input
                                                    type="number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-purple-500 outline-none transition-all text-white font-bold"
                                                    value={currentProject.DisplayOrder}
                                                    onChange={(e) => setCurrentProject({ ...currentProject, DisplayOrder: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="flex flex-col justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-2xl flex items-center justify-center gap-4 font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-purple-600/30 disabled:opacity-50 h-[74px]"
                                                >
                                                    {saving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                                    {saving ? 'Syncing...' : (isEditing ? 'Update Archive' : 'Publish Entry')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12 border-t border-white/5 flex justify-between items-center">
                                        <p className="text-[9px] text-gray-700 uppercase font-bold tracking-widest italic leading-loose">Automated Versioning Active<br/>Changes are persistent upon synchronization</p>
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-colors"
                                        >
                                            Discard Progress
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProjects;

