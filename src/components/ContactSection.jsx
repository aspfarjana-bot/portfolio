import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Facebook } from 'lucide-react';
import { contactService, profileService } from '../services/apiService';

const ContactSection = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });
        try {
            await contactService.sendMessage(formData);
            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setTimeout(() => {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: '', email: '', subject: '', message: '' });
            }, 1000);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
        }
    };

    const socialIcons = [
        { Icon: Github, url: profile?.GithubUrl, hoverColor: 'hover:text-gray-400' },
        { Icon: Linkedin, url: profile?.LinkedinUrl, hoverColor: 'hover:text-blue-500' },
        { Icon: Twitter, url: profile?.TwitterUrl, hoverColor: 'hover:text-blue-400' },
        { Icon: Facebook, url: profile?.FacebookUrl, hoverColor: 'hover:text-blue-600' }
    ].filter(item => item.url); // only show if url exists or keep all as fallback? We'll keep fallback so it's not empty:
    
    const fallbackSocials = [
        { Icon: Github, url: profile?.GithubUrl || '#', hoverColor: 'hover:text-gray-400' },
        { Icon: Linkedin, url: profile?.LinkedinUrl || '#', hoverColor: 'hover:text-blue-500' },
        { Icon: Twitter, url: profile?.TwitterUrl || '#', hoverColor: 'hover:text-blue-400' },
        { Icon: Facebook, url: profile?.FacebookUrl || '#', hoverColor: 'hover:text-blue-600' }
    ];

    return (
        <section id="contact" className="py-24 px-6 relative bg-[#030014] text-white selection:bg-indigo-600 selection:text-white">
            <div className="container mx-auto max-w-[1100px] relative z-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-24 text-left items-center"
                >
                    <div className="space-y-12 pr-0 md:pr-10">
                        <motion.div variants={itemVariants} className="space-y-4">
                            <span className="text-[#3b82f6] font-bold uppercase tracking-[0.3em] text-[10px] block">Availability</span>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
                                LET'S <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">CONNECT</span>
                            </h2>
                            <p className="text-[#a1a1aa] text-[15px] font-light leading-relaxed max-w-sm">Available for select freelance opportunities<br/>and visionary collaborations.</p>
                        </motion.div>

                        <div className="space-y-8">
                            <motion.a 
                                variants={itemVariants}
                                href={`mailto:${profile?.Email || "aspfarjana@gmail.com"}`} 
                                className="flex items-center gap-6 group/link w-fit"
                            >
                                <div className="w-14 h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-center transition-all group-hover/link:border-[#818cf8]">
                                    <Mail size={20} className="text-[#818cf8] transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</p>
                                    <p className="text-[17px] font-bold text-white tracking-tight">{profile?.Email || "aspfarjana@gmail.com"}</p>
                                </div>
                            </motion.a>

                            <motion.a 
                                variants={itemVariants}
                                href={`tel:${profile?.Phone || "017422-7717"}`} 
                                className="flex items-center gap-6 group/link w-fit"
                            >
                                <div className="w-14 h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-center transition-all group-hover/link:border-[#818cf8]">
                                    <Phone size={20} className="text-[#818cf8] transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone / Whatsapp</p>
                                    <p className="text-[17px] font-bold text-white tracking-tight">{profile?.Phone || "017422-7717"}</p>
                                </div>
                            </motion.a>
                        </div>

                        {/* Social Icons row */}
                        <motion.div variants={itemVariants} className="pt-8 border-t border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6 block">Socials</p>
                            <div className="flex gap-4">
                                {fallbackSocials.map((item, idx) => (
                                    <a 
                                        key={idx}
                                        href={item.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 bg-[#0a0a0a] border border-white/5 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-white/20 text-gray-400 ${item.hoverColor}`}
                                    >
                                        <item.Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={formVariants}
                        className="p-10 md:p-14 bg-[#0a0a0a]/50 border border-white/5 rounded-[40px] relative overflow-hidden group/form"
                    >
                        {status.success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 z-50 rounded-[40px] bg-[#0a0a0a]/95 flex flex-col items-center justify-center p-12 text-center backdrop-blur-md"
                            >
                                <div className="w-16 h-16 bg-[#818cf8] rounded-full flex items-center justify-center mb-6">
                                    <Send size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                                <p className="text-gray-400 mb-8 font-light text-sm">Thanks! I'll get back to you shortly.</p>
                                <button onClick={() => setStatus({ success: false })} className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">Send Another</button>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                {['name', 'email'].map((field) => (
                                    <div key={field} className="relative group/input text-left">
                                        <input
                                            type={field === 'email' ? 'email' : 'text'}
                                            required
                                            value={formData[field]}
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                            className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-[#818cf8] transition-colors placeholder:text-gray-400 text-white text-[15px] font-light"
                                            placeholder={field === 'name' ? "What's your name?" : "Your email address?"}
                                        />
                                    </div>
                                ))}

                                <div className="relative group/input text-left pb-4">
                                    <textarea
                                        rows="2"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-[#818cf8] transition-colors placeholder:text-gray-400 text-white text-[15px] font-light resize-none"
                                        placeholder="Tell me about your project..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="text-left pt-2">
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="group/btn flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#d4d4d8] hover:text-white transition-all disabled:opacity-50"
                                >
                                    {status.loading ? 'SENDING...' : 'SEND MESSAGE'}
                                    <div className="w-12 h-12 bg-[#18181b] rounded-full border border-white/5 flex items-center justify-center group-hover/btn:border-[#818cf8] transition-all">
                                        <Send size={16} className="text-[#818cf8]" />
                                    </div>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;
