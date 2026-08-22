import { motion } from 'motion/react';
import { HelpCircle, Terminal, Users, Layers, TrendingUp, ArrowRight, Star } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import Leadership from '../../components/Leadership';

export default function AboutPage() {
  // Animation presets for consistency
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full">
      <SeoHead pageId="about" />
      <Header />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center py-20 bg-black overflow-hidden border-b border-zinc-900 px-4 sm:px-6 lg:px-8">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          
          {/* Background Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-950/20 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800/80 text-red-500 text-xs md:text-sm font-bold shadow-inner"
            >
              <HelpCircle size={14} className="animate-pulse" />
              <span>About Our Agency</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] md:leading-[1.1] text-balance"
            >
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Digital Growth</span> <br className="hidden sm:inline" />
              Partner
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-2xl mx-auto border border-zinc-800/60 py-8 px-6 md:px-10 mt-8 bg-zinc-950/30 backdrop-blur-md rounded-2xl shadow-xl"
            >
              <p className="text-base md:text-lg text-zinc-300 italic font-medium leading-relaxed">
                “<span className="text-white font-bold tracking-wide">TechFNM®</span> crafts state-of-the-art software solutions that empower developers and organizations to integrate, visualize, and analyze data across the technological vertical.”
              </p>
            </motion.div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="py-24 md:py-32 bg-black relative overflow-hidden border-b border-zinc-900">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-red-950/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              
              {/* Left Column - Graphic/Sphere & Stats */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-10">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                  {/* Glowing core */}
                  <div className="absolute w-28 h-28 bg-red-900/10 blur-3xl rounded-full animate-pulse" />
                  
                  {/* Wireframe Rotating Sphere SVG */}
                  <svg className="w-full h-full animate-[spin_50s_linear_infinite] text-red-700/50" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3 3" />
                    <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="currentColor" strokeWidth="0.3" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="5 5" />
                  </svg>
                </div>

                {/* Stats list under sphere */}
                <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-md border-t border-zinc-800/80 pt-8">
                  <div className="text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">2023</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">Founded</div>
                  </div>
                  <div className="text-center space-y-1 border-x border-zinc-800/60 px-2">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">100%</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">Remote</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">50+</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">Projects</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Text Content */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div {...fadeInUp} className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Our Story
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                    Our Existence <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Explained</span>
                  </h2>
                  
                  <div className="text-zinc-300 space-y-6 leading-relaxed text-base sm:text-lg">
                    <p className="text-zinc-200">
                      Founded in <span className="text-white font-bold">2023</span>, we recognized a demand for solutions that empower enterprises to distill exponential information into its purest and most simplistic form.
                    </p>
                    <p>
                      Looking at the market, we encountered software solutions that struggled to handle considerable, ever-changing data complexities. We saw tools that needed to be faster, more convenient, and more precise for effective deployment.
                    </p>
                    <p className="border-l-2 border-red-600 pl-4 py-1 italic bg-zinc-950/40 text-zinc-400 rounded-r-lg">
                      Existing software failed under intense demands, resorting to stopgap measures, unjustifiable compromises, and convoluted final solutions. Often <span className="text-white font-semibold underline decoration-red-500 decoration-2">forcing engineering teams</span> to develop custom solutions that were expensive and difficult to maintain.
                    </p>
                    <p>
                      With a <span className="text-red-500 font-extrabold tracking-wide">clear vision</span>, we developed a suite of technologies characterized by their exceptional adaptability, pinpoint accuracy, and enhanced productivity. Our solutions are designed to <span className="text-white font-semibold">liberate businesses</span>, enabling them to manage large data sets with ease.
                    </p>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* WHAT WE DO & DIFFERENCE SECTION */}
        <section className="py-24 md:py-32 bg-zinc-950/30 relative border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Card 1: What We Do */}
              <motion.div 
                {...fadeInUp}
                className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-md flex flex-col justify-between hover:border-red-650/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-855 text-zinc-400 text-xs font-bold">
                    <Layers size={12} className="text-red-500" />
                    <span>Our Craft</span>
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Do</span>
                  </h3>
                  <p className="text-lg font-semibold text-zinc-200 leading-relaxed">
                    We forge technologies that maintain simplicity, intuitiveness, and clarity at their foundation.
                  </p>
                  <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                    From documentation to production to deployment, we built TechFNM around the concept of 'seamless simplicity'. We provide software that engineers can effortlessly integrate in the development of applications that handle complex, multi-faceted, and large datasets.
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-zinc-800/60">
                  <a href="/request-service" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-all hover:gap-3 group text-sm sm:text-base">
                    <span>Learn more About Our Platforms</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>

              {/* Card 2: Our Difference */}
              <motion.div 
                {...fadeInUp}
                className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-md flex flex-col hover:border-red-650/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-855 text-zinc-400 text-xs font-bold">
                    <TrendingUp size={12} className="text-red-500" />
                    <span>Our Craft</span>
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Difference</span>
                  </h3>
                  <h4 className="text-lg font-bold text-white leading-snug">
                    We Design For Developers, & Pioneer for Enterprises!
                  </h4>
                  <div className="text-zinc-400 space-y-4 leading-relaxed text-sm sm:text-base">
                    <p>
                      At <span className="text-white font-semibold">TechFNM</span>, we believe in harnessing technology's power so that enterprises can handle their data efficiently and precisely.
                    </p>
                    <p>
                      Our commitment to innovation isn't only about what we make; it's about how we think. We design software to answer the most difficult question that all modern organizations grapple with: <span className="text-zinc-200 font-semibold italic">"How do we make this simple?"</span>
                    </p>
                    <p>
                      You're not just using software; you're experiencing a philosophy where every complex problem is solved with uncompromising clarity.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-24 md:py-32 bg-black relative border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Team Text */}
              <div className="lg:col-span-6 space-y-8">
                <motion.div {...fadeInUp} className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold">
                    <Users size={12} className="text-red-500" />
                    <span>Our Team</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                    We care deeply <span className="text-zinc-400">about the quality of our</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">work</span>
                  </h2>
                  
                  <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                    <span className="text-white font-bold">TechFNM</span> has always been a fully remote company. Today, our small but mighty team is distributed across the region. What unites us is relentless focus, fast execution, and our passion for software craftsmanship. We are all makers at heart and care deeply about the quality of our work, down to the smallest detail.
                  </p>

                  <div className="pt-2">
                    <a href="/request-service" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 hover:border-red-650/40 text-white border border-zinc-800 px-6 py-3 rounded-full font-bold transition-all shadow-md">
                      <span>We're hiring</span>
                      <ArrowRight size={16} className="text-red-500" />
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Team Graphic Placeholder */}
              <div className="lg:col-span-6">
                <motion.div 
                  {...fadeInUp}
                  className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-3xl relative overflow-hidden backdrop-blur-md hover:border-red-650/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-650/10 via-transparent to-transparent rounded-2xl opacity-60 pointer-events-none" />
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-zinc-850">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]" />
                    
                    <div className="relative flex flex-col items-center text-center p-6 space-y-4 max-w-sm">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-500/10">
                        <Users className="text-red-500 w-8 h-8 animate-pulse" />
                      </div>
                      <span className="text-white font-bold text-lg tracking-wide">TechFNM Craftsmen</span>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        A dedicated assembly of developers and engineers focused on building the digital future.
                      </p>
                      <div className="flex gap-1.5 pt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-red-500 fill-red-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
                <div className="text-center mt-4 text-xs text-zinc-500 font-mono tracking-wider uppercase">
                  TechFNM Co-founders and Engineering Craftsmen
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* LEADERSHIP SECTION */}
        <Leadership />

        {/* NUMBERS SECTION */}
        <section className="py-24 bg-black relative">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-950/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-400 text-xs font-bold">
              <span>Numbers</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Trust backed <span className="text-zinc-400">by</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">numbers</span>
            </h2>
            
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              We have a clear mission: Connect clients to success and deliver absolute clarity.
            </p>

            {/* Wireframe Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              
              {/* Card 1 */}
              <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md hover:border-red-650/30 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">2023</div>
                <div className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Founded</div>
              </div>

              {/* Card 2 */}
              <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md hover:border-red-650/30 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">100%</div>
                <div className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Remote</div>
              </div>

              {/* Card 3 */}
              <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md hover:border-red-650/30 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">50+</div>
                <div className="text-xs text-zinc-500 font-bold tracking-wider uppercase">Projects</div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
