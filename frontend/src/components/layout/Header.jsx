import {ShoppingCart, Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';

const navItems = [
  {id: 'home', label: 'Home'},
  {id: 'highlights', label: 'Highlights'},
  {id: 'promo', label: 'Promo'},
  {id: 'about', label: 'About'},
  {id: 'contact', label: 'Contact'},
];

export default function Header() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'highlights', 'promo', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const {offsetTop, offsetHeight} = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
  };

  const handleNavClick = (id) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        <a
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src="src/assets/logo.png"
            alt="DonClaudio's Logo"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 className="font-bold text-xl text-[#3c5e45]">
              DonClaudio&apos;s
            </h1>
            <p className="text-xs text-[#a4bbab]">Lechon House</p>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className={`text-sm font-medium transition-colors hover:opacity-80 ${
                activeSection === item.id ? 'font-bold' : ''
              }`}
              style={{
                color: activeSection === item.id ? '#3c5e45' : '#a4bbab',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex gap-4 items-center">
          <a
            href="#contact"
            className="flex items-center gap-2 bg-[#3c5e45] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2d4a35] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Order Now</span>
          </a>
        </div>

        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="text-[#3c5e45] hover:bg-[#3c5e45]/10 transition-colors p-2 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className={`text-sm font-medium transition-colors hover:opacity-80 py-1 ${
                activeSection === item.id ? 'font-bold' : ''
              }`}
              style={{
                color: activeSection === item.id ? '#3c5e45' : '#a4bbab',
              }}
            >
              {item.label}
            </a>
          ))}

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4">
            <a
              href="#contact"
              className="flex items-center justify-center gap-2 bg-[#3c5e45] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2d4a35] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Order Now</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
