import { getSession } from '../../../library/auth';
import { redirect } from 'next/navigation';
import { createConnection } from '../../../library/db';
import { formatImageUrl } from '../../../library/utils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import DbError from '@/components/DbError';
import ListingImage from '@/components/ListingImage';
import './mylistings.css';

async function MyListings() {
  const session = await getSession();
  if (!session) {
    redirect('/login?callbackUrl=/mylistings');
  }

  let listings = [];
  let error = null;

  try {
    const db = await createConnection();
    const [rows] = await db.execute(
      `SELECT 
        listings.*,
        categories.name AS category_name,
        listing_images.url AS image_url
      FROM listings 
      LEFT JOIN categories ON listings.category_id = categories.id
      LEFT JOIN listing_images ON listing_images.listing_id = listings.id
      WHERE listings.user_id = ?
      ORDER BY listings.created_at DESC`,
      [session.userId]
    );
    listings = rows;
  } catch (err) {
    console.error('Error fetching user listings:', err);
    return (
      <div className="mylistings-page">
        <Navigation isLoggedIn={false} />
        <DbError />
        <Footer />
      </div>
    );
  }

  return (
    <div className="mylistings-page">
      <Navigation isLoggedIn={true} />

      <main className="mylistings-container">
        {/* Header */}
        <div className="mylistings-header">
          <h1>
            My Listings
            <span className="mylistings-count">
              ({listings.length} {listings.length === 1 ? 'listing' : 'listings'})
            </span>
          </h1>
        </div>

        {/* Grid */}
        <div className="mylistings-grid">
          {/* Add New Listing Card */}
          <Link href="/mylistings/add" className="add-listing-card" id="add-listing-btn">
            <div className="add-listing-icon">+</div>
            <span className="add-listing-text">Add New Listing</span>
          </Link>

          {/* User's Listings */}
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="my-listing-card-wrapper">
                <span className={`my-listing-status ${listing.status === 0 ? 'inactive' : ''}`}>
                  {listing.status === 0 ? 'Inactive' : 'Active'}
                </span>
                <Link href={`/listing/${listing.id}?from=mylistings`} className="my-listing-card">
                  <div className="my-listing-image">
                    <ListingImage
                      src={formatImageUrl(listing.image_url)}
                      alt={listing.title}
                      imgClassName=""
                      noImageClassName="my-listing-no-image"
                    />
                  </div>
                  <div className="my-listing-body">
                    <h3 className="my-listing-title">{listing.title}</h3>
                    <div className="my-listing-meta">
                      <span className="my-listing-category">
                        {listing.category_name || 'Uncategorized'}
                      </span>
                      <span className="my-listing-price">
                        {listing.price ? `${listing.price}€` : 'Free'}
                      </span>
                    </div>
                    <div className="my-listing-footer">
                      <span className="my-listing-location">
                        📍 {listing.location || 'N/A'}
                      </span>
                      <span className="my-listing-views">
                        👁 {listing.views || 0} views
                      </span>
                    </div>
                    <div className="my-listing-date">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="mylistings-empty">
              <div className="mylistings-empty-icon">📦</div>
              <h2>No listings yet</h2>
              <p>Start selling by creating your first listing. Click the + button to get started!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MyListings;