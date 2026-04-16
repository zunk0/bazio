import ListingCard from "./ListingCard";

export default function ListingsGrid({ listings }) {
  // Mock data if no listings provided
  const mockListings = [
    {
      id: 1,
      title: "Vintage Bicycle",
      location: "Bratislava",
      category: "Sports",
      price: 45,
      image: "https://via.placeholder.com/400?text=Bicycle",
    },
    {
      id: 2,
      title: "Programming Books",
      location: "Košice",
      category: "Books",
      price: 0,
      image: "https://via.placeholder.com/400?text=Books",
    },
    {
      id: 3,
      title: "Wooden Desk",
      location: "Banská Bystrica",
      category: "Furniture",
      price: 120,
      image: "https://via.placeholder.com/400?text=Desk",
    },
    {
      id: 4,
      title: "Running Shoes",
      location: "Žilina",
      category: "Clothing",
      price: 35,
      image: "https://via.placeholder.com/400?text=Shoes",
    },
    {
      id: 5,
      title: "Laptop Stand",
      location: "Nitra",
      category: "Electronics",
      price: 25,
      image: "https://via.placeholder.com/400?text=Laptop+Stand",
    },
    {
      id: 6,
      title: "Coffee Maker",
      location: "Bratislava",
      category: "Electronics",
      price: 50,
      image: "https://via.placeholder.com/400?text=Coffee+Maker",
    },
  ];

  const displayListings = listings || mockListings;

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Recent Listings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}
