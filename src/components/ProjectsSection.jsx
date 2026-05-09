import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';
import { projectService } from '../services/apiService';

const m = motion;

const defaultProjects = [
    { 
        id: 1, 
        title: 'S-Ecommerce Full Stack Platform', 
        category: 'Full Stack', 
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', 
        description: 'A comprehensive full-stack e-commerce solution featuring secure authentication, payment integration, and a sophisticated product management dashboard.', 
        Technologies: 'React, ASP.NET Core, Entity Framework, SQL Server',
        github: 'https://github.com/aspfarjana-bot/SEcommerce-Full-Stack-E-Commerce-Platform', 
        live: '#' 
    },
    { 
        id: 2, 
        title: 'Modern Portfolio', 
        category: 'Web Design', 
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=800', 
        description: 'A performance-optimized personal portfolio featuring complex 3D animations, layered sticky scrolling, and a responsive glassmorphism UI.', 
        Technologies: 'React, Tailwind CSS, Framer Motion',
        github: '#', 
        live: '#' 
    },
    { 
        id: 3, 
        title: 'TechBlog Application', 
        category: 'Web App', 
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', 
        description: 'A feature-rich blogging platform with interactive markdown support, user comments, and real-time content delivery network integration.', 
        Technologies: 'JavaScript, HTML, CSS, C#',
        github: '#', 
        live: '#' 
    }
];

const ProjectsSection = () => {
    const [projects, setProjects] = useState(defaultProjects);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        projectService.getAll()
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setProjects(res.data);
                }
            })
            .catch(() => {
                console.log("Using default projects due to API failure");
            });
    }, []);

    const categories = ['All', 'E-commerce', 'Web Design', 'Education', 'FinTech'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const projectVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <section id="projects" className="py-32 px-6 bg-[#030014]">
            <div className="container mx-auto max-w-7xl">
                <m.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-semibold text-[#a855f7] mb-4">
                        Recent Works
                    </h2>
                    <p className="text-[#a1a1aa] text-[15px] font-light">These are some of the projects I've enjoyed building lately.</p>
                </m.div>

                <m.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col gap-24 md:gap-32 pb-32"
                >
                    <AnimatePresence mode="popLayout">
                        {projects.map((project, index) => (
                                <m.div
                                    layout
                                    variants={projectVariants}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
                                    key={project.id || project.Id}
                                    style={{ 
                                        position: 'sticky', 
                                        top: `calc(140px + ${index * 20}px)`,
                                        zIndex: index + 1
                                    }}
                                    className="group bg-[#080808] border border-[#1e1b2e] rounded-3xl p-6 md:p-10 overflow-hidden transition-all duration-500 hover:border-[#a855f7]/40 flex flex-col md:flex-row gap-12 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Left Content */}
                                    <div className="flex-1 space-y-6 z-10 w-full">
                                        <h3 className="text-2xl md:text-[28px] font-semibold text-white drop-shadow-md">{project.title || project.Title}</h3>
                                        <p className="text-[#a1a1aa] text-[15px] leading-[1.8] pr-0 md:pr-4">{project.description || project.Description}</p>
                                        
                                        <div className="flex flex-wrap gap-2 pt-1">
                                        {(project.Technologies || "Next.js, TypeScript, Express, MongoDB").split(',').map((tech, i) => (
                                            <span key={i} className="text-[13px] text-[#cba6f7] bg-[#a855f7]/10 border border-[#a855f7]/20 px-3 py-1 rounded-full">{tech.trim()}</span>
                                        ))}
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <a href={project.github || project.GithubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-[#d4d4d8] hover:bg-white/10 hover:text-white transition-all text-[15px]">
                                                <Github size={18} /> Source
                                            </a>
                                            <a href={project.live || project.LiveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-[#d4d4d8] hover:bg-white/10 hover:text-white transition-all text-[15px]">
                                                <ExternalLink size={18} /> Live
                                            </a>
                                        </div>
                                    </div>

                                    {/* Right Image */}
                                    <div className="w-full md:w-[60%] shrink-0 aspect-[16/10] md:h-[360px] overflow-hidden rounded-xl border border-white/5 bg-[#030014] relative transition-all duration-700">
                                        <img
                                            src={project.image || project.ImageUrl || '/images/profile.png'}
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"; }}
                                            alt={project.title || project.Title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                </m.div>
                            ))}
                    </AnimatePresence>
                </m.div>
            </div>
        </section>
    );
};

export default ProjectsSection;
