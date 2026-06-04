import {Star} from 'lucide-react';

export default function HeroSection() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center px-4 pt-20 pb-10 relative overflow-hidden bg-[#3c5e45]"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl bg-[#fbd897]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl bg-[#a4bbab]" />
      </div>

      <div className="container mx-auto relative z-10 pt-4 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 text-white">
            <div className="flex flex-wrap items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-1 text-xs sm:text-sm font-medium">
                Loved by locals in Tanza
              </span>
            </div>

            <h2 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Authentic
              <br />
              Filipino
              <br />
              <span className="text-[#fbd897]">Lechon</span>
            </h2>

            <p className="text-base sm:text-xl text-white/90 max-w-lg">
              Slow-roasted to perfection with crispy golden skin and juicy,
              tender meat. Every celebration deserves the best.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-block px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-[#fbd897] text-[#3c5e45] rounded-xl font-semibold hover:bg-[#f5cc7a] transition-colors"
              >
                Place Your Order
              </a>
              <button
                onClick={() => scrollToSection('highlights')}
                className="text-white hover:text-white/80 transition-colors font-medium text-sm sm:text-base cursor-pointer"
              >
                View Promo →
              </button>
            </div>

            <div className="flex items-center gap-6 sm:gap-12 pt-6 border-t border-white/20">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#fbd897]">
                  1000+
                </p>
                <p className="text-xs sm:text-sm text-white/70">
                  Happy Customers
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#fbd897]">
                  Daily
                </p>
                <p className="text-xs sm:text-sm text-white/70">Fresh Lechon</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#fbd897]">
                  10 Yrs
                </p>
                <p className="text-xs sm:text-sm text-white/70">Experience</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-75 sm:h-100 lg:h-150 rounded-3xl overflow-hidden bg-[#a4bbab] flex items-center justify-center">
              <img
                src="src/assets/hero_image.png"
                alt="Delicious Lechon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm mb-1 text-[#a4bbab]">
                    Opening Hours
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-[#3c5e45]">
                    10AM - 10PM
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm mb-1 text-[#a4bbab]">Days</p>
                  <p className="text-sm sm:text-base font-bold text-[#3c5e45]">
                    Tue - Sun
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
