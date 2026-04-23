import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">Bazio</span>
        </Link>

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
