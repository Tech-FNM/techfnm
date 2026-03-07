/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Team />
        <Testimonials />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
