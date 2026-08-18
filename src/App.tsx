import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetail from './pages/public/ServiceDetail';
import PortfolioPage from './pages/public/PortfolioPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';
import BlogPage from './pages/public/BlogPage';
import BlogDetail from './pages/public/BlogDetail';

import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import DashboardHome from './pages/admin/DashboardHome';
import ServicesManager from './pages/admin/ServicesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import LeadershipManager from './pages/admin/LeadershipManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import ClientsManager from './pages/admin/ClientsManager';
import FAQManager from './pages/admin/FAQManager';
import ScriptsManager from './pages/admin/ScriptsManager';
import FooterManager from './pages/admin/FooterManager';
import BlogManager from './pages/admin/BlogManager';
import SeoManager from './pages/admin/SeoManager';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admindash/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admindash" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admindash/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="blogs" element={<BlogManager />} />
            <Route path="leadership" element={<LeadershipManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="clients" element={<ClientsManager />} />
            <Route path="faqs" element={<FAQManager />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="scripts" element={<ScriptsManager />} />
            <Route path="footer" element={<FooterManager />} />
          </Route>
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
