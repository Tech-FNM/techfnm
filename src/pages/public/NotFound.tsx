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
      </Helmet>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <p className="text-red-500 font-bold text-6xl">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold">Page not found</h1>
        <p className="mt-3 text-zinc-400 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 font-semibold">Go to Home</Link>
          <Link to="/services" className="px-5 py-2.5 rounded-full border border-zinc-700 hover:border-zinc-500 font-semibold">Our Services</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
