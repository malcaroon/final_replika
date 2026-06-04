import {useRef, useState} from 'react';

const mockPromos = [
  {
    id: '1',
    title: 'Family Feast Bundle',
    description: 'Whole lechon + 3 sides + 1.5L drink. Perfect for family gatherings! Save 20% when you bundle.',
    imageUrl: 'https://res.cloudinary.com/darzhuvon/image/upload/v1780465047/promos/kmenh0njcznaqaq6m7bt.jpg',
    startDate: '2025-01-01',
  },
  {
    id: '2',
    title: 'Weekend Lechon Special',
    description: 'Buy 1 whole lechon, get half-lechon at 50% off. Available every Saturday and Sunday.',
    imageUrl: 'src/assets/Highlight3.png',
    startDate: '2025-06-01',
  },
  {
    id: '3',
    title: 'Group Deals',
    description: 'Book for 10+ guests and enjoy a free lechon belly plus unlimited rice.',
    imageUrl: 'src/assets/Highlight3.png',
    startDate: '2025-07-01',
  },
  {
    id: '4',
    title: 'Early Bird Promo',
    description: 'Order at least 3 days in advance and get 10% off your total bill.',
    imageUrl: 'src/assets/Highlight3.png',
    startDate: '2025-12-01',
  },
];

function PromoCardImage({promo}) {
  const [loaded, setLoaded] = useState(!promo.imageUrl);
  const isUpcoming = new Date(promo.startDate) > new Date();

  return (
    <div className="relative h-64 bg-gray-100">
      {promo.imageUrl ? (
        <img
          src={promo.imageUrl}
          alt={promo.title}
          className="w-full h-full object-cover"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      {!loaded ? (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      ) : null}

      {isUpcoming ? (
        <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm">
          UPCOMING
        </div>
      ) : (
        <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
          LIMITED OFFER
        </div>
      )}
    </div>
  );
}

function PromoCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border overflow-hidden shrink-0 w-95">
      <div className="h-64 bg-gray-100 animate-pulse" />
      <div className="p-6 flex flex-col h-60">
        <div className="h-6 w-2/3 bg-gray-100 animate-pulse rounded" />
        <div className="mt-3 h-4 w-full bg-gray-100 animate-pulse rounded" />
        <div className="mt-2 h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
        <div className="mt-auto h-12 w-full bg-gray-100 animate-pulse rounded" />
      </div>
    </div>
  );
}

export default function Promo() {
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [promos] = useState(mockPromos);

  const onMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };
  const onMouseUp = () => {
    isDown.current = false;
  };
  const onMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onOrderClick = () => {};

  const hasNoPromos = promos.length === 0;

  return (
    <section
      id="promo"
      className="min-h-screen flex items-center py-20 px-4 bg-[#fbd897]"
    >
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-4 text-[#3c5e45]">Special Deals</h2>
          <p className="text-xl text-[#3c5e45]">
            Check out our latest promos and save on your favorite lechon!
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {hasNoPromos ? (
            <div className="flex w-full justify-center pb-8">
              <p className="text-[#3c5e45] text-lg">No promos available at the moment.</p>
            </div>
          ) : null}

          {!hasNoPromos ? (
            <div className="overflow-x-auto pb-8 scrollbar-hide">
              <div
                ref={scrollRef}
                className="overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
              >
                <div className="flex gap-6 w-max">
                  {promos.map((promo) => (
                    <div
                      key={promo.id}
                      className="relative bg-white rounded-3xl border-white overflow-hidden shrink-0 w-95"
                    >
                      <PromoCardImage promo={promo} />
                      <div className="p-6 flex flex-col h-60">
                        <h3 className="text-xl font-bold mb-2 text-[#3c5e45]">
                          {promo.title}
                        </h3>
                        {promo.description ? (
                          <p className="text-base mb-4 grow text-[#a4bbab]">
                            {promo.description}
                          </p>
                        ) : null}
                        <button
                          onClick={onOrderClick}
                          className="w-full py-3 mt-auto bg-[#3c5e45] text-white rounded-xl font-semibold cursor-pointer hover:bg-[#2d4a35] transition-colors"
                        >
                          Claim This Offer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {!hasNoPromos ? (
            <div className="text-center mt-4">
              <p className="text-sm text-[#3c5e45]">
                ← Scroll to see more offers →
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
