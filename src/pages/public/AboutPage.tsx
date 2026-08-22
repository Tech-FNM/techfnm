import { motion } from 'motion/react';
import { HelpCircle, Terminal, Users, Layers, TrendingUp, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full">
      <SeoHead pageId="about" />
      <Header />

      <main className="pt-24">
        {/* HERO SECTION */}
        <section className="relative py-28 md:py-36 bg-black overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          {/* Glow effect */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold mb-8"
            >
              <HelpCircle size={14} />
              <span>About Us</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-10 leading-[1.15]"
            >
              We Turn Complexity & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Intricacy...</span> <br />
              To Elegant Simplicity & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">Absolute Clarity</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto border-t border-b border-zinc-800 py-8 px-6 mt-12 bg-zinc-950/40 backdrop-blur-sm rounded-2xl"
            >
              <p className="text-lg md:text-xl text-zinc-400 italic font-medium leading-relaxed">
                “<span className="text-white font-semibold">TechFNM®</span> crafts state-of-the-art software solutions that empower developers and organizations to integrate, visualize, and analyze data across the technological vertical.”
              </p>
            </motion.div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="py-24 bg-black relative overflow-hidden border-b border-zinc-900">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-red-950/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column - Graphic/Sphere & Stats */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-72 h-72 md:w-80 md:h-80 mb-12 flex items-center justify-center">
                  {/* Glowing core */}
                  <div className="absolute w-32 h-32 bg-red-600/20 blur-3xl rounded-full animate-pulse" />
                  {/* Wireframe Rotating Sphere SVG */}
                  <svg className="w-full h-full animate-[spin_40s_linear_infinite] text-red-600/30" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Terminal className="text-red-500 w-12 h-12" />
                  </div>
                </div>

                {/* Stats list under sphere */}
                <div className="grid grid-cols-3 gap-8 w-full max-w-md border-t border-zinc-800 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-white">2023</div>
                    <div className="text-xs text-zinc-500 font-semibold uppercase mt-1">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-white">100%</div>
                    <div className="text-xs text-zinc-500 font-semibold uppercase mt-1">Remote</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-white">50+</div>
                    <div className="text-xs text-zinc-500 font-semibold uppercase mt-1">Projects</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Text Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  Our Story
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Our Existence <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Explained</span>
                </h2>
                
                <div className="text-zinc-400 space-y-6 leading-relaxed text-base md:text-lg">
                  <p>
                    Founded in <span className="text-white font-semibold">2023</span>, we recognized a demand for solutions that empower enterprises to distill exponential information into its purest and most simplistic form.
                  </p>
                  <p>
                    Looking at the market, we encountered software solutions that struggled to handle considerable, ever-changing data complexities. We saw tools that needed to be faster, more convenient, and more precise for effective deployment.
                  </p>
                  <p>
                    Existing software failed under intense demands, resorting to stopgap measures, unjustifiable compromises, and convoluted final solutions. Often <span className="text-white font-semibold underline decoration-red-500 decoration-2">forcing engineering teams</span> within organizations to develop custom solutions that were, at best, partially successful and, at worst, expensive and difficult to maintain.
                  </p>
                  <p>
                    With a <span className="text-red-500 font-bold">clear vision</span>, we developed a suite of technologies characterized by their exceptional adaptability, pinpoint accuracy, and enhanced productivity. Our solutions are designed to <span className="text-white font-semibold">liberate businesses</span>, enabling them to manage large data sets with ease while seamlessly deriving and communicating intricate insights in real-time.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* WHAT WE DO & DIFFERENCE SECTION */}
        <section className="py-24 bg-zinc-950/40 relative border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Card 1: What We Do */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-10 backdrop-blur-sm flex flex-col justify-between hover:border-red-600/30 transition-all duration-300">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-bold">
                    <Layers size={12} className="text-red-500" />
                    <span>Our Craft</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">
                    What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Do</span>
                  </h3>
                  <p className="text-lg font-medium text-zinc-300 leading-relaxed">
                    We forge technologies that maintain simplicity, intuitiveness, and clarity at their foundation.
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    From documentation to production to deployment, we built TechFNM around the concept of 'seamless simplicity'. We provide software that engineers can effortlessly integrate in the development of applications that handle complex, multi-faceted, and large datasets.
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <a href="/request-service" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-all hover:gap-3">
                    <span>Learn more About Our Platforms</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>

              {/* Card 2: Our Difference */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-10 backdrop-blur-sm flex flex-col hover:border-red-600/30 transition-all duration-300">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-bold">
                    <TrendingUp size={12} className="text-red-500" />
                    <span>Our Craft</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Difference</span>
                  </h3>
                  <h4 className="text-lg font-bold text-white">
                    We Design For Developers, & Pioneer for Enterprises!
                  </h4>
                  <div className="text-zinc-400 space-y-4 leading-relaxed">
                    <p>
                      At <span className="text-white font-semibold">TechFNM</span>, we believe in harnessing technology's power so that enterprises can handle their data efficiently and precisely.
                    </p>
                    <p>
                      Our commitment to innovation isn't only about what we make; it's about how we think. We design software to answer the most difficult question that all modern organizations grapple with: <span className="text-white font-semibold italic">"How do we make this simple?"</span>
                    </p>
                    <p>
                      You're not just using software; you're experiencing a philosophy where every complex problem is solved with uncompromising clarity. "How do we make this simple for our client?" is not just a question—it's our mission.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-24 bg-black relative border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Team Text */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold">
                  <Users size={12} className="text-red-500" />
                  <span>Team</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  We care deeply <span className="text-zinc-400">about the quality of our</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">work</span>
                </h2>
                
                <p className="text-zinc-400 text-lg leading-relaxed">
                  <span className="text-white font-semibold">TechFNM</span> has always been a fully remote company. Today, our small but mighty team is distributed across the region. What unites us is relentless focus, fast execution, and our passion for software craftsmanship. We are all makers at heart and care deeply about the quality of our work, down to the smallest detail.
                </p>

                <div>
                  <a href="/request-service" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-6 py-3 rounded-full font-bold transition-all">
                    <span>We're hiring</span>
                    <ArrowRight size={16} className="text-red-500" />
                  </a>
                </div>
              </div>

              {/* Team Graphic Placeholder */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent rounded-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-3xl relative overflow-hidden backdrop-blur-md">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                    {/* Abstract illustration simulating team photo with high tech aesthetic */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative flex flex-col items-center text-center p-6 space-y-4">
                      <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <Users className="text-red-500 w-10 h-10" />
                      </div>
                      <span className="text-white font-bold text-lg">TechFNM Team</span>
                      <p className="text-zinc-500 text-sm max-w-xs">
                        Co-founders, developers, and designers crafting premium web experiences.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 text-xs text-zinc-500 font-mono">
                  TechFNM Co-founders and Engineering Craftsmen
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* NUMBERS SECTION */}
        <section className="py-24 bg-black relative">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-950/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-400 text-xs font-bold mb-6">
              <span>Numbers</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Trust backed <span className="text-zinc-400">by</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">numbers</span>
            </h2>
            
            <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-16">
              We have a big mission in front of us: Connect clients to success and deliver absolute clarity.
            </p>

            {/* Wireframe Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              
              {/* Card 1 */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm hover:border-red-600/30 transition-colors">
                <div className="text-4xl font-extrabold text-white mb-2">2023</div>
                <div className="text-sm text-zinc-500 font-bold tracking-wide uppercase">Founded</div>
              </div>

              {/* Card 2 */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm hover:border-red-600/30 transition-colors">
                <div className="text-4xl font-extrabold text-white mb-2">100%</div>
                <div className="text-sm text-zinc-500 font-bold tracking-wide uppercase">Remote</div>
              </div>

              {/* Card 3 */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm hover:border-red-600/30 transition-colors">
                <div className="text-4xl font-extrabold text-white mb-2">50+</div>
                <div className="text-sm text-zinc-500 font-bold tracking-wide uppercase">Projects</div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
