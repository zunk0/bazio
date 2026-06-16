import { getSession } from '../../../../../library/auth';
import { createConnection, getCategories } from '../../../../../library/db';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EditListingForm from './EditListingForm';
import DbError from '@/components/DbError';

export default async function EditListing({ params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    redirect(`/login?callbackUrl=/mylistings/edit/${id}`);
  }

  let listing = null;
  let categories = [];

  let shouldRedirect = false;

  try {
    const db = await createConnection();
    const [rows] = await db.execute(
      `SELECT listings.*,
        (SELECT url FROM listing_images WHERE listing_id = listings.id LIMIT 1) AS image_url
       FROM listings 
       WHERE id = ? AND user_id = ?`,
      [id, session.userId]
    );

    if (rows.length === 0) {
      shouldRedirect = true;
    } else {
      listing = rows[0];
      categories = await getCategories();
    }
  } catch (err) {
    console.error('Error fetching listing for edit:', err);
    return (
      <div className="add-listing-page">
        <Navigation isLoggedIn={false} categories={categories} />
        <DbError />
        <Footer />
      </div>
    );
  }

  if (shouldRedirect) {
    redirect('/mylistings');
  }

  return (
    <div className="add-listing-page">
      <Navigation isLoggedIn={true} categories={categories} />

      <main className="add-listing-container">
        <a href="/mylistings" className="add-listing-back">
          ← Back to My Listings
        </a>

        <h1>Edit Listing</h1>
        <p className="add-listing-subtitle">
          Update the details of your listing.
        </p>

        <EditListingForm listing={listing} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
