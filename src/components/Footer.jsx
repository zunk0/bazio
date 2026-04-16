export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 mb-6">
          <a href="#" className="hover:text-white transition">
            About
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
          <a href="#" className="hover:text-white transition">
            Terms & Conditions
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; 2026 Bazio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
