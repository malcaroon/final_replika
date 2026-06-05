import {X, Minus, Plus, Bike, ShoppingBag, CalendarClock, ChevronDown} from 'lucide-react';
import {useMemo, useState} from 'react';

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

export default function CartDrawer({open, onClose, onNavigate, items, onUpdateQty, onRemoveItem, deliveryFee = 49}) {
  const [orderType, setOrderType] = useState('Delivery');
  const [timing, setTiming] = useState('ASAP');
  const [reservationGuests, setReservationGuests] = useState(1);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [draftOrderType, setDraftOrderType] = useState('Delivery');
  const [draftTiming, setDraftTiming] = useState('ASAP');
  const [draftReservationGuests, setDraftReservationGuests] = useState(1);
  const [draftReservationDate, setDraftReservationDate] = useState('');
  const [draftReservationTime, setDraftReservationTime] = useState('18:00');
  const [removeTarget, setRemoveTarget] = useState(null);

  const [promos] = useState(MOCK_PROMOS);

  const defaultScheduleDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const subtotal = useMemo(() => {
    if (promos.length === 0) {
      return items.reduce((sum, i) => sum + i.price * i.qty, 0);
    }
    return items.reduce((sum, i) => {
      const {unitPrice} = getDiscountedUnitPrice({
        promos,
        productId: i.productId,
        basePrice: i.price,
      });
      return sum + unitPrice * i.qty;
    }, 0);
  }, [items, promos]);

  const effectiveDeliveryFee = items.length > 0 && orderType === 'Delivery' ? deliveryFee : 0;
  const total = subtotal + effectiveDeliveryFee;

  if (!open) return null;

  const openOrderDetails = () => {
    setDraftOrderType(orderType);
    setDraftTiming(timing);
    setDraftReservationGuests(reservationGuests);
    setDraftReservationDate(reservationDate || defaultScheduleDate);
    setDraftReservationTime(reservationTime || '18:00');
    setOrderDetailsOpen(true);
  };

  const cancelOrderDetails = () => {
    setOrderDetailsOpen(false);
  };

  const confirmOrderDetails = () => {
    setOrderType(draftOrderType);
    setTiming(draftTiming);
    setReservationGuests(Math.max(1, draftReservationGuests));
    setReservationDate(draftReservationDate);
    setReservationTime(draftReservationTime);
    setOrderDetailsOpen(false);
  };

  const goToCheckout = () => {
    const id = String(Date.now());
    onClose();
    onNavigate('checkout', {orderId: id});
  };

  const requestRemoveItem = (item) => {
    setRemoveTarget({productId: item.productId, name: item.name});
  };

  const confirmRemoveItem = () => {
    if (!removeTarget) return;
    onRemoveItem(removeTarget.productId);
    setRemoveTarget(null);
  };

  const summaryText = orderType === 'Reservation'
    ? `${orderType}, ${reservationDate || defaultScheduleDate}, ${reservationTime || '18:00'}`
    : `${orderType}, Today, ${timing}`;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={
          'fixed bg-white shadow-2xl flex flex-col ' +
          'w-full md:w-105 ' +
          'bottom-0 md:bottom-auto md:top-0 md:right-0 ' +
          'h-[85dvh] md:h-dvh ' +
          'rounded-t-3xl md:rounded-none'
        }
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900">
              My Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </p>
            <button
              type="button"
              className="mt-0.5 w-full inline-flex items-center justify-between gap-2 text-left text-xs font-semibold text-[#c30010]"
              onClick={openOrderDetails}
            >
              <span className="min-w-0 truncate">{summaryText}</span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="text-sm text-gray-500 py-10 text-center">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.productId}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={
                        item.imageUrl && item.imageUrl.length > 0
                          ? item.imageUrl
                          : 'src/assets/sample_menu.png'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          className="mt-1 text-xs font-semibold text-[#c30010]"
                          onClick={() => requestRemoveItem(item)}
                        >
                          Remove
                        </button>
                      </div>

                      {(() => {
                        const {unitPrice} = getDiscountedUnitPrice({
                          promos,
                          productId: item.productId,
                          basePrice: item.price,
                        });

                        const isDiscounted = unitPrice < item.price;

                        return (
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-gray-900">
                              ₱{unitPrice}.00
                            </p>
                            {isDiscounted ? (
                              <p className="text-[11px] text-gray-400 line-through">
                                ₱{item.price}.00
                              </p>
                            ) : null}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <div className="inline-flex items-center rounded-full border border-gray-200 overflow-hidden">
                        <button
                          type="button"
                          className="h-8 w-10 inline-flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            if (item.qty <= 1) {
                              requestRemoveItem(item);
                              return;
                            }
                            onUpdateQty(item.productId, item.qty - 1);
                          }}
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="min-w-10 text-center text-sm font-semibold text-gray-900">
                          {item.qty}
                        </div>
                        <button
                          type="button"
                          className="h-8 w-10 inline-flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => onUpdateQty(item.productId, item.qty + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₱{subtotal}.00</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Delivery fee</span>
                  <span className="font-semibold">₱{effectiveDeliveryFee}.00</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t px-5 py-4 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Total</p>
            <p className="text-lg font-extrabold text-gray-900">
              ₱{items.length > 0 ? total : 0}.00
            </p>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={goToCheckout}
            className="mt-4 w-full h-12 rounded-full bg-[#3c5e45] text-white font-semibold hover:bg-[#2d4a35] transition-colors cursor-pointer disabled:opacity-50"
          >
            Go To Checkout
          </button>
        </div>
      </div>

      {orderDetailsOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"
          onClick={cancelOrderDetails}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <p className="text-xl font-bold text-gray-900">Order details</p>
              <button
                type="button"
                onClick={cancelOrderDetails}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm font-semibold text-gray-900">Select order type</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDraftOrderType('Delivery')}
                  className={
                    'h-12 rounded-xl border px-4 inline-flex items-center justify-center gap-2 font-semibold cursor-pointer ' +
                    (draftOrderType === 'Delivery'
                      ? 'bg-[#3c5e45] text-white'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50')
                  }
                >
                  <Bike className="h-5 w-5" />
                  Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setDraftOrderType('Pick-up')}
                  className={
                    'h-12 rounded-xl border px-4 inline-flex items-center justify-center gap-2 font-semibold cursor-pointer ' +
                    (draftOrderType === 'Pick-up'
                      ? 'bg-[#3c5e45] text-white'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50')
                  }
                >
                  <ShoppingBag className="h-5 w-5" />
                  Pick-up
                </button>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setDraftOrderType('Reservation')}
                  className={
                    'h-12 w-full rounded-xl border px-4 inline-flex items-center justify-center gap-2 font-semibold cursor-pointer ' +
                    (draftOrderType === 'Reservation'
                      ? 'bg-[#3c5e45] text-white'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50')
                  }
                >
                  <CalendarClock className="h-5 w-5" />
                  Reservation
                </button>
              </div>

              {draftOrderType === 'Reservation' ? (
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Schedule</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <input
                        type="date"
                        value={draftReservationDate}
                        onChange={e => setDraftReservationDate(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-900"
                      />
                      <input
                        type="time"
                        value={draftReservationTime}
                        onChange={e => setDraftReservationTime(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">Number of Guests</p>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={draftReservationGuests}
                        onChange={e =>
                          setDraftReservationGuests(
                            Number.isFinite(Number(e.target.value))
                              ? Number(e.target.value)
                              : 1
                          )
                        }
                        className="h-10 w-28 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-900"
                      />
                      <p className="text-sm text-gray-500">guest(s)</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t">
              <button
                type="button"
                onClick={cancelOrderDetails}
                className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmOrderDetails}
                className="h-10 rounded-xl bg-[#c30010] px-4 text-sm font-semibold text-white hover:bg-[#a6000d] transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {removeTarget !== null ? (
        <div
          className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"
          onClick={() => setRemoveTarget(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-lg font-bold text-gray-900">Remove item</p>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to remove <span className="font-semibold">{removeTarget.name}</span> from your cart?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRemoveTarget(null)}
                className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveItem}
                className="h-10 rounded-xl bg-[#c30010] px-4 text-sm font-semibold text-white hover:bg-[#a6000d] transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
