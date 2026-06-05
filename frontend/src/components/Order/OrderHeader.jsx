import {ShoppingCart, Menu, X} from 'lucide-react';
import {useEffect, useState} from 'react';

const navItems = [
  {id: 'home', label: 'Home'},
  {id: 'highlights', label: 'Highlights'},
  {id: 'promo', label: 'Promo'},
  {id: 'about', label: 'About'},
  {id: 'contact', label: 'Contact'},
];

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
};

function getCartUniqueCount(items) {
  return new Set(items.map((i) => i.productId)).size;
}

function getCartSubtotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export default function OrderHeader({onNavigate = () => {}, onCartClick, cartItems = []}) {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const closeModal = () => {
    setOrderModalOpen(false);
  };

  const cartUniqueCount = getCartUniqueCount(cartItems);
  const cartSubtotal = getCartSubtotal(cartItems);

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

  const handleNavClick = (id) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    onCartClick?.();
  };

  const handleContinueAsGuest = () => {
    closeModal();
    onNavigate('location');
  };

  const handleGoToSignIn = () => {
    setOrderModalOpen(false);
  };

  const handleGoToSignUp = () => {
    setOrderModalOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        <a
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-3 cursor-default"
        >
          <img
            src="src/assets/logo.png"
            alt="DonClaudio's Logo"
            className="w-12 h-12 object-contain"
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
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-sm font-medium text-[#3c5e45] transition-colors"
          >
            Login
          </a>
          <button
            onClick={handleCartClick}
            className="flex items-center justify-center bg-[#3c5e45] text-white p-2 rounded-xl hover:bg-[#2d4a35] transition-colors cursor-pointer gap-2"
            aria-label="Open cart"
          >
            <span className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartUniqueCount > 0 && (
                <span className="absolute -right-2 -top-2 h-5 min-w-5 px-1 rounded-full bg-[#c30010] text-white text-[10px] font-bold grid place-items-center">
                  {cartUniqueCount}
                </span>
              )}
            </span>
            {cartSubtotal > 0 && (
              <span className="text-xs font-semibold">₱{cartSubtotal}.00</span>
            )}
          </button>
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
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-gray-700 hover:opacity-80"
            >
              Login
            </a>
            <button
              onClick={handleCartClick}
              className="flex items-center justify-center bg-[#3c5e45] text-white p-2 rounded-xl hover:bg-[#2d4a35] transition-colors cursor-pointer gap-2"
              aria-label="Open cart"
            >
              <span className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartUniqueCount > 0 && (
                  <span className="absolute -right-2 -top-2 h-5 min-w-5 px-1 rounded-full bg-[#c30010] text-white text-[10px] font-bold grid place-items-center">
                    {cartUniqueCount}
                  </span>
                )}
              </span>
              {cartSubtotal > 0 && (
                <span className="text-xs font-semibold">₱{cartSubtotal}.00</span>
              )}
            </button>
          </div>
        </div>
      )}

      {orderModalOpen && (
        <div
          className="fixed inset-0 z-[60] h-dvh flex items-center justify-center bg-black/50 px-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-130 rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-500 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 pb-8 pt-12 text-center">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src="src/assets/logo.png"
                    alt="DonClaudio's Logo"
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-2xl font-extrabold text-[#3c5e45]">
                    DonClaudio&apos;s
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Sign up / Log in
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Welcome to DonClaudio&apos;s! Log in or create an account to
                  start ordering.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleGoToSignUp}
                    className="w-full bg-[#3c5e45] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#2d4a35] transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>

                  <button
                    type="button"
                    onClick={handleGoToSignIn}
                    className="w-full text-sm font-semibold text-[#3c5e45] hover:underline cursor-pointer bg-transparent"
                  >
                    Log in
                  </button>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <button
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="w-full text-sm font-semibold text-gray-700 hover:underline cursor-pointer bg-transparent"
                  >
                    Continue as Guest
                  </button>
                </div>

                <p className="mt-6 text-xs text-gray-500">
                  By continuing, you agree to our Terms &amp; Conditions and
                  Privacy Notice.
                </p>
              </div>
          </div>
        </div>
      )}
    </header>
  );
}
