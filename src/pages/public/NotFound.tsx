import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col justify-between">
      <Helmet>
        <title>Page Not Found | TechFNM</title>
        <meta name="robots" content="noindex" />
        <meta name="description" content="The page you are looking for does not exist or has been moved." />
      </Helmet>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <p className="text-[#e5432e] font-bold text-6xl tracking-tight">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Page not found</h1>
        <p className="mt-3 text-zinc-400 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary px-6 py-3 rounded-full font-semibold">Go to Home</Link>
          <Link to="/services" className="btn-secondary px-6 py-3 rounded-full font-semibold">Our Services</Link>
          <Link to="/contact" className="btn-secondary px-6 py-3 rounded-full font-semibold">Contact Us</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
