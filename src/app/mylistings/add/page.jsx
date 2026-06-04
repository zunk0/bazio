import { getSession } from '../../../../library/auth';
import { createConnection, getCategories } from '../../../../library/db';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import DbError from '@/components/DbError';
import AddListingForm from './AddListingForm';
import './addlisting.css';

export default async function AddListingPage() {
  const session = await getSession();
  if (!session) redirect('/login?callbackUrl=/mylistings/add');

  let userLocation = null;
  let categories = [];
  try {
    const db = await createConnection();
    const [rows] = await db.execute('SELECT location FROM users WHERE id = ?', [session.userId]);
    if (rows.length > 0) {
      userLocation = rows[0].location || null;
    }
    categories = await getCategories();
  } catch (e) {
    console.error('Error fetching user location:', e);
    return (
      <div className="add-listing-page">
        <Navigation isLoggedIn={false} categories={categories} />
        <DbError />
        <Footer />
      </div>
    );
  }

  return (
    <div className="add-listing-page">
      <Navigation isLoggedIn={true} categories={categories} />
      
      <main className="add-listing-container">
        <Link href="/mylistings" className="add-listing-back">
          ← Back to My Listings
        </Link>

        <h1>Create New Listing</h1>
        <p className="add-listing-subtitle">
          Fill in the details below to publish your listing on Bazio.
        </p>

        <AddListingForm userLocation={userLocation} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
