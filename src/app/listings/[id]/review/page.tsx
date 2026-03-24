import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ReviewForm from '@/components/ReviewForm';
import { ArrowLeft, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}

async function getEligibleBookings(listingId: string, userId: string) {
  const now = new Date();
  return prisma.booking.findMany({
    where: {
      listingId,
      userId,
      checkOut: { lt: now },
      status: { in: ['confirmed', 'completed'] },
      // exclude already-reviewed
      reviews: { none: {} },
    },
    orderBy: { checkOut: 'desc' },
  });
}

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id: listingId } = await params;
  const { bookingId } = await searchParams;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, title: true },
  });

  if (!listing) {
    notFound();
  }

  // Get eligible (completed, not yet reviewed) bookings for this user+listing
  const eligibleBookings = await getEligibleBookings(listingId, session.user.id);

  // If specific bookingId requested, verify it's eligible
  let selectedBookingId = bookingId ?? null;
  if (selectedBookingId) {
    const eligible = eligibleBookings.find((b) => b.id === selectedBookingId);
    if (!eligible) selectedBookingId = null;
  }

  // Auto-select if only one eligible booking
  if (!selectedBookingId && eligibleBookings.length === 1) {
    selectedBookingId = eligibleBookings[0].id;
  }

  if (eligibleBookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Avis non disponible
        </h1>
        <p className="text-gray-600 mb-6">
          Vous n&apos;avez aucun séjour terminé (ou non encore noté) pour ce
          logement. Les avis ne sont disponibles qu&apos;après la fin de votre
          séjour.
        </p>
        <Link
          href={`/listings/${listingId}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF385C] text-white rounded-xl font-medium hover:bg-[#E31C5F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au logement
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/listings/${listingId}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au logement
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-[#FF385C]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-7 h-7 text-[#FF385C]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Donnez votre avis
          </h1>
          <p className="text-gray-600 mt-1">{listing.title}</p>
        </div>

        {/* Select booking when multiple eligible */}
        {!selectedBookingId && eligibleBookings.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez le séjour que vous souhaitez noter
            </label>
            <div className="space-y-2">
              {eligibleBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/listings/${listingId}/review?bookingId=${b.id}`}
                  className="block w-full text-left border border-gray-300 rounded-xl px-4 py-3 hover:border-[#FF385C] hover:bg-[#FF385C]/5 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    {new Date(b.checkIn).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    →{' '}
                    {new Date(b.checkOut).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {b.guests} voyageur{b.guests > 1 ? 's' : ''} ·{' '}
                    {b.totalPrice.toLocaleString('fr-FR')} €
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {selectedBookingId && (
          <ReviewForm
            listingId={listingId}
            bookingId={selectedBookingId}
            listingTitle={listing.title}
          />
        )}
      </div>
    </div>
  );
}
