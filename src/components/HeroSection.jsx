import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaDiscord, FaEnvelope, FaXTwitter } from 'react-icons/fa6'; 
import { profileService } from '../services/apiService';
import HeroBackground from './HeroBackground';
import Typewriter from './Typewriter';

const HeroSection = () => {
    const [profile, setProfile] = useState(null);
    const [titles, setTitles] = useState(["Full Stack Developer", "Software Engineer", "Creative Coder"]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                setProfile(data);
                if (data.RotatingTitles) {
                    const splitTitles = data.RotatingTitles.split(',').map(s => s.trim()).filter(s => s !== "");
                    if (splitTitles.length > 0) setTitles(splitTitles);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const socialIcons = [
        { icon: FaGithub, url: profile?.GithubUrl || "#", hoverColor: 'hover:text-white' },
        { icon: FaLinkedin, url: profile?.LinkedinUrl || "#", hoverColor: 'hover:text-[#0A66C2]' },
        { icon: FaDiscord, url: profile?.DiscordUrl || "#", hoverColor: 'hover:text-[#5865F2]' }, 
        { icon: FaEnvelope, url: profile?.Email ? `mailto:${profile.Email}` : "#", hoverColor: 'hover:text-[#EA4335]' },
        { icon: FaXTwitter, url: profile?.TwitterUrl || "#", hoverColor: 'hover:text-white' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const displayName = (profile?.Name && profile.Name.trim() !== "") ? profile.Name : "Farjana Akter";

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
            {/* Same-to-Same Background Spirits */}
            <HeroBackground />
            
            <div className="container mx-auto z-10 text-center">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl mx-auto flex flex-col items-center"
                >
                    {/* Name Heading - Clean, Bold, Precisely Proportioned */}
                    <div className="overflow-hidden mb-2 relative">
                        <motion.h1 
                            variants={itemVariants}
                            className="text-5xl md:text-[6.5rem] font-medium tracking-tight text-white leading-[1.1] drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        >
                            {displayName}
                        </motion.h1>
                    </div>
                    
                    {/* Subtitle - Vibrant Purple Typewriter with Visibility Glow */}
                    <motion.div variants={itemVariants} className="h-14 md:h-20 mb-8 relative">
                        <div className="text-2xl md:text-5xl font-semibold text-[#a855f7] tracking-tight leading-none drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] filter brightness-110">
                            <Typewriter texts={titles} />
                        </div>
                    </motion.div>

                    {/* Bio Paragraph - Precisely Balanced 2 Lines */}
                    <motion.p 
                        variants={itemVariants}
                        className="text-white text-xl md:text-[1.35rem] mb-6 max-w-[650px] mx-auto leading-relaxed font-normal px-4 opacity-100 text-center"
                        style={{ textWrap: 'balance' }}
                    >
                        {profile?.Bio?.includes('|||') ? profile.Bio.split('|||')[0].trim() : "I build performant web applications that solve real problems, delivering seamless and exceptional user experiences."}
                    </motion.p>

                    <motion.div variants={itemVariants} className="space-y-6 mt-4">
                        <h3 className="text-xl md:text-2xl font-bold text-white/90 tracking-tight">
                            Catch the Dev!
                        </h3>
                        
                        <div className="flex gap-6 md:gap-8 items-center justify-center">
                            {socialIcons.map((item, idx) => (
                                <motion.a 
                                    key={idx}
                                    href={item.url || "#"} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2, y: -8 }}
                                    className={`text-white transition-all duration-300 ${item.hoverColor} hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
                                >
                                    <item.icon size={32} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Vignette */}
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#030014] via-[#030014]/50 to-transparent pointer-events-none"></div>
        </section>
    );
};

export default HeroSection;
