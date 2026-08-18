import Header from '../../components/Header';
import Footer from '../../components/Footer';
import About from '../../components/About';
import SeoHead from '../../components/SeoHead';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="about" title="About Us" />
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <About />
      </main>
      <Footer />
    </div>
  );
}
