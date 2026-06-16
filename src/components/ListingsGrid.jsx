import Link from "next/link";
import ListingCard from "./ListingCard";
import { createConnection } from "../../library/db";
import { formatImageUrl } from "../../library/utils";
import "./ListingsGrid.css";

import DbError from "./DbError";
export default async function ListingsGrid({ listings, searchParams }) {
  let rows = [];
  let userName = "";
  const query = searchParams?.q || "";
  const categoryId = searchParams?.category || "";
  const location = searchParams?.location || "";
  const userId = searchParams?.user_id || "";

  const price = searchParams?.price || "";
  const limitParam = parseInt(searchParams?.limit) || 12;

  try {
    const connection = await createConnection();

    if (userId) {
      const [userResult] = await connection.execute("SELECT full_name FROM users WHERE id = ?", [userId]);
      if (userResult.length > 0) {
        userName = userResult[0].full_name;
      }
    }

    let sql = `
      SELECT 
        listings.id,
        listings.title,
        listings.location,
        listings.price,
        categories.name AS category,
        (SELECT url FROM listing_images WHERE listing_id = listings.id LIMIT 1) AS image_url
      FROM listings
      LEFT JOIN categories ON listings.category_id = categories.id
      WHERE 1=1 AND listings.status = 1
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

    if (price) {
      sql += " AND listings.price <= ?";
      params.push(price);
    }

    if (userId) {
      sql += " AND listings.user_id = ?";
      params.push(userId);
    }

    sql += ` ORDER BY listings.id DESC LIMIT ${limitParam}`;

    const [result] = await connection.execute(sql, params);
    rows = result;
  } catch (error) {
    console.error("DB error or no connection:", error);
    return <DbError />;
  }

  const displayListings = listings || rows;
  const searchTitle = query ? `Results for ${query}` : (userId ? `Results for user ${userName || userId}` : (categoryId || location ? "Filtered Listings" : "Recent Listings"));

  const currentParams = new URLSearchParams();
  if (query) currentParams.set("q", query);
  if (categoryId) currentParams.set("category", categoryId);
  if (location) currentParams.set("location", location);
  if (price) currentParams.set("price", price);
  if (userId) currentParams.set("user_id", userId);
  currentParams.set("limit", limitParam + 12);

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
                category={listing.category ?? "None"}
                price={listing.price}
                image={formatImageUrl(listing.image_url)}
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
            <Link href="/" className="mt-6 inline-block text-blue-600 font-medium hover:underline">Clear all filters</Link>
          </div>
        )}

        {displayListings.length >= limitParam && (
          <div className="listings-load-more">
            <Link href={`?${currentParams.toString()}`} scroll={false} className="load-more-btn block text-center" style={{textDecoration: 'none'}}>
              Load More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}