import {ArrowLeft, Minus, Plus, ShoppingCart} from 'lucide-react';
import {useMemo, useState} from 'react';
import OrderHeader from './OrderHeader';
import Footer from '../layout/Footer';

const MOCK_PRODUCTS = [
  {
    _id: '1', name: 'Whole Lechon', price: 150, category: 'Lechon',
    isAvailable: true, stock: 10,
    description: 'Slow-roasted whole pig with crispy golden skin. Served with liver sauce and pickled papaya.',
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
    _id: 'promo-1', title: 'Weekend Special', discountPercent: 10,
    productIds: ['1'], promoType: 'discount',
    description: '10% off whole lechon every weekend.',
    imageUrl: '',
  },
  {
    _id: 'promo-2', title: 'Kawali Deal', discountPercent: 15,
    productIds: ['2'], promoType: 'discount',
    description: '15% off Lechon Kawali.',
    imageUrl: '',
  },
];

function getDiscountedUnitPrice({promos, productId, basePrice}) {
  const matchingPromo = promos.find(
    p => p.promoType === 'discount' && p.productIds?.includes(productId)
  );
  if (matchingPromo && matchingPromo.discountPercent) {
    return {unitPrice: Math.round(basePrice * (1 - matchingPromo.discountPercent / 100))};
  }
  return {unitPrice: basePrice};
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

export default function OrderProductDetailsPage({id, onNavigate, onAddToCart}) {
  const [promos] = useState(MOCK_PROMOS);
  const [cartItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');

  const product = MOCK_PRODUCTS.find(p => p._id === id) ?? MOCK_PRODUCTS[0];
  const isLoading = false;
  const isError = false;
  const isCustomerRoute = false;

  const openCart = () => {};
  const addItem = (item) => {
    onAddToCart(item);
    onNavigate('order');
  };
  const addCustomerCartItemMutation = {mutate: () => {}};

  const cartUniqueCount = cartItems.length;
  const cartSubtotal = useMemo(() => {
    if (promos.length === 0) {
      return cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }
    return cartItems.reduce((sum, i) => {
      const {unitPrice} = getDiscountedUnitPrice({
        promos,
        productId: i.productId,
        basePrice: i.price,
      });
      return sum + unitPrice * i.quantity;
    }, 0);
  }, [cartItems, promos]);

  const total = useMemo(() => {
    if (!product) return 0;
    const {unitPrice} = getDiscountedUnitPrice({
      promos,
      productId: product._id,
      basePrice: product.price,
    });
    return unitPrice * qty;
  }, [product, promos, qty]);

  const badge = useMemo(() => {
    if (!product) return null;
    return getPromoBadgeForProduct({promos, productId: product._id});
  }, [product, promos]);

  const handleBack = () => {
    onNavigate('order');
  };

  return (
    <div className="flex flex-col min-h-screen">
    <OrderHeader onNavigate={onNavigate} onCartClick={() => {}} />
    <div className="bg-gray-50 flex-1">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {isCustomerRoute ? (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => openCart()}
              className="relative rounded-full p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open cart"
            >
              <span className="relative">
                <ShoppingCart className="h-5 w-5 text-[#2d4a35]" />
                {cartUniqueCount > 0 && (
                  <span className="absolute -right-2 -top-2 h-5 min-w-5 px-1 rounded-full bg-[#c30010] text-white text-[10px] font-bold grid place-items-center">
                    {cartUniqueCount}
                  </span>
                )}
              </span>
              {cartUniqueCount > 0 && (
                <span className="ml-2 text-sm font-semibold text-[#2d4a35]">
                  ₱{cartSubtotal}.00
                </span>
              )}
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Product details</h1>
        </div>

        {isLoading && (
          <div className="mt-8 text-sm text-gray-500">Loading product...</div>
        )}

        {isError && (
          <div className="mt-8 text-sm text-gray-500">
            Failed to load product.
          </div>
        )}

        {product && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="w-full">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white border border-gray-100">
                {product.imageUrl && product.imageUrl.length > 0 ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                    No image
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.category}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {(() => {
                    const {unitPrice} = getDiscountedUnitPrice({
                      promos,
                      productId: product._id,
                      basePrice: product.price,
                    });
                    const isDiscounted = unitPrice < product.price;
                    return (
                      <>
                        <p className="text-sm font-bold text-gray-900">
                          ₱{unitPrice}.00
                        </p>
                        {isDiscounted ? (
                          <p className="text-[11px] text-gray-400 line-through">
                            ₱{product.price}.00
                          </p>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
              </div>

              {badge ? (
                <div className="mt-3 inline-flex items-center rounded-full bg-[#c30010] text-white px-3 py-1 text-xs font-extrabold">
                  {badge.label}
                </div>
              ) : null}

              {product.description && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mt-8">
                <label className="text-sm font-semibold text-gray-900">
                  Special instructions
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Add a note for the kitchen (e.g. no ginger, less spicy).
                </p>
                <textarea
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Type your request here..."
                  className="mt-3 w-full min-h-28 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3c5e45]/20 focus:border-[#3c5e45] resize-none"
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="inline-flex items-center justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5 text-gray-600" />
                  </button>

                  <span className="min-w-6 text-center text-base font-semibold text-gray-900">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQty(q => q + 1)}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!product}
                  onClick={() => {
                    if (!product) return;
                    if (isCustomerRoute) {
                      addCustomerCartItemMutation.mutate({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: qty,
                        imageUrl: product.imageUrl,
                      });
                    } else {
                      addItem({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        qty,
                        instructions: instructions.trim().length
                          ? instructions.trim()
                          : undefined,
                      });
                    }
                    openCart();
                  }}
                  className="w-full sm:flex-1 h-12 rounded-full bg-[#3c5e45] text-white font-semibold hover:bg-[#2d4a35] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Add to Cart - <span className="font-bold">₱{total}.00</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
    
  );
}
