import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, User, Briefcase, GraduationCap,
    MessageSquare, LogOut, Menu, X, CheckSquare, Bell, Search,
    ArrowUpRight, Eye
} from 'lucide-react';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({ projectCount: 0, skillCount: 0, testimonialCount: 0, messageCount: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    adminService.logout();
                    navigate('/admin/login');
                }
            }
        };

        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        adminService.logout();
        navigate('/admin/login');
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: User, label: 'Profile', path: '/admin/profile' },
        { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
        { icon: GraduationCap, label: 'Skills', path: '/admin/skills' },
        { icon: CheckSquare, label: 'Testimonials', path: '/admin/testimonials' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    ];

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-10">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-xs">Authenticating Server</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed h-screen bg-black border-r border-white/5 transition-all duration-500 z-50 flex flex-col ${sidebarOpen ? 'w-80' : 'w-24'}`}>
                <div className="p-8 flex items-center gap-4 mb-20 overflow-hidden">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-xl font-black">A</div>
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-xl font-bold tracking-tighter whitespace-nowrap"
                            >
                                Admin <span className="text-purple-600">Portal</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 space-y-4">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${location.pathname === item.path ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' : 'text-white/80 hover:text-white hover:bg-white/[0.03]'}`}
                        >
                            <item.icon size={22} className={location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="font-medium tracking-tight whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group overflow-hidden`}
                    >
                        <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                        {sidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px]">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 min-h-screen relative overflow-y-auto ${sidebarOpen ? 'ml-80' : 'ml-24'}`}>

                {/* Upper Navbar */}
                <header className="sticky top-0 h-24 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-12 z-40">
                    <div className="flex items-center gap-10">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="bg-white/5 p-3 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="hidden lg:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 w-96 group focus-within:border-purple-600 transition-all">
                            <Search size={18} className="text-gray-500 group-focus-within:text-purple-600 transition-colors" />
                            <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative p-3 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer">
                            <Bell size={20} className="text-gray-400" />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-purple-600 rounded-full border border-black animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                            <div className="text-right text-white">
                                <p className="text-sm font-bold tracking-tight">{localStorage.getItem('adminUser') || 'Admin'}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Super Administrator</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-xl font-black ring-4 ring-white/5 text-white">A</div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Specific Content - If path is /admin/dashboard */}
                {location.pathname === '/admin/dashboard' ? (
                    <div className="p-12 space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-700 text-left">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-4xl font-bold tracking-tighter mb-2 text-white">Welcome Back!</h2>
                                <p className="text-gray-400 font-medium">Here's what's happening with your portfolio today.</p>
                            </div>
                            <Link to="/" className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-purple-600 hover:text-white transition-all flex items-center gap-3">
                                View Site <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Total Projects', value: stats.projectCount, color: 'indigo', icon: Briefcase, change: '+2 new' },
                                { label: 'Active Skills', value: stats.skillCount, color: 'indigo', icon: GraduationCap, change: 'Top 5%' },
                                { label: 'Testimonials', value: stats.testimonialCount, color: 'indigo', icon: CheckSquare, change: '1 pending' },
                                { label: 'Messages', value: stats.messageCount, color: 'indigo', icon: MessageSquare, change: '+5 today' }
                            ].map((s, idx) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 bg-white/[0.03] border border-white/10 rounded-[40px] relative group hover:bg-white/[0.05] transition-all text-left"
                                >
                                    <div className={`w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-500 ring-1 ring-purple-500/30`}>
                                        <s.icon size={24} />
                                    </div>
                                    <p className="text-5xl font-bold tracking-tighter mb-2 text-white">{s.value}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{s.label}</p>
                                        <p className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">{s.change} <ArrowUpRight size={10} /></p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Mockup */}
                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[50px] p-12">
                                <h3 className="text-xl font-bold tracking-tight mb-10 flex items-center justify-between">
                                    Recent Analytics
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                    </div>
                                </h3>
                                <div className="h-64 flex items-end gap-4 overflow-hidden">
                                    {/* Charts mockup */}
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${Math.random() * 80 + 20}%` }}
                                            transition={{ duration: 1, delay: i * 0.05 }}
                                            className="flex-1 bg-gradient-to-t from-purple-600 to-purple-600/20 rounded-t-lg"
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-6 text-[10px] font-bold uppercase tracking-widest text-gray-700">
                                    <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-[50px] p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-32 h-32 bg-purple-600/10 rounded-full flex items-center justify-center mb-8 relative">
                                    <Eye size={48} className="text-purple-600" />
                                    <div className="absolute inset-0 border-4 border-dashed border-purple-600/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                </div>
                                <h4 className="text-2xl font-bold tracking-tight mb-2">Live traffic</h4>
                                <p className="text-gray-500 text-sm font-light mb-8 max-w-[200px]">Real-time monitoring of your site visitors.</p>
                                <div className="px-6 py-2 bg-purple-600 rounded-full text-xs font-bold tracking-widest uppercase">7 Live Now</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
