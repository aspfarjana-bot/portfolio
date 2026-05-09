import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillService } from '../services/apiService';
import { Code2, Database, Layout, Terminal, PenTool, Braces } from 'lucide-react';

const defaultSkills = [
    { id: 1, name: 'HTML', category: 'Frontend', proficiency: 'Advanced', icon: <Layout className="text-orange-500" /> },
    { id: 2, name: 'CSS', category: 'Frontend', proficiency: 'Advanced', icon: <Layout className="text-blue-400" /> },
    { id: 3, name: 'JavaScript', category: 'Frontend', proficiency: 'Advanced', icon: <Braces className="text-yellow-500" /> },
    { id: 4, name: 'Angular', category: 'Frontend', proficiency: 'Intermediate', icon: <Code2 className="text-red-600" /> },
    { id: 5, name: 'React', category: 'Frontend', proficiency: 'Advanced', icon: <Layout className="text-blue-500" /> },
    { id: 6, name: 'C#', category: 'Backend', proficiency: 'Advanced', icon: <Code2 className="text-green-600" /> },
    { id: 7, name: 'Web API', category: 'Backend', proficiency: 'Advanced', icon: <Terminal className="text-purple-500" /> },
    { id: 8, name: 'ASP.NET', category: 'Backend', proficiency: 'Advanced', icon: <Terminal className="text-purple-500" /> },
    { id: 9, name: 'ASP.NET Core', category: 'Backend', proficiency: 'Advanced', icon: <Terminal className="text-purple-600" /> },
    { id: 10, name: 'Entity Framework', category: 'Backend', proficiency: 'Intermediate', icon: <Database className="text-gray-400" /> },
];

import * as Lucide from 'lucide-react';

const SkillsSection = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        skillService.getAll()
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setSkills(res.data);
                }
            })
            .catch((err) => {
                console.error("API Error:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const getIcon = (iconName) => {
        const Icon = Lucide[iconName] || Lucide.Code2;
        return <Icon size={32} />;
    };

    // Use dynamic skills if available, otherwise don't show empty items
    if (skills.length === 0 && !loading) return null;

    const row1Skills = skills.slice(0, Math.ceil(skills.length / 2));
    const row2Skills = skills.slice(Math.ceil(skills.length / 2));

    const repeatedRow1 = [...row1Skills, ...row1Skills, ...row1Skills, ...row1Skills];
    const repeatedRow2 = [...row2Skills, ...row2Skills, ...row2Skills, ...row2Skills];

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    return (
        <section id="skills" className="py-32 relative overflow-hidden bg-[#030014]">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-reverse {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee {
                    animation: scroll 40s linear infinite;
                    will-change: transform;
                }
                .animate-marquee-reverse {
                    animation: scroll-reverse 40s linear infinite;
                    will-change: transform;
                }
                .hover-pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
            
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto max-w-7xl text-center px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={titleVariants}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-semibold text-[#a855f7] mb-4">
                        Skills
                    </h2>
                    <p className="text-[#a1a1aa] text-[15px] font-light">Technologies and tools I work with on a daily basis.</p>
                </motion.div>

                {/* Marquee Container with restricted boundary */}
                <div className="max-w-5xl mx-auto w-full relative py-10 mt-6" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
                    
                    {/* Row 1 - Scroll Left */}
                    <div className="flex w-max animate-marquee hover-pause mb-8 items-center">
                        {repeatedRow1.map((skill, index) => (
                            <div 
                                key={`r1-${skill.Id || skill.id}-${index}`}
                                className="flex items-center gap-4 px-8 cursor-pointer group/skill opacity-70 hover:opacity-100 transition-all duration-300"
                            >
                                <div className="w-12 h-12 flex items-center justify-center text-[#d4d4d8] group-hover:text-[#a855f7] transition-colors duration-300 group-hover:scale-110">
                                    {getIcon(skill.IconName || skill.iconName)}
                                </div>
                                <span className="font-bold text-lg text-[#e4e4e7] whitespace-nowrap">{skill.Name || skill.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Row 2 - Scroll Right */}
                    <div className="flex w-max animate-marquee-reverse hover-pause items-center">
                        {repeatedRow2.map((skill, index) => (
                            <div 
                                key={`r2-${skill.Id || skill.id}-${index}`}
                                className="flex items-center gap-4 px-8 cursor-pointer group/skill opacity-70 hover:opacity-100 transition-all duration-300"
                            >
                                <div className="w-12 h-12 flex items-center justify-center text-[#d4d4d8] group-hover:text-[#a855f7] transition-colors duration-300 group-hover:scale-110">
                                    {getIcon(skill.IconName || skill.iconName)}
                                </div>
                                <span className="font-bold text-lg text-[#e4e4e7] whitespace-nowrap">{skill.Name || skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
