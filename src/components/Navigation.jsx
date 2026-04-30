'use client'
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

export default function Navigation({ searchParams }) {
  const query = searchParams?.q || "";
  const categoryId = searchParams?.category || "";
  const location = searchParams?.location || "";
  const price = searchParams?.price || "";

  // Image
  const image = {width: 130, height: 40};

  // Input
  const [value, setValue] = useState(price || "");

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
          <form action="/" method="GET" className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <select 
              name="category"
              defaultValue={categoryId}
              className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition"
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
              className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
            >
              <option value="">All Locations</option>
              <option value="Bratislava">Bratislava</option>
              <option value="Košice">Košice</option>
              <option value="Banská Bystrica">Banská Bystrica</option>
              <option value="Žilina">Žilina</option>
              <option value="Nitra">Nitra</option>
            </select>
            
            {/* <select
              name="price"
              defaultValue={price}
              className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
            >
              <option value="">All Prices</option>
              <option value={50}>Under 50€</option>
              <option value={200}>50€ - 200€</option>
              <option value={2000}>2000</option>
            </select> */}

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
          <Link href="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
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

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useRouter, usePathname } from "next/navigation";
// import { useRef, useTransition, useState, useEffect } from "react";

// export default function Navigation({ searchParams }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const formRef = useRef(null);
//   const [isPending, startTransition] = useTransition();
//   const timeoutRef = useRef(null);

//   const initialQuery = searchParams?.q || "";
//   const initialCategory = searchParams?.category || "";
//   const initialLocation = searchParams?.location || "";
//   const initialPrice = searchParams?.price || "";

//   // Controlled states
//   const [query, setQuery] = useState(initialQuery);
//   const [categoryId, setCategoryId] = useState(initialCategory);
//   const [location, setLocation] = useState(initialLocation);
//   const [price, setPrice] = useState(initialPrice);

//   // Sync state with URL if it changes externally (e.g. back button)
//   useEffect(() => {
//     setQuery(initialQuery);
//     setCategoryId(initialCategory);
//     setLocation(initialLocation);
//     setPrice(initialPrice);
//   }, [initialQuery, initialCategory, initialLocation, initialPrice]);

//   const handleSearchChange = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
    
//     timeoutRef.current = setTimeout(() => {
//       if (formRef.current) {
//         formRef.current.requestSubmit();
//       }
//     }, 300);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
//     const formData = new FormData(e.currentTarget);
//     const params = new URLSearchParams();
    
//     const qVal = formData.get("q");
//     const categoryVal = formData.get("category");
//     const locationVal = formData.get("location");
//     const priceVal = formData.get("price");

//     if (qVal) params.set("q", qVal);
//     if (categoryVal) params.set("category", categoryVal);
//     if (locationVal && locationVal !== "All Locations") params.set("location", locationVal);
//     if (priceVal && priceVal !== "All Prices") params.set("price", priceVal);

//     startTransition(() => {
//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   // Image
//   const image = {width: 130, height: 40};
//   return (
//     <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-[1700px] mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <span className="text-2xl font-bold text-blue-600">
//             <Image
//               src="/bazio.svg"
//               alt="Bazio"
//               width={130}
//               height={40}
//               style={image}
//             />
//           </span>
//         </Link>

//         {/* Search Box */}
//         <div className="flex-1 max-w-3xl mx-8">
//           <form 
//             ref={formRef}
//             onSubmit={handleFormSubmit}
//             className={`flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all ${isPending ? "opacity-70" : ""}`}
//           >
//             <select 
//               name="category"
//               value={categoryId}
//               onChange={(e) => {
//                 setCategoryId(e.target.value);
//                 handleSearchChange();
//               }}
//               className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition"
//             >
//               <option value="">All Categories</option>
//               <option value="1">Elektronika</option>
//               <option value="2">Auto</option>
//               <option value="3">Reality</option>
//               <option value="4">Oblečenie</option>
//             </select>
            
//             <select 
//               name="location"
//               value={location}
//               onChange={(e) => {
//                 setLocation(e.target.value);
//                 handleSearchChange();
//               }}
//               className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
//             >
//               <option value="">All Locations</option>
//               <option value="Bratislava">Bratislava</option>
//               <option value="Košice">Košice</option>
//               <option value="Banská Bystrica">Banská Bystrica</option>
//               <option value="Žilina">Žilina</option>
//               <option value="Nitra">Nitra</option>
//             </select>
            
//             <select
//               name="price"
//               value={price}
//               onChange={(e) => {
//                 setPrice(e.target.value);
//                 handleSearchChange();
//               }}
//               className="shrink-0 w-[120px] bg-transparent text-gray-600 text-xs font-semibold px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hidden md:block hover:bg-gray-100 transition"
//             >
//               <option value="">All Prices</option>
//               <option value="Under 50€">Under 50€</option>
//               <option value="50€ - 200€">50€ - 200€</option>
//               <option value="200€+">200€+</option>
//             </select>

//             <input
//               type="text"
//               name="q"
//               value={query}
//               onChange={(e) => {
//                 setQuery(e.target.value);
//                 handleSearchChange();
//               }}
//               placeholder="Search listings..."
//               className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-gray-700"
//               autoComplete="off"
//             />
//             <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <span>Search</span>
//             </button>
//           </form>
//         </div>

//         {/* Nav Links */}
//         <div className="flex items-center gap-6">
//           <Link href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
//             Browse
//           </Link>
//           <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium">
//             Profile
//           </Link>
//           <Link
//             href="/mylistings"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//           >
//             + New Listing
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }