import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { testimonialService } from '../services/apiService';

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        testimonialService.getAll()
            .then(res => setTestimonials(res.data))
            .catch(() => {
                setTestimonials([
                    { id: 1, name: 'John Doe', role: 'CEO', company: 'TechCorp', feedback: 'Farjana is an exceptional developer who delivered our project ahead of schedule with top-notch quality.', image: 'https://i.pravatar.cc/150?u=1' },
                    { id: 2, name: 'Sarah Wilson', role: 'Product Manager', company: 'CreativeApps', feedback: 'Her attention to detail and ability to understand complex requirements is truly impressive.', image: 'https://i.pravatar.cc/150?u=2' },
                    { id: 3, name: 'Robert Smith', role: 'Founder', company: 'StartupX', feedback: 'Working with Farjana was a breeze. She communication were excellent throughout the development process.', image: 'https://i.pravatar.cc/150?u=3' },
                ]);
            });
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section id="testimonials" className="py-32 px-6 overflow-hidden bg-[#030014] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.05),transparent)] pointer-events-none"></div>
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <span className="text-indigo-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Kind Words</span>
                    <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white uppercase">Client Stories</h2>
                    <p className="text-gray-500 text-lg font-light max-w-xl mx-auto">Voices from the people I've collaborated with on building the future.</p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                            className="p-12 bg-white/[0.01] border border-white/5 rounded-[60px] transition-all duration-700 relative group overflow-hidden flex flex-col items-center text-center shadow-2xl backdrop-blur-3xl"
                        >
                            {/* Animated hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            <div className="flex gap-1 mb-10 scale-90 group-hover:scale-100 transition-transform">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="text-indigo-500 fill-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                ))}
                            </div>

                            <div className="relative mb-10 italic">
                               <Quote className="absolute -top-6 -left-8 text-indigo-500/10 group-hover:text-indigo-500 transition-all duration-500 rotate-180" size={60} />
                               <p className="text-gray-400 text-lg leading-relaxed font-light relative z-10 font-serif line-clamp-4">
                                   "{t.feedback || t.Feedback}"
                               </p>
                            </div>

                            <div className="flex flex-col items-center gap-6 mt-auto">
                                <div className="w-16 h-16 rounded-full overflow-hidden p-1 bg-white/5 border border-white/10 group-hover:border-indigo-500/50 transition-all duration-500 rotate-[-5deg] group-hover:rotate-0">
                                    <img 
                                        src={t.image || t.ImageUrl || `https://i.pravatar.cc/150?u=${t.id}`} 
                                        alt={t.name || t.ClientName} 
                                        className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-lg tracking-tight text-white mb-1 uppercase italic">{t.name || t.ClientName}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">{t.role || t.ClientRole} — {t.company || t.Company}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
