import Link from "next/link";
import Image from "next/image";

export default function Navigation({ searchParams }) {
  const query = searchParams?.q || "";
  const categoryId = searchParams?.category || "";
  const location = searchParams?.location || "";

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            <Image
              src="/bazio.svg"
              alt="Bazio"
              width={130}
              height={40}
            />
          </span>
        </Link>

        {/* Search Box */}
        <div className="flex-1 max-w-2xl mx-8">
          <form action="/" method="GET" className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <select 
              name="category"
              defaultValue={categoryId}
              className="bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 rounded-l-lg transition"
            >
              <option value="">All Categories</option>
              <option value="1">Elektronika</option>
              <option value="2">Auto</option>
              <option value="3">Reality</option>
              <option value="4">Oblečenie</option>
            </select>
            
            <select 
              name="location"
              defaultValue={location}
              className="bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
            >
              <option value="">All Locations</option>
              <option value="Bratislava">Bratislava</option>
              <option value="Košice">Košice</option>
              <option value="Banská Bystrica">Banská Bystrica</option>
              <option value="Žilina">Žilina</option>
              <option value="Nitra">Nitra</option>
            </select>

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
          <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Profile
          </Link>
          <Link
            href="/mylistings"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + New Listing
          </Link>
        </div>
      </div>
    </nav>
  );
}
