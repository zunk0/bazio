// import ListingCard from "./ListingCard";
// import { createConnection } from "../../library/db";

// export default async function ListingsGrid({ listings }) {
//   // Mock data if no listings provided

//     const connection = await createConnection();
//     const [a] = await connection.execute("SELECT id, title FROM listings WHERE id = 5");

//   const mockListings = [
//     {
//       id: a[0].id,
//       title: a[0].title,
//       location: "Bratislava",
//       category: "Sports",
//       price: 45,
//       image: "https://via.placeholder.com/400?text=Bicycle",
//     },
//     {
//       id: 2,
//       title: "Programming Books",
//       location: "Košice",
//       category: "Books",
//       price: 0,
//       image: "https://via.placeholder.com/400?text=Books",
//     },
//     {
//       id: 3,
//       title: "Wooden Desk",
//       location: "Banská Bystrica",
//       category: "Furniture",
//       price: 120,
//       image: "https://via.placeholder.com/400?text=Desk",
//     },
//     {
//       id: 4,
//       title: "Running Shoes",
//       location: "Žilina",
//       category: "Clothing",
//       price: 35,
//       image: "https://via.placeholder.com/400?text=Shoes",
//     },
//     {
//       id: 7,
//       title: "Laptop Stand",
//       location: "Nitra",
//       category: "Electronics",
//       price: 25,
//       image: "https://via.placeholder.com/400?text=Laptop+Stand",
//     },
//     {
//       id: 6,
//       title: "Coffee Maker",
//       location: "Bratislava",
//       category: "Electronics",
//       price: 50,
//       image: "https://via.placeholder.com/400?text=Coffee+Maker",
//     },
//   ];

//   const displayListings = listings || mockListings;

//   return (
//     <section className="w-full py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold mb-8 text-gray-800">Recent Listings</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {displayListings.map((listing) => (
//             <ListingCard key={listing.id} {...listing} />
//           ))}
//         </div>

//         {/* Load More Button */}
//         <div className="flex justify-center">
//           <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
//             Load More
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

import ListingCard from "./ListingCard";
import { createConnection } from "../../library/db";
import "./ListingsGrid.css";

const mockListings = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    location: "Bratislava",
    category: "Elektronika",
    price: 500,
  },
  {
    id: 2,
    title: "Škoda Octavia",
    location: "Bratislava",
    category: "Auto",
    price: 12000,
  },
  {
    id: 3,
    title: "2-izbový byt v centre",
    location: "Košice",
    category: "Reality",
    price: 159000,
  },
  {
    id: 4,
    title: "Zimná bunda",
    location: "Žilina",
    category: "Oblečenie",
    price: 45,
  },
  {
    id: 5,
    title: "Herný notebook",
    location: "Nitra",
    category: "Elektronika",
    price: 850,
  },
  {
    id: 6,
    title: "Horský bicykel",
    location: "Banská Bystrica",
    category: "Iné",
    price: 320,
  },
];


export default async function ListingsGrid({ listings, searchParams }) {
  let rows = [];
  const query = searchParams?.q || "";
  const categoryId = searchParams?.category || "";
  const location = searchParams?.location || "";

  try {
    const connection = await createConnection();

    let sql = `
      SELECT 
        listings.id,
        listings.title,
        listings.location,
        listings.price,
        categories.name AS category
      FROM listings
      JOIN categories ON listings.category_id = categories.id
      WHERE 1=1
    `;
    const params = [];

    if (query) {
      sql += " AND (listings.title LIKE ? OR listings.content LIKE ?)";
      params.push(`%${query}%`, `%${query}%`);
    }

    if (categoryId) {
      sql += " AND listings.category_id = ?";
      params.push(categoryId);
    }

    if (location) {
      sql += " AND listings.location = ?";
      params.push(location);
    }

    sql += " ORDER BY listings.id DESC LIMIT 12";

    const [result] = await connection.execute(sql, params);
    rows = result;
  } catch (error) {
    console.log("DB error or no connection, using filtered mock data");
    
    // Map of category ID to name for mock filtering
    const categoryMap = {
      "1": "Elektronika",
      "2": "Auto",
      "3": "Reality",
      "4": "Oblečenie"
    };

    rows = mockListings.filter(item => {
      const matchesQuery = !query || item.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !categoryId || item.category === categoryMap[categoryId] || item.category === categoryId;
      const matchesLocation = !location || item.location === location;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }

  const displayListings = listings || rows;
  const searchTitle = query ? `Results for "${query}"` : (categoryId || location ? "Filtered Listings" : "Recent Listings");

  return (
    <section className="listings-section">
      <div className="listings-container">
        <h2 className="listings-title">{searchTitle}</h2>

        {displayListings.length > 0 ? (
          <div className="listings-grid">
            {displayListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                location={listing.location}
                category={listing.category}
                price={listing.price}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No listings found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            <a href="/" className="mt-6 inline-block text-blue-600 font-medium hover:underline">Clear all filters</a>
          </div>
        )}

        {displayListings.length >= 12 && (
          <div className="listings-load-more">
            <button className="load-more-btn">Load More</button>
          </div>
        )}
      </div>
    </section>
  );
}