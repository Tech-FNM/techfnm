import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Contact from '../../components/Contact';
import SeoHead from '../../components/SeoHead';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="contact" title="Contact Us" />
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
