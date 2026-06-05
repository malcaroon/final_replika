import {useState} from 'react';
import {ArrowLeft} from 'lucide-react';
import {Header, HeroSection, Highlights, Promo, About, Contact, Footer} from '.';
import LocationPicker from './components/Order/LocationPicker';
import OrderSlot from './components/Order/OrderPage';
import OrderProductDetailsPage from './components/Order/OrderProduct';

export default function App() {
  const [page, setPage] = useState('home');
  const [productId, setProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? {...i, qty: i.qty + item.qty, instructions: item.instructions}
            : i
        );
      }
      return [...prev, item];
    });
  };

  const updateCartQty = (productId, qty) => {
    setCartItems(prev =>
      prev.map(i =>
        i.productId === productId ? {...i, qty: Math.max(1, qty)} : i
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const navigate = (target, params) => {
    if (params?.productId) setProductId(params.productId);
    setPage(target);
  };

  return (
    <>
      {page !== 'order' && <Header onNavigate={navigate} cartItems={cartItems} />}
      {page === 'checkout' ? (
        <section className="min-h-screen pt-24 pb-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <button
              type="button"
              onClick={() => navigate('order')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 mb-4 cursor-pointer transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-500">Checkout page — coming soon.</p>
          </div>
        </section>
      ) : page === 'product' ? (
        <section className="min-h-screen pt-24 pb-12 bg-gray-50">
          <OrderProductDetailsPage
            id={productId}
            onNavigate={navigate}
            onAddToCart={addToCart}
          />
        </section>
      ) : page === 'location' ? (
        <section className="min-h-screen pt-24 pb-12 bg-gray-50">
          <LocationPicker onConfirm={() => setPage('order')} />
        </section>
      ) : page === 'order' ? (
        <section className="min-h-screen pt-0 pb-0">
          <OrderSlot
            onNavigate={navigate}
            cartItems={cartItems}
            onUpdateCartQty={updateCartQty}
            onRemoveFromCart={removeFromCart}
          />
        </section>
      ) : (
        <>
          <HeroSection />
          <Highlights />
          <Promo />
          <About />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}
