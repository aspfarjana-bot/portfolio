import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { profileService } from '../services/apiService';

const Navbar = () => {
    const [profile, setProfile] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const navLinks = [
        { name: 'About', to: 'about', type: 'scroll' },
        { name: 'Work', to: 'projects', type: 'scroll' },
        { name: 'Experience', to: 'experience', type: 'scroll' },
        { name: 'Skills', to: 'skills', type: 'scroll' },
        { name: 'Contact', to: '/contact', type: 'route' },
    ];

    const handleNavigation = (link) => {
        setMobileMenuOpen(false);
        if (link.type === 'route') {
            navigate(link.to);
        } else if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: link.to } });
        }
    };

    const logoName = profile?.LogoText || "FA";

    return (
        <nav className="fixed w-full z-[100] pt-6 px-4 md:px-6">
            <div className="container mx-auto flex justify-center">
                {/* Navbar Animation - Sliding down from top with Spring */}
                <motion.div 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 45,
                        damping: 15,
                        delay: 0.2, // Reduced delay for faster start
                        duration: 1.5 // Increased duration for smoother slide 
                    }}
                    className="flex justify-between items-center bg-[#030014]/60 border border-white/10 backdrop-blur-xl rounded-full py-2.5 px-8 w-full max-w-5xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                >
                    {/* Stylized Logo — route to Home page */}
                    <RouterLink to="/" className="cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95 h-14 md:h-16 min-w-[3.5rem]">
                        {profile?.LogoImageUrl ? (
                            <img src={profile.LogoImageUrl} alt="Logo" className="max-h-full w-auto object-contain rounded-md" />
                        ) : (
                            <span className="text-2xl font-[900] tracking-tighter text-white italic">
                                {logoName}
                            </span>
                        )}
                    </RouterLink>

                    {/* Desktop Menu - Perfect Spacing & Styling */}
                    <div className="hidden md:flex space-x-8 lg:space-x-12 items-center">
                        {navLinks.map((link) => {
                            if (link.type === 'route') {
                                return (
                                    <RouterLink
                                        key={link.name}
                                        to={link.to}
                                        className={`text-[11px] font-bold cursor-pointer transition-all relative group/link tracking-[0.05em] uppercase ${location.pathname === link.to ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-indigo-500 transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                                    </RouterLink>
                                );
                            } else {
                                return location.pathname === '/' ? (
                                    <ScrollLink
                                        key={link.name}
                                        to={link.to}
                                        spy={true}
                                        smooth={true}
                                        offset={-70}
                                        duration={800}
                                        className="text-[11px] font-bold text-gray-400 hover:text-white cursor-pointer transition-all relative group/link tracking-[0.05em] uppercase"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-indigo-500 transition-all duration-300 group-hover/link:w-full"></span>
                                    </ScrollLink>
                                ) : (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavigation(link)}
                                        className="text-[11px] font-bold text-gray-400 hover:text-white cursor-pointer transition-all relative group/link tracking-[0.05em] uppercase"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-indigo-500 transition-all duration-300 group-hover/link:w-full"></span>
                                    </button>
                                );
                            }
                        })}
                    </div>

                    {/* Resume Section */}
                    <div className="hidden md:flex items-center">
                        <a
                            href={profile?.ResumeUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-white transition-all group/resume uppercase tracking-wider"
                        >
                            Resume <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-white/50 group-hover:text-white" />
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white/70 hover:text-white transition-colors">
                            <Menu size={22} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-y-0 right-0 w-full bg-[#030014]/98 z-[110] flex flex-col items-center justify-center space-y-8 backdrop-blur-3xl"
                    >
                        <button 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="absolute top-10 right-10 p-4 text-white hover:rotate-90 transition-all"
                        >
                            <X size={32} />
                        </button>

                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavigation(link)}
                                className={`text-4xl font-black transition-all ${location.pathname === link.to ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {link.name}
                            </button>
                        ))}
                        
                        <a
                            href={profile?.ResumeUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-indigo-500 pt-10"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Resume
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
