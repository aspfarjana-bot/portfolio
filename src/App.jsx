import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageProjects from './pages/admin/ManageProjects';
import ManageSkills from './pages/admin/ManageSkills';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ViewMessages from './pages/admin/ViewMessages';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" />;
};
function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <div className="relative font-sans selection:bg-purple-100 selection:text-purple-900">
      {!isAdmin && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        <Route path="/contact" element={<Contact />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Protected Dashboard */}
        <Route path="/admin" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={null} /> {/* Handled in Dashboard.jsx for now */}
          <Route path="profile" element={<ManageProfile />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
          <Route path="messages" element={<ViewMessages />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
