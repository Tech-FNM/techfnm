import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ScriptInjector from './components/ScriptInjector';

// Route-level code splitting: only the homepage ships in the main bundle,
// every other page (and the admin) loads its own chunk on demand.
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const FAQPage = lazy(() => import('./pages/public/FAQPage'));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage'));
const PortfolioDetail = lazy(() => import('./pages/public/PortfolioDetail'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const ServiceDetail = lazy(() => import('./pages/public/ServiceDetail'));
const RequestServicePage = lazy(() => import('./pages/public/RequestServicePage'));
const BlogPage = lazy(() => import('./pages/public/BlogPage'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));

// Decorative cursor is non-critical: load it after the page is idle, and only on pointer devices.
function DeferredCursor() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    const w = window as any;
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setReady(true)) : setTimeout(() => setReady(true), 1500);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  return ready ? (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  ) : null;
}

// SPA navigation kept the previous page's scroll position (e.g. clicking a footer link landed you
// at the bottom of the next page). Scroll to the top on every route change, or to the #hash target —
// retrying briefly because lazy sections/pages render after the route change.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const seek = () => {
      const el = document.getElementById(id) || document.getElementById(`${id}-lazy`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 20) timer = setTimeout(seek, 100);
    };
    seek();
    return () => clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

// Admin-managed tracking/verification snippets (Settings → Custom Scripts) belong on every public page,
// not only the homepage — and never inside the admin panel.
function PublicScripts() {
  const { pathname } = useLocation();
  return pathname.startsWith('/admin') ? null : <ScriptInjector />;
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <PublicScripts />
      <DeferredCursor />
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
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
