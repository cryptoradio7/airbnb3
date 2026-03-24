'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import TravelerBookingCard from '@/components/TravelerBookingCard';

interface Booking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  listing: {
    id: string;
    title: string;
    location: string;
    city: string;
    country: string;
    images: string;
    price: number;
  };
}

interface BookingRaw {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  listing: {
    id: string;
    title: string;
    location: string;
    city: string;
    country: string;
    images: string;
    price: number;
  };
}

function normalizeBooking(raw: BookingRaw): Booking {
  return {
    ...raw,
    checkIn: new Date(raw.checkIn),
    checkOut: new Date(raw.checkOut),
    status: (raw.status as 'confirmed' | 'cancelled' | 'pending') || 'confirmed',
  };
}

export default function PastBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchPastBookings();
    }
  }, [status, router]);

  const fetchPastBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/traveler?past=true');
      if (response.ok) {
        const data = await response.json();
        const normalized: Booking[] = (data.bookings as BookingRaw[]).map(normalizeBooking);
        setBookings(normalized);
        setFilteredBookings(normalized);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = bookings;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.listing.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par année
    if (yearFilter !== 'all') {
      filtered = filtered.filter((booking) => {
        const checkInYear = new Date(booking.checkIn).getFullYear().toString();
        return checkInYear === yearFilter;
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, yearFilter, bookings]);

  const getYears = () => {
    const years = new Set<string>();
    bookings.forEach((booking) => {
      const year = new Date(booking.checkIn).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  };

  const getTotalSpent = () => {
    return bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  };

  const getAverageRating = () => {
    // Pour l'instant, retourner une valeur fixe
    // Plus tard, on pourra récupérer les vraies notes
    return 4.8;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Voyages passés
              </h1>
              <p className="text-gray-600 mt-2">
                Revivez vos expériences et laissez des avis
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-gray-700">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-medium">{bookings.length} voyages</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                <span className="font-medium">{getAverageRating()}/5</span>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {bookings.length}
                  </div>
                  <div className="text-gray-600">Voyages complétés</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {getAverageRating()}/5
                  </div>
                  <div className="text-gray-600">Note moyenne</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {getTotalSpent().toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-gray-600">Total dépensé</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par destination, ville ou titre..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="all">Toutes les années</option>
                  {getYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des voyages passés */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Vos voyages passés ({filteredBookings.length})
            </h2>
            <div className="text-sm text-gray-600">
              Triées par date de départ (plus récent)
            </div>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="relative">
                  <TravelerBookingCard
                    booking={booking}
                    showActions={false}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => {
                        router.push(`/listings/${booking.listing.id}/review?bookingId=${booking.id}`);
                      }}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Noter
                    </button>
                    <button
                      onClick={() => {
                        // Fonctionnalité pour réserver à nouveau
                        router.push(`/listings/${booking.listing.id}`);
                      }}
                      className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
                    >
                      Réserver à nouveau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun voyage passé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || yearFilter !== 'all'
                  ? 'Aucun voyage ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore effectué de voyage. Commencez à planifier votre première aventure !'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setYearFilter('all');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
                <button
                  onClick={() => router.push('/listings')}
                  className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
                >
                  Rechercher un logement
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Carte des destinations visitées */}
        {bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Vos destinations visitées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from(
                new Set(bookings.map((b) => `${b.listing.city}, ${b.listing.country}`))
              )
                .slice(0, 4)
                .map((destination, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-900">
                        {destination}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {bookings.filter(
                        (b) =>
                          `${b.listing.city}, ${b.listing.country}` ===
                          destination
                      ).length}{' '}
                      {bookings.filter(
                        (b) =>
                          `${b.listing.city}, ${b.listing.country}` ===
                          destination
                      ).length > 1
                        ? 'visites'
                        : 'visite'}
                    </div>
                  </div>
                ))}
            </div>
            {Array.from(
              new Set(bookings.map((b) => `${b.listing.city}, ${b.listing.country}`))
            ).length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    // Fonctionnalité pour voir toutes les destinations
                    alert('Fonctionnalité à implémenter');
                  }}
                  className="text-[#FF385C] font-medium hover:underline"
                >
                  Voir toutes les destinations ({Array.from(new Set(bookings.map((b) => `${b.listing.city}, ${b.listing.country}`))).length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}