import Image from "next/image";
import { Star, MapPin, Users, Bed, Bath } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    city: string;
    country: string;
    images: string; // JSON string
    amenities: string; // JSON string
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    host: {
      name: string;
    };
    reviews: Array<{
      rating: number;
    }>;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const images = JSON.parse(listing.images || "[]") as string[];
  const amenities = JSON.parse(listing.amenities || "[]") as string[];
  
  const averageRating = listing.reviews.length > 0
    ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
    : 0;

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
        {images[0] ? (
          <Image
            src={images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-[#FF385C]" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{listing.city}, {listing.country}</span>
        </div>
        
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{listing.maxGuests} voyageurs</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{listing.bedrooms} chambre{listing.bedrooms > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{listing.bathrooms} salle{listing.bathrooms > 1 ? "s" : ""} de bain</span>
          </div>
        </div>
        
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3">
          <div>
            <span className="font-bold text-gray-900">{listing.price}€</span>
            <span className="text-gray-600"> / nuit</span>
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
}