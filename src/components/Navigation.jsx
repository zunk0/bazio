'use client'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { logout } from "../../library/actions";

export default function Navigation({ searchParams, isLoggedIn, categories = [] }) {
  const router = useRouter();
  const query = searchParams?.q || "";
  const categoryId = searchParams?.category || "";
  const location = searchParams?.location || "";
  const price = searchParams?.price || "";

  // Image
  const image = {width: 130, height: 40};

  // Input
  const [value, setValue] = useState(price || "");

  useEffect(() => {
    setValue(price || "");
  }, [price]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    
    if (formData.get("q")) params.set("q", formData.get("q"));
    if (formData.get("category")) params.set("category", formData.get("category"));
    if (formData.get("location")) params.set("location", formData.get("location"));
    if (formData.get("price")) params.set("price", formData.get("price"));

    router.push(`/?${params.toString()}`);
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1700px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            <Image
              src="/bazio.svg"
              alt="Bazio"
              width={130}
              height={40}
              style={image}
            />
          </span>
        </Link>

        {/* Search Box */}
        <div className="flex-1 max-w-3xl mx-8">
          <form key={`${query}-${categoryId}-${location}`} onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <select 
              name="category"
              defaultValue={categoryId}
              className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <select 
              name="location"
              defaultValue={location}
              className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
            >
              <option value="">All Locations</option>
              <option value="Bratislavský kraj">Bratislavský kraj</option>
              <option value="Bratislava">Bratislava</option>
              <option value="Trnavský kraj">Trnavský kraj</option>
              <option value="Trnava">Trnava</option>
              <option value="Trenčiansky kraj">Trenčiansky kraj</option>
              <option value="Trenčín">Trenčín</option>
              <option value="Nitriansky kraj">Nitriansky kraj</option>
              <option value="Nitra">Nitra</option>
              <option value="Žilinský kraj">Žilinský kraj</option>
              <option value="Žilina">Žilina</option>
              <option value="Banskobystrický kraj">Banskobystrický kraj</option>
              <option value="Banská Bystrica">Banská Bystrica</option>
              <option value="Prešovský kraj">Prešovský kraj</option>
              <option value="Prešov">Prešov</option>
              <option value="Košický kraj">Košický kraj</option>
              <option value="Košice">Košice</option>
            </select>

            <input
              name="price"
              value={value}
              className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
              placeholder="Price €"
              onChange={(e) => setValue(e.target.value)}
              onClick={() => setValue("")}
              >
            </input>

            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search listings..."
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-gray-700"
            />
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
          </form>
        </div>



        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Browse
          </Link>
          <div className="relative group">
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium py-2">
              Profile
            </Link>
            {isLoggedIn && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                <form action={logout}>
                  <button type="submit" className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-md cursor-pointer font-medium">
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
          <Link
            href="/mylistings"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            My Listings
          </Link>
        </div>
      </div>
    </nav>
  );
}