import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { createConnection } from "@/../library/db";
import { getSession } from "@/../library/auth";
import { formatImageUrl } from "@/../library/utils";
import { deleteListing, toggleListingStatus } from "@/../library/actions";
import DeleteButton from "./DeleteButton";
import Link from "next/link";
import DbError from "@/components/DbError";
import ViewCounter from "./ViewCounter";
import ListingImage from "@/components/ListingImage";
import "./ListingDetail.css";

async function ListingDetail({ params, searchParams }) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const fromMyListings = resolvedSearchParams?.from === 'mylistings';
  const session = await getSession();
  let listing = null;
  let error = null;

  try {
    const connection = await createConnection();

    const [result] = await connection.execute(`
      SELECT 
        listings.*,
        categories.name AS category_name,
        users.full_name,
        users.phone,
        users.created_at AS user_created_at,
        (SELECT url FROM listing_images WHERE listing_id = listings.id LIMIT 1) AS image_url
      FROM listings 
      LEFT JOIN categories ON listings.category_id = categories.id 
      LEFT JOIN users ON listings.user_id = users.id
      WHERE listings.id = ?
    `, [id]);

    if (result && result.length > 0) {
      listing = result[0];
    }
  } catch (err) {
    console.error("Error fetching listing:", err);
    return (
      <div className="listing-detail-page">
        <Navigation isLoggedIn={!!session} />
        <DbError />
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="listing-detail-page">
        <Navigation isLoggedIn={!!session} />
        <main className="listing-detail-container flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700">Listing not found</h1>
            <p className="text-gray-500 mt-2">The listing you are looking for does not exist or has been removed.</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="listing-detail-page">
      <ViewCounter id={id} />
      <Navigation isLoggedIn={!!session} />

      <main className="listing-detail-container">
        <div className="listing-detail-grid">
          {/* Left Column: Main Details */}
          <div className="listing-main-content">
            <div className="listing-image-container">
              <ListingImage
                src={formatImageUrl(listing.image_url || listing.image)}
                alt={listing.title}
                imgClassName="listing-image"
                noImageClassName="listing-no-image"
              />
            </div>

            <div className="listing-info-section">
              <div className="listing-header">
                <span className="listing-category-badge">
                  {listing.category_name || listing.category || "Uncategorized"}
                </span>
                <h1 className="listing-title">{listing.title}</h1>
                <div className="listing-meta">
                  <div className="listing-meta-item">
                    <span>📍</span> {listing.location || "Location not specified"}
                  </div>
                  <div className="listing-meta-item">
                    <span>📅</span> Added {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                  <div className="listing-meta-item">
                    <span>👁️</span> {listing.views ?? 0} views
                  </div>
                </div>
              </div>

              <div className="listing-description-section">
                <h2 className="section-title">Description</h2>
                <div className="listing-description">
                  {listing.content || "No description provided for this listing."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="listing-sidebar">
            <div className="price-card">
              <div className="price-label">Price</div>
              <div className="price-value">
                {listing.price ? `${listing.price}€` : "Free"}
              </div>
            </div>

            <div className="seller-card">
              <h2 className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
                Seller Information
              </h2>
              <div className="seller-header">
                <div className="seller-avatar">
                  {(listing.full_name || "U")[0]}
                </div>
                <div className="seller-info">
                  <h4>{listing.full_name || "Private User"}</h4>
                  <p>Member since {listing.user_created_at ? new Date(listing.user_created_at).getFullYear() : "2024"}</p>
                </div>
              </div>
              <a href={`/?user_id=${listing.user_id}`} className="view-profile-link">
                View Seller's Other Listings
              </a>
            </div>

            {listing.phone && (
              <div className="contact-info-card">
                <h3>📞 Contact Seller</h3>
                <a href={`tel:${listing.phone}`} className="contact-phone-number">
                  {listing.phone}
                </a>
              </div>
            )}

            {session && session.userId === listing.user_id && fromMyListings && (
              <div className="admin-actions-card">
                <h2 className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>
                  Admin Actions
                </h2>
                <div className="admin-actions-list">
                  <Link href={`/mylistings/edit/${listing.id}`} className="admin-action-btn admin-edit-btn">
                    ✎ Edit Listing
                  </Link>
                  <form action={async () => {
                    "use server";
                    await toggleListingStatus(listing.id);
                  }}>
                    <button type="submit" className={`admin-action-btn ${listing.status === 0 ? 'admin-reactivate-btn' : 'admin-deactivate-btn'}`}>
                      {listing.status === 0 ? "👁 Reactivate Listing" : "🚫 Deactivate Listing"}
                    </button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await deleteListing(listing.id);
                  }}>
                    <DeleteButton id={listing.id} />
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ListingDetail;

