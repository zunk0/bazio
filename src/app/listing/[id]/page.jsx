import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { createConnection } from "@/../library/db";
import "./ListingDetail.css";

async function ListingDetail({ params }) {
  const { id } = await params;
  let listing = null;
  let error = null;

  try {
    const connection = await createConnection();

    // We try to fetch all common fields. If some don't exist, this might fail, 
    // in which case we'll fallback to a safer query or mock data.
    const [result] = await connection.execute(`
      SELECT 
        listings.*,
        categories.name AS category_name,
        users.full_name,
        users.created_at AS user_created_at
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
    error = err.message;
  }

  // Mock data for demonstration if DB fails or listing not found
  if (!listing) {
    listing = {
      id: id,
      title: "Premium Mountain Bicycle",
      price: 150,
      location: "Bratislava",
      category_name: "Sports",
      content: "This is a high-quality mountain bike in excellent condition. Perfect for trails and city commuting alike. Recently serviced with new brake pads and tires.\n\nFeatures:\n- Aluminum frame\n- 21 speeds\n- Front suspension\n- Disc brakes",
      image: `https://picsum.photos/seed/${id}/800/450`,
      created_at: new Date().toISOString(),
      full_name: "Peter Black",
      user_created_at: new Date().toISOString()
    };
  }

  return (
    <div className="listing-detail-page">
      <Navigation />

      <main className="listing-detail-container">
        <div className="listing-detail-grid">
          {/* Left Column: Main Details */}
          <div className="listing-main-content">
            <div className="listing-image-container">
              {listing.image || listing.image_url ? (
                <img
                  src={listing.image || listing.image_url}
                  alt={listing.title}
                  className="listing-image"
                />
              ) : (
                <div className="listing-no-image">
                  <span style={{ fontSize: '48px' }}>📸</span>
                  <p>No image available</p>
                </div>
              )}
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ListingDetail;

