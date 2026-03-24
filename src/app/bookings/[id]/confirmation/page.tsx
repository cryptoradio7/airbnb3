import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { CheckCircle, Calendar, Users, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface ConfirmationPageProps {
  params: {
    id: string;
  };
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect('/login');
  }

  // Récupérer la réservation
  const booking = await prisma.booking.findUnique({
    where: {
      id: params.id,
      userId: user.id
    },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          city: true,
          country: true,
          price: true,
          images: true,
          amenities: true,
          maxGuests: true,
          bedrooms: true,
          beds: true,
          bathrooms: true,
          host: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!booking) {
    redirect('/dashboard/bookings');
  }

  // Calculer le nombre de nuits
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Formater les dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculer la répartition des prix
  const subtotal = booking.listing.price * nights;
  const cleaningFee = 50;
  const serviceFee = Math.round(subtotal * 0.1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de confirmation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-gray-600">
            Votre séjour chez {booking.listing.host.name} est confirmé. 
            Un email de confirmation a été envoyé à {session.user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Détails du séjour */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte du logement */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Votre séjour
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image du logement */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-xl bg-gray-200 overflow-hidden">
                    {booking.listing.images ? (
                      <img 
                        src={booking.listing.images.split(',')[0]} 
                        alt={booking.listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Image non disponible
                      </div>
                    )}
                  </div>
                </div>

                {/* Détails du logement */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {booking.listing.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {booking.listing.description.substring(0, 150)}...
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.listing.location}, {booking.listing.city}, {booking.listing.country}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(checkIn)} → {formatDate(checkOut)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4" />
                      <span>{booking.guests} voyageur{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails de la réservation */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Détails de la réservation
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Numéro de réservation</p>
                    <p className="font-mono text-gray-900">{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmée' : 
                       booking.status === 'cancelled' ? 'Annulée' : 
                       booking.status === 'completed' ? 'Terminée' : booking.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Hôte</p>
                  <p className="text-gray-900">{booking.listing.host.name}</p>
                  <p className="text-sm text-gray-600">{booking.listing.host.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date de réservation</p>
                  <p className="text-gray-900">
                    {new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite : Récapitulatif du prix */}
          <div className="space-y-8">
            {/* Récapitulatif du prix */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Récapitulatif du prix
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ${booking.listing.price} × {nights} nuit{nights > 1 ? 's' : ''}
                  </span>
                  <span>${subtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de ménage</span>
                  <span>${cleaningFee}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de service</span>
                  <span>${serviceFee}</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${booking.totalPrice}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Paiement sécurisé</span>
                </div>
                <p className="text-xs text-gray-500">
                  Le montant total a été prélevé sur votre carte. Vous recevrez un reçu par email.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <Link
                href={`/listings/${booking.listing.id}`}
                className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Voir le logement
              </Link>
              
              <Link
                href="/dashboard/bookings"
                className="block w-full text-center border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Mes réservations
              </Link>
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => {
                    // L'annulation sera gérée via une modale ou une page dédiée
                    // Pour l'instant, rediriger vers l'API d'annulation
                    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
                      fetch(`/api/bookings/${booking.id}/cancel`, {
                        method: 'PUT'
                      }).then(response => {
                        if (response.ok) {
                          window.location.reload();
                        } else {
                          alert('Erreur lors de l\'annulation');
                        }
                      });
                    }
                  }}
                  className="block w-full text-center border border-red-300 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Annuler la réservation
                </button>
              )}
              
              <Link
                href="/"
                className="block w-full text-center text-gray-600 py-3 rounded-lg font-semibold hover:text-gray-900 transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Informations importantes
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Annulation gratuite jusqu'à 48h avant l'arrivée</li>
                <li>• Heure d'arrivée : à partir de 15h</li>
                <li>• Heure de départ : avant 11h</li>
                <li>• Contactez l'hôte pour toute question</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}