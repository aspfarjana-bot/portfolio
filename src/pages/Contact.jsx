import React from 'react';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Contact = () => {
    return (
        <main className="bg-[#030014] text-white min-h-screen flex flex-col relative overflow-hidden">
            {/* Added background spirits for consistency */}
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full"></div>
            </div>
            
            <div className="relative z-10 pt-32 flex-grow">
                <ContactSection />
            </div>

            <Footer />
        </main>
    );
};

export default Contact;
