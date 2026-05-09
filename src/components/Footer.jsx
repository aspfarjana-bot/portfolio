import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp, Instagram } from 'lucide-react';
import { Link } from 'react-scroll';
import { profileService } from '../services/apiService';

const Footer = () => {
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const logoName = profile?.LogoText || (profile?.Name ? profile.Name.split(' ')[0].toUpperCase() : "AB");

    const socialLinks = [
        { icon: Github, url: profile?.GithubUrl, hover: 'hover:text-white hover:scale-125' },
        { icon: Linkedin, url: profile?.LinkedinUrl, hover: 'hover:text-blue-500 hover:scale-125' },
        { icon: Instagram, url: profile?.InstagramUrl, hover: 'hover:text-pink-500 hover:scale-125' },
        { icon: Twitter, url: profile?.TwitterUrl, hover: 'hover:text-sky-400 hover:scale-125' },
    ];

    return (
        <footer className="bg-[#030014] pb-12 px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10 flex justify-center items-center">
                <p className="text-[#a1a1aa] font-light text-[15px] hover:text-white transition-colors duration-300">
                    © {new Date().getFullYear()} {profile?.Name || "Farjana Akter"}. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
