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
import RequestServicePage from './pages/public/RequestServicePage';

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
        <Route path="/request-service" element={<RequestServicePage />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
