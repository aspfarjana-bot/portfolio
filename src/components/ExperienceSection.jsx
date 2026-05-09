import React from 'react';
import { motion } from 'framer-motion';

const ExperienceSection = () => {
    const experiences = [
        {
            company: "Self-Employed / Freelance",
            role: "Full Stack Web Developer",
            period: "2022 - Present",
            description: "Developed and maintained several web applications using React, Node.js, and ASP.NET Core. Focused on clean code and performance optimization.",
            skills: ["React", "ASP.NET Core", "SQL Server"]
        },
        {
            company: "Online Learning & Projects",
            role: "Full Stack Developer Trainee",
            period: "2021 - 2022",
            description: "Built multiple academic and personal projects. Gained proficiency in modern frontend frameworks and backend technologies.",
            skills: ["JavaScript", "C#", "Entity Framework"]
        }
    ];

    return (
        <section id="experience" className="py-24 px-6 relative bg-[#030014]">
            <div className="container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="flex items-center gap-6 mb-16">
                    <h2 className="text-4xl md:text-[40px] font-semibold text-[#a855f7] whitespace-nowrap tracking-wide">
                        Experience
                    </h2>
                    <div className="hidden md:block h-[1px] flex-1 bg-[#1a1426]"></div>
                </div>

                <div className="space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative pl-8 border-l border-white/5 hover:border-indigo-500/50 transition-colors"
                        >
                            {/* Dot on the line */}
                            <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-[#1a1426] border border-white/10 rounded-full group-hover:bg-indigo-500 transition-colors"></div>

                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{exp.role}</h3>
                                    <p className="text-indigo-500 font-medium text-sm">{exp.company}</p>
                                </div>
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full h-fit">
                                    {exp.period}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mb-6">
                                {exp.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {exp.skills.map((skill, i) => (
                                    <span key={i} className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;
