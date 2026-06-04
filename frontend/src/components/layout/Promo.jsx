export default function Promo() {
  return (
    <section
      id="promo"
      className="py-20 px-4 bg-[#3c5e45]"
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Special Offer
        </h2>
        <p className="text-xl text-white/80 mb-4">
          Book your lechon now and enjoy <strong className="text-[#fbd897]">10% OFF</strong> on your first order!
        </p>
        <p className="text-white/60 mb-8">
          Minimum of 3 days advance booking required. Offer valid for walk-in and online orders.
        </p>
        <a
          href="#contact"
          className="inline-block bg-[#fbd897] text-[#3c5e45] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#f5cc7a] transition-colors"
        >
          Claim Your Discount
        </a>
      </div>
    </section>
  );
}
