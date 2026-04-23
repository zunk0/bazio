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
    title: "Bicycle",
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
];

export default async function ListingsGrid({ listings }) {
  let rows = [];

try {
    const connection = await createConnection();

    const [result] = await connection.execute(`

      SELECT 
        listings.id,
        listings.title,
        listings.location,
        listings.price,
        categories.name AS category
      FROM listings
      JOIN categories ON listings.category_id = categories.id
      ORDER BY listings.id DESC
      LIMIT 12
    `);
    rows = result;
  } catch (error) {
    console.error("DB error, using mock data:");
    rows = mockListings;
  }

  const displayListings = listings || rows;

  return (
    <section className="listings-section">
      <div className="listings-container">
        <h2 className="listings-title">Recent Listings</h2>

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

        <div className="listings-load-more">
          <button className="load-more-btn">Load More</button>
        </div>
      </div>
    </section>
  );
}