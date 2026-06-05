import {History, Search} from 'lucide-react';
import {useMemo, useState} from 'react';
import OrderHeader from './OrderHeader';
import Footer from '../layout/Footer';
import CartDrawer from './CartDrawer';

const MOCK_PRODUCTS = [
  {
    _id: '1', name: 'Whole Lechon', price: 150, category: 'Lechon',
    isAvailable: true, stock: 10,
    description: 'Slow-roasted whole pig with crispy golden skin.',
    imageUrl: 'src/assets/hero_image.png',
  },
  {
    _id: '2', name: 'Lechon Kawali', price: 120, category: 'Lechon',
    isAvailable: true, stock: 15,
    description: 'Crispy fried pork belly served with liver sauce.',
    imageUrl: '',
  },
];

const MOCK_PROMOS = [
  {
    _id: 'bundle-1', title: 'Family Feast Bundle', price: 280,
    promoType: 'bundle', description: 'Whole lechon + 3 sides + 1.5L drink. Save 20%!',
    imageUrl: '',
  },
  {
    _id: 'bundle-2', title: 'Group Package', price: 500,
    promoType: 'bundle', description: '2 whole lechon + 6 sides + drinks.',
    imageUrl: '',
  },
  {
    _id: 'promo-1', title: 'Weekend Special', discountPercent: 10,
    productIds: ['1'], promoType: 'discount',
    description: '10% off whole lechon every weekend.',
    imageUrl: '',
  },
];

function getBundleBadge() {
  return {label: 'BUNDLE', variant: 'bundle'};
}

function getPromoBadgeForProduct({promos, productId}) {
  const matchingPromo = promos.find(
    p => p.promoType === 'discount' && p.productIds?.includes(productId)
  );
  if (matchingPromo) {
    return {label: `${matchingPromo.discountPercent}% OFF`, variant: 'promo'};
  }
  return undefined;
}

export default function OrderSlot({onNavigate, cartItems, onUpdateCartQty, onRemoveFromCart}) {
  const [products] = useState(MOCK_PRODUCTS);
  const [promos] = useState(MOCK_PROMOS);
  const [cartOpen, setCartOpen] = useState(false);

  const availableProducts = useMemo(() => {
    return products.filter(p => p.isAvailable && p.stock > 0);
  }, [products]);

  const promoBundles = useMemo(() => {
    return promos.filter(p => p.promoType === 'bundle' && typeof p.price === 'number');
  }, [promos]);

  const tabs = useMemo(() => {
    const categories = Array.from(
      new Set(
        availableProducts
          .map(p => p.category)
          .filter(c => typeof c === 'string' && c.trim().length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    return [
      {id: 'featured', label: 'Featured', category: null},
      ...(promoBundles.length > 0
        ? [{id: 'promoBundles', label: 'Promo Bundles', category: null}]
        : []),
      ...categories.map(category => ({
        id: category.toLowerCase().replace(/\s+/g, ''),
        label: category,
        category,
      })),
    ];
  }, [availableProducts, promoBundles.length]);

  const [activeTab, setActiveTab] = useState('featured');
  const [query, setQuery] = useState('');

  const featuredItems = useMemo(() => {
    return availableProducts.slice(0, 5);
  }, [availableProducts]);

  const activeCategory = useMemo(() => {
    if (activeTab === 'featured') return null;
    if (activeTab === 'promoBundles') return null;
    return tabs.find(t => t.id === activeTab)?.category ?? null;
  }, [activeTab, tabs]);

  const visibleItems = useMemo(() => {
    if (activeTab === 'promoBundles') {
      const normalizedQuery = query.trim().toLowerCase();
      const filtered = normalizedQuery
        ? promoBundles.filter(p => p.title.toLowerCase().includes(normalizedQuery))
        : promoBundles;
      return filtered.slice(0, 5).map(p => ({
        id: p._id,
        name: p.title,
        price: p.price,
        imageUrl: p.imageUrl,
        note: p.description,
      }));
    }

    const sourceItems = activeTab === 'featured'
      ? featuredItems
      : availableProducts.filter(p => p.category === activeCategory);

    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? sourceItems.filter(item => item.name.toLowerCase().includes(normalizedQuery))
      : sourceItems;

    return filtered.slice(0, 5).map(item => ({
      id: item._id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      note: item.description,
    }));
  }, [activeCategory, activeTab, availableProducts, featuredItems, promoBundles, query]);

  return (
    <>
    <OrderHeader onNavigate={onNavigate} onCartClick={() => setCartOpen(true)} />
    <div className="w-full max-w-6xl mx-auto pt-24">
      <div className="w-full rounded-2xl overflow-hidden mb-10 bg-[#3c5e45]">
        <div className="flex items-center justify-between px-8 py-8">
          <div>
            <p className="text-[#fbd897] text-[11px] uppercase mb-2">
              Now Serving
            </p>
            <h1 className="text-white text-3xl font-bold">
              DonClaudio&apos;s
              <span className="block text-[#fbd897]">Lechon House</span>
            </h1>
            <p className="text-white/60 text-sm mt-2">
              Enjoy your meal with a smile!
            </p>
          </div>
          <div className="hidden sm:block w-40 h-40">
            <img
              src="src/assets/logo.png"
              alt="logo"
              className="w-full h-full object-contain rounded-xl"
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">DonClaudios Menu</h1>
        <button
          type="button"
          className="relative rounded-full p-2 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Order history"
        >
          <History className="h-5 w-5 text-[#2d4a35]" />
        </button>
      </div>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full md:w-64">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search menu"
                aria-label="Search menu"
                className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2">
            {tabs.map(tab => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ' +
                    (isActive
                      ? 'bg-[#c30010] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50')
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-[22px] font-bold text-gray-900">
            {activeTab === 'featured'
              ? 'Featured'
              : (tabs.find(t => t.id === activeTab)?.label ?? 'Products')}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5 mb-4">
            {activeTab === 'featured'
              ? 'Discover your favorites!'
              : 'Browse items'}
          </p>

          <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-2">
            {visibleItems.map(item => {
              const isBundle = activeTab === 'promoBundles';
              const badge = isBundle
                ? {label: getBundleBadge()?.label ?? 'BUNDLE', variant: 'bundle'}
                : (() => {
                    const b = getPromoBadgeForProduct({promos, productId: item.id});
                    return b ? {label: b.label, variant: 'promo'} : undefined;
                  })();

              return (
                <div
                  key={item.id}
                  className="relative bg-white rounded-3xl border border-gray-200 overflow-hidden shrink-0 w-72 cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => onNavigate('product', {productId: item.id})}
                >
                  <div className="h-48 bg-gray-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : null}
                  </div>

                  {badge && (
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                        badge.variant === 'bundle'
                          ? 'bg-[#fbd897] text-[#3c5e45]'
                          : 'bg-[#c30010] text-white'
                      }`}
                    >
                      {badge.label}
                    </div>
                  )}

                  <div className="p-5 flex flex-col h-44">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>
                    {item.note && (
                      <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-2">
                        {item.note}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-lg font-bold text-black">
                        ₱{item.price}.00
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {visibleItems.length === 0 && (
              <p className="text-sm text-gray-500 w-full text-center py-8">
                No items found.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
    <Footer />
    <CartDrawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      onNavigate={onNavigate}
      items={cartItems}
      onUpdateQty={onUpdateCartQty}
      onRemoveItem={onRemoveFromCart}
    />
    </>
  );
}
