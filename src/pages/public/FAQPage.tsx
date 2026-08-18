import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FAQ from '../../components/FAQ';
import SeoHead from '../../components/SeoHead';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="faq" title="FAQ" />
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
