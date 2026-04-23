// import Link from "next/link";

// export default function ListingCard({ id, title, location, category, price, image }) {
//   return (
//     <Link href={`/listing/${id}`}>
//       <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer h-full">
//         {/* Image Container */}
//         <div className="aspect-square bg-gray-200 overflow-hidden">
//           {image ? (
//             <img
//               src={image}
//               alt={title}
//               className="w-full h-full object-cover hover:scale-105 transition"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
//               No Image
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
//             {title}
//           </h3>

//           <div className="flex items-center justify-between mb-3">
//             <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
//               {category}
//             </span>
//             <span className="text-sm font-semibold text-blue-600">
//               {price ? `${price}€` : "Free"}
//             </span>
//           </div>

//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             📍 {location}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }
import Link from "next/link";
import "./ListingCard.css";

export default function ListingCard({ id, title, location, category, price, image }) {
  return (
    <Link href={`/listing/${id}`}>
      <div className="card">
        {/* Image Container */}
        <div className="card-image-container">
          {image ? (
            <img
              src={image}
              alt={title}
              className="card-image"
            />
          ) : (
            <div className="card-no-image">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="card-content">
          <h3 className="card-title">
            {title}
          </h3>

          <div className="card-meta">
            <span className="card-category">
              {category}
            </span>
            <span className="card-price">
              {price ? `${price}€` : "Free"}
            </span>
          </div>

          <p className="card-location">
            📍 {location}
          </p>
        </div>
      </div>
    </Link>
  );
}