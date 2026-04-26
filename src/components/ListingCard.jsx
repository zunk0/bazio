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