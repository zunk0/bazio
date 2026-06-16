import Navigation from "@/components/Navigation";
import ListingsGrid from "@/components/ListingsGrid";
import Footer from "@/components/Footer";
import { getSession } from "@/../library/auth";
import { getCategories } from "@/../library/db";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const session = await getSession();
  const categories = await getCategories();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation searchParams={params} isLoggedIn={!!session} categories={categories} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Listings Grid */}
        <ListingsGrid searchParams={params} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}