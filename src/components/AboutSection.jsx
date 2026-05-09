import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileService } from '../services/apiService';

const AboutSection = () => {
    const [profile, setProfile] = useState(null);

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

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Helper to highlight specific keywords in purple
    const highlightText = (text) => {
        if (!text) return null;
        const keywords = ['HTML', 'CSS', 'JavaScript', 'Angular', 'React', 'C#', 'Web API', 'ASP.NET', 'ASP.NET Core', 'Entity Framework', 'Web Application', 'Farjana Akter', 'Software Developer', 'Full Stack Developer', 'Abu Bokkor Siddik'];
        let parts = [text];
        
        keywords.forEach(keyword => {
            const newParts = [];
            parts.forEach(part => {
                if (typeof part === 'string') {
                    const split = part.split(new RegExp(`(${keyword})`, 'gi'));
                    newParts.push(...split);
                } else {
                    newParts.push(part);
                }
            });
            parts = newParts;
        });

        return parts.map((part, i) => 
            keywords.some(k => k.toLowerCase() === part.toLowerCase()) ? 
            <span key={i} className="text-[#a855f7]">{part}</span> : part
        );
    };

    return (
        <section id="about" className="py-24 px-6 relative overflow-hidden bg-[#030014]">
            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row gap-12 md:gap-20 items-start"
                >
                    {/* Left Side: Content */}
                    <div className="flex-1 space-y-8">
                        {/* Heading with Horizontal Line */}
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-4xl md:text-[40px] font-semibold text-[#a855f7] whitespace-nowrap tracking-wide">
                                About Me
                            </h2>
                            <div className="hidden md:block h-[1px] flex-1 bg-[#1a1426]"></div>
                        </div>

                        <motion.div variants={itemVariants} className="space-y-6 text-[#a1a1aa] text-[15px] leading-relaxed font-light">
                            {profile?.Bio ? (
                                (profile.Bio.includes('|||') ? profile.Bio.split('|||')[1] : profile.Bio)
                                    .split('\n')
                                    .map((paragraph, index) => (
                                        paragraph.trim() && <p key={index}>{highlightText(paragraph)}</p>
                                    ))
                            ) : (
                                <>
                                    <p>
                                        Hello! I'm {highlightText(profile?.Name || "Farjana Akter")}, a {highlightText(profile?.Title || "Software Developer")} based in {profile?.Location || "Bangladesh"}. I enjoy building web applications that are simple to use, well-structured, and reliable.
                                    </p>
                                    <p>
                                        I graduated with a BSc in Computer Science and Engineering, and I started learning web development out of curiosity about how websites and modern apps actually work. Over time, that curiosity turned into something I genuinely enjoy doing every day.
                                    </p>
                                    <p>
                                        I mostly work with {highlightText("HTML, CSS, JavaScript, Angular, React, C#, Web API, ASP.NET, ASP.NET Core, and Entity Framework")}. I enjoy writing clean code, improving performance, and building modern {highlightText("Web Application")} features that solve real problems for users.
                                    </p>
                                    <p>
                                        When I'm not coding, you'll find me exploring new technologies, contributing to projects, or learning something new to sharpen my skills as a developer.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Side: Animated Premium Image Card */}
                    <motion.div 
                        variants={itemVariants}
                        className="w-full md:w-[320px] shrink-0 mt-8 md:mt-0 relative group"
                    >
                        {/* Soft Ambient Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-1000"></div>

                        {/* Floating Container */}
                        <motion.div 
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="relative aspect-[4/4.5] rounded-3xl overflow-hidden bg-[#030014] border border-white/10 shadow-2xl z-10"
                        >
                            {/* Inner gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/60 via-transparent to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <img
                                src={profile?.ImageUrl || "/images/profile.png"}
                                alt={profile?.Name || "Farjana Akter"}
                                className="w-full h-full object-cover relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
