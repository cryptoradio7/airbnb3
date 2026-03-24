'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    location: string;
    city: string;
    country: string;
    price: number;
    images: string;
  };
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des réservations');
      }
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Réservation annulée avec succès');
        fetchBookings(); // Rafraîchir la liste
      } else {
        alert(`Erreur: ${data.error || 'Échec de l\'annulation'}`);
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Une erreur est survenue lors de l\'annulation');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'cancelled':
        return 'Annulée';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes réservations</h1>
          <p className="text-gray-600 mt-2">
            Gérez toutes vos réservations passées et à venir
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Réservations actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">À venir</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => {
                    const checkIn = new Date(b.checkIn);
                    const today = new Date();
                    return b.status === 'confirmed' && checkIn > today;
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dépensé au total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune réservation
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore effectué de réservation
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Explorer les logements
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => {
                const checkInDate = new Date(booking.checkIn);
                const checkOutDate = new Date(booking.checkOut);
                const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
                const isUpcoming = checkInDate > new Date();
                const canCancel = booking.status === 'confirmed' && isUpcoming;

                return (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Informations de base */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Image */}
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden">
                              {booking.listing.images ? (
                                <img 
                                  src={booking.listing.images.split(',')[0]} 
                                  alt={booking.listing.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <MapPin className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Détails */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{getStatusText(booking.status)}</span>
                              </span>
                              {isUpcoming && booking.status === 'confirmed' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  À venir
                                </span>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {booking.listing.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.listing.location}, {booking.listing.city}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{booking.guests} voyageur{booking.guests > 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions et prix */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${booking.totalPrice}
                          </p>
                          <p className="text-sm text-gray-500">
                            {nights} nuit{nights > 1 ? 's' : ''} • ${booking.listing.price}/nuit
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            href={`/bookings/${booking.id}/confirmation`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Détails
                          </Link>
                          
                          {canCancel && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Annuler
                            </button>
                          )}
                          
                          <Link
                            href={`/listings/${booking.listing.id}`}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Voir le logement
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Politique d'annulation
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Annulation gratuite jusqu'à 48h avant l'arrivée</li>
            <li>• Après ce délai, le montant total est non remboursable</li>
            <li>• Les réservations annulées apparaissent dans votre historique</li>
            <li>• Contactez-nous pour toute question concernant votre réservation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}