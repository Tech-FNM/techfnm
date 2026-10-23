import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CustomCursor from './components/CustomCursor';
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const FAQPage = lazy(() => import('./pages/public/FAQPage'));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const ServiceDetail = lazy(() => import('./pages/public/ServiceDetail'));
const RequestServicePage = lazy(() => import('./pages/public/RequestServicePage'));
const BlogPage = lazy(() => import('./pages/public/BlogPage'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

function App() {
  return (
    <Router>
      <CustomCursor />
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/request-service" element={<RequestServicePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/:tab" element={<AdminDashboard />} />
        <Route path="/admin/:tab" element={<AdminDashboard />} />
        <Route path="/admin/:tab/:action" element={<AdminDashboard />} />
        <Route path="/admin/:tab/:action/:itemId" element={<AdminDashboard />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
