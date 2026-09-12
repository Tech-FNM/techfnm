import Header from '../components/Header';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import About from '../components/About';
import Services from '../components/Services';
import CoreFeatures from '../components/CoreFeatures';
import Portfolio from '../components/Portfolio';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Awards from '../components/Awards';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import LatestBlogs from '../components/LatestBlogs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScriptInjector from '../components/ScriptInjector';
import SeoHead from '../components/SeoHead';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full selection:bg-[#e5432e] selection:text-white">
      <SeoHead pageId="home" />
      <ScriptInjector />
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
        <CoreFeatures />

        {/* 6. Featured Works / Portfolio */}
        <Portfolio />

        {/* 7. How It Works (Simple Process) */}
        <HowItWorks />

        {/* 8. Pricing Plans */}
        <Pricing />

        {/* 9. Winning Awards */}
        <Awards />

        {/* 10. Frequently Asked Questions */}
        <FAQ />

        {/* 11. Testimonials */}
        <Testimonials />

        {/* 12. Latest Blogs */}
        <LatestBlogs />

        {/* 13. Consultation / Contact Growth CTA */}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
