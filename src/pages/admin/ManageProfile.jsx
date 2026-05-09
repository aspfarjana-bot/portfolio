import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Save, User, Mail, Phone, MapPin, Github, Linkedin, Twitter, 
    FileText, Loader2, CheckCircle, MessageSquare, Camera, Instagram,
    Trash2, Upload, Image as ImageIcon, Link as LinkIcon, Lock, Key, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import adminService from '../../services/adminService';

const ManageProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    
    // Password state
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

    const logoInputRef = useRef();
    const avatarInputRef = useRef();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await adminService.getProfile();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setStatus(null);
        try {
            await adminService.updateProfile(profile.Id, profile);
            setStatus({ type: 'success', msg: 'Profile saved successfully!' });
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to save. Please try again.' });
        } finally {
            setSaving(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingLogo(true);
        try {
            const result = await adminService.uploadImage(file);
            setProfile({ ...profile, LogoImageUrl: result.url });
            setStatus({ type: 'success', msg: 'Logo uploaded! Click Save to apply.' });
        } catch (err) {
            setStatus({ type: 'error', msg: 'Logo upload failed.' });
        } finally {
            setUploadingLogo(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingAvatar(true);
        try {
            const result = await adminService.uploadImage(file);
            setProfile({ ...profile, ImageUrl: result.url });
            setStatus({ type: 'success', msg: 'Avatar uploaded! Click Save to apply.' });
        } catch (err) {
            setStatus({ type: 'error', msg: 'Avatar upload failed.' });
        } finally {
            setUploadingAvatar(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatus({ type: 'error', msg: 'New passwords do not match!' });
            setTimeout(() => setStatus(null), 4000);
            return;
        }
        
        setChangingPassword(true);
        setStatus(null);
        try {
            await adminService.changePassword({ 
                CurrentPassword: passwordData.currentPassword, 
                NewPassword: passwordData.newPassword 
            });
            setStatus({ type: 'success', msg: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err?.response?.data?.Message || 'Failed to change password. Please check your current password.' });
        } finally {
            setChangingPassword(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Loading Profile...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-normal bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent uppercase italic">Profile Identity</h2>
                    <p className="text-slate-400 font-medium max-w-2xl text-lg leading-relaxed">Update your personal information, professional identity, and social connectivity with a premium aesthetic.</p>
                </div>
                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -30, scale: 0.9, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                            exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
                            className={`fixed top-12 left-1/2 z-[100] px-8 py-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-2xl backdrop-blur-xl border ${
                                status.type === 'success' 
                                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                    : 'bg-red-500/20 border-red-500/40 text-red-400'
                            }`}
                        >
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {status.msg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Left Column: Visual Identity */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Logo Upload Card */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Navbar Logo</h3>
                        <p className="text-gray-500 text-xs">Upload an image logo, or use text initials below.</p>
                        
                        {/* Logo Preview */}
                        <div className="flex justify-center">
                            <div className="w-32 h-16 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                                {profile?.LogoImageUrl ? (
                                    <img src={profile.LogoImageUrl} alt="Logo" className="h-full object-contain" />
                                ) : (
                                    <span className="text-white font-black text-2xl italic">{profile?.LogoText || 'AB'}</span>
                                )}
                            </div>
                        </div>

                        {/* Upload & Remove Buttons */}
                        <div className="space-y-3">
                            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            <button type="button" onClick={() => logoInputRef.current.click()}
                                disabled={uploadingLogo}
                                className="w-full flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 rounded-2xl py-3 text-xs font-bold transition-all"
                            >
                                {uploadingLogo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                {uploadingLogo ? 'Uploading...' : 'Upload Logo Image'}
                            </button>
                            {profile?.LogoImageUrl && (
                                <button type="button" onClick={() => setProfile({ ...profile, LogoImageUrl: '' })}
                                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl py-3 text-xs font-bold transition-all"
                                >
                                    <Trash2 size={14} /> Remove Logo Image
                                </button>
                            )}
                        </div>

                        {/* Logo Text Fallback */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Logo Text (Fallback)</label>
                            <input type="text" maxLength={5}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-purple-500 outline-none text-sm font-black text-white text-center uppercase tracking-widest"
                                value={profile?.LogoText || ''}
                                onChange={(e) => setProfile({ ...profile, LogoText: e.target.value })}
                                placeholder="e.g. AB"
                            />
                        </div>
                    </div>

                    {/* Avatar Card */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Profile Photo</h3>
                        
                        <div className="flex justify-center relative group">
                            <div className="w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-black/40 flex items-center justify-center">
                                {profile?.ImageUrl ? (
                                    <img src={profile.ImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={32} className="text-gray-600" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                            <button type="button" onClick={() => avatarInputRef.current.click()}
                                disabled={uploadingAvatar}
                                className="w-full flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 rounded-2xl py-3 text-xs font-bold transition-all"
                            >
                                {uploadingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                            </button>
                            
                            {/* Or paste URL */}
                            <div className="space-y-1">
                                <label className="text-xs text-gray-600">Or paste image URL:</label>
                                <input type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 focus:border-purple-500 outline-none text-xs text-gray-400"
                                    value={profile?.ImageUrl || ''}
                                    onChange={(e) => setProfile({ ...profile, ImageUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Core Details */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Personal Info */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-4">Personal Info</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Full Name', icon: User, key: 'Name' },
                                { label: 'Job Title', icon: FileText, key: 'Title' },
                                { label: 'Email', icon: Mail, key: 'Email' },
                                { label: 'Phone', icon: Phone, key: 'Phone' },
                                { label: 'Location', icon: MapPin, key: 'Location' },
                                { label: 'Resume URL', icon: LinkIcon, key: 'ResumeUrl' },
                            ].map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">{field.label}</label>
                                    <div className="relative">
                                        <field.icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 focus:border-purple-500 outline-none text-sm text-white"
                                            value={profile?.[field.key] || ''}
                                            onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hero Subtitle</label>
                                <textarea rows={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:border-purple-500 outline-none text-sm text-white leading-relaxed resize-y"
                                    value={profile?.Bio?.includes('|||') ? profile.Bio.split('|||')[0].trim() : ''}
                                    onChange={(e) => {
                                        const about = profile?.Bio?.includes('|||') ? profile.Bio.split('|||')[1] : (profile?.Bio || '');
                                        setProfile({ ...profile, Bio: e.target.value + ' ||| ' + about });
                                    }}
                                    placeholder="I build performant web applications that solve real problems..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">About Me (Long Bio)</label>
                                <textarea rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:border-purple-500 outline-none text-sm text-white leading-relaxed resize-y"
                                    value={profile?.Bio?.includes('|||') ? profile.Bio.split('|||')[1].trim() : (profile?.Bio || '')}
                                    onChange={(e) => {
                                        const hero = profile?.Bio?.includes('|||') ? profile.Bio.split('|||')[0] : 'I build performant web applications that solve real problems, delivering seamless and exceptional user experiences.';
                                        setProfile({ ...profile, Bio: hero + ' ||| ' + e.target.value });
                                    }}
                                    placeholder="Write your detailed professional background here..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Rotating Titles (comma separated)</label>
                            <input type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-purple-500 outline-none text-sm text-purple-400 italic"
                                value={profile?.RotatingTitles || ''}
                                onChange={(e) => setProfile({ ...profile, RotatingTitles: e.target.value })}
                                placeholder="Full Stack Developer, Software Engineer, Creative Coder"
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-4">Social Links</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'GitHub', icon: Github, key: 'GithubUrl' },
                                { label: 'LinkedIn', icon: Linkedin, key: 'LinkedinUrl' },
                                { label: 'X (Twitter)', icon: Twitter, key: 'TwitterUrl' },
                                { label: 'Instagram', icon: Instagram, key: 'InstagramUrl' },
                                { label: 'Discord URL', icon: MessageSquare, key: 'DiscordUrl' },
                            ].map((social) => (
                                <div key={social.key} className="space-y-2">
                                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">{social.label}</label>
                                    <div className="relative">
                                        <social.icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 focus:border-purple-500 outline-none text-xs text-gray-400"
                                            value={profile?.[social.key] || ''}
                                            onChange={(e) => setProfile({ ...profile, [social.key]: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security: Change Password */}
                    <form onSubmit={handlePasswordChange} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-4">Security</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Current Password</label>
                                <div className="relative">
                                    <Key size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                    <input type={showPassword.current ? "text" : "password"} required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-12 focus:border-purple-500 outline-none text-xs text-white"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <div 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 cursor-pointer z-50 flex items-center justify-center w-8 h-8"
                                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                    >
                                        {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">New Password</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                    <input type={showPassword.new ? "text" : "password"} required minLength="6"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-12 focus:border-purple-500 outline-none text-xs text-white"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <div 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 cursor-pointer z-50 flex items-center justify-center w-8 h-8"
                                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                    >
                                        {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Confirm New Password</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                                    <input type={showPassword.confirm ? "text" : "password"} required minLength="6"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-12 focus:border-purple-500 outline-none text-xs text-white"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                    <div 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 cursor-pointer z-50 flex items-center justify-center w-8 h-8"
                                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                    >
                                        {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={changingPassword}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                            >
                                {changingPassword ? <Loader2 className="animate-spin" size={14} /> : <Lock size={14} />}
                                {changingPassword ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </form>

                    {/* Main Save Buttons */}
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={() => window.location.reload()}
                            className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-all underline underline-offset-4"
                        >
                            Discard Changes
                        </button>
                        <button type="button" onClick={handleSubmit} disabled={saving}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-600/30 disabled:opacity-50 active:scale-95"
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageProfile;
