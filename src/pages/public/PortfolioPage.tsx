import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Portfolio from '../../components/Portfolio';
import SeoHead from '../../components/SeoHead';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="portfolio" title="Our Portfolio" />
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <Portfolio />
      </main>
      <Footer />
    </div>
  );
}
