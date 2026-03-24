import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import ImageGallery from '../../../../components/ImageGallery';
import AmenitiesList from '../../../../components/AmenitiesList';
import ReviewsList from '../../../../components/ReviewsList';
import BookingWidget from '../../../../components/BookingWidget';
import HostInfo from '../../../../components/HostInfo';
import { MapPin, Users, Bed, Bath, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getListing(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!listing) return null;

  // Parse JSON fields
  return {
    ...listing,
    images: JSON.parse(listing.images || '[]'),
    amenities: JSON.parse(listing.amenities || '[]'),
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Calculate average rating
  const averageRating = listing.reviews.length > 0
    ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span>({listing.reviews.length} avis)</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}, {listing.city}, {listing.country}</span>
          </div>
        </div>
      </div>

      {/* Main content - 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image gallery */}
          <ImageGallery images={listing.images} title={listing.title} />

          {/* Listing details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{listing.maxGuests} voyageurs</div>
            </div>
            <div className="text-center">
              <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{listing.bedrooms} chambre{listing.bedrooms > 1 ? 's' : ''}</div>
            </div>
            <div className="text-center">
              <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{listing.beds} lit{listing.beds > 1 ? 's' : ''}</div>
            </div>
            <div className="text-center">
              <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold">{listing.bathrooms} salle{listing.bathrooms > 1 ? 's' : ''} de bain</div>
            </div>
          </div>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Équipements</h2>
            <AmenitiesList amenities={listing.amenities} />
          </section>

          {/* Calendar placeholder */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Disponibilités</h2>
            <div className="border rounded-xl p-6 text-center">
              <div className="text-gray-500 mb-2">Calendrier des disponibilités</div>
              <div className="text-sm text-gray-400">
                Pour le MVP, les dates sont disponibles par défaut. 
                Une intégration complète du calendrier sera ajoutée dans une version ultérieure.
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Avis ({listing.reviews.length})
              </h2>
              <a
                href={`/listings/${listing.id}/review`}
                className="text-sm font-medium text-[#FF385C] hover:underline"
              >
                Laisser un avis
              </a>
            </div>
            <ReviewsList 
              reviews={listing.reviews}
              averageRating={averageRating}
              totalReviews={listing.reviews.length}
            />
          </section>

          {/* Host info */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Votre hôte</h2>
            <HostInfo host={listing.host} />
          </section>
        </div>

        {/* Right column - Booking widget */}
        <div className="lg:col-span-1">
          <BookingWidget price={listing.price} listingId={listing.id} />
        </div>
      </div>
    </div>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const listings = await prisma.listing.findMany({
    select: { id: true },
  });

  return listings.map((listing) => ({
    id: listing.id,
  }));
}