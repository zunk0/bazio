export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Exchange Goods. No Money Needed.
        </h1>
        <p className="text-lg md:text-xl mb-8 text-blue-100">
          Join our community marketplace and start trading today
        </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            <select className="px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Furniture</option>
              <option>Clothing</option>
              <option>Sports</option>
              <option>Other</option>
            </select>

            <select className="px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>All Locations</option>
              <option>Bratislava</option>
              <option>Košice</option>
              <option>Banská Bystrica</option>
              <option>Žilina</option>
              <option>Nitra</option>
            </select>

            <select className="px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>All Prices</option>
              <option>Under 50€</option>
              <option>50€ - 200€</option>
              <option>200€+</option>
            </select>
      </div>
    </div>
  </section>
  );
}
