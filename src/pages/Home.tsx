import { lazy, Suspense } from 'react';
import LazySection from '../components/LazySection';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import About from '../components/About';
import Services from '../components/Services';
const CoreFeatures = lazy(() => import('../components/CoreFeatures'));
const Portfolio = lazy(() => import('../components/Portfolio'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const Pricing = lazy(() => import('../components/Pricing'));
const Awards = lazy(() => import('../components/Awards'));
const FAQ = lazy(() => import('../components/FAQ'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const LatestBlogs = lazy(() => import('../components/LatestBlogs'));
const Contact = lazy(() => import('../components/Contact'));
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full selection:bg-[#e5432e] selection:text-white">
      <SeoHead pageId="home" />
      <Header />
      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Brand Logos Ticker */}
        <Clients />

        {/* 3. About Our Agency */}
        <About />

        {/* 4. Digital Services */}
        <Services />

        {/* 5. Core Features Bento Grid */}
        <LazySection id="features-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><CoreFeatures /></Suspense></LazySection>

        {/* 6. Featured Works / Portfolio */}
        <LazySection id="portfolio-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><Portfolio /></Suspense></LazySection>

        {/* 7. How It Works (Simple Process) */}
        <LazySection id="process-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><HowItWorks /></Suspense></LazySection>

        {/* 8. Pricing Plans */}
        <LazySection id="pricing-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><Pricing /></Suspense></LazySection>

        {/* 9. Winning Awards */}
        <LazySection id="awards-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><Awards /></Suspense></LazySection>

        {/* 10. Frequently Asked Questions */}
        <LazySection id="faq-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><FAQ /></Suspense></LazySection>

        {/* 11. Testimonials */}
        <LazySection id="testimonials-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><Testimonials /></Suspense></LazySection>

        {/* 12. Latest Blogs */}
        <LazySection id="blogs-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><LatestBlogs /></Suspense></LazySection>

        {/* 13. Consultation / Contact Growth CTA */}
        <LazySection id="contact-lazy"><Suspense fallback={<div style={{ minHeight: 600 }} />}><Contact /></Suspense></LazySection>
      </main>
      <Footer />
    </div>
  );
}
