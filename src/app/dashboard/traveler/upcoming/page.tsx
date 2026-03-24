'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Filter, CalendarDays } from 'lucide-react';
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

export default function UpcomingBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchUpcomingBookings();
    }
  }, [status, router]);

  const fetchUpcomingBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/traveler?upcoming=true');
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

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const getUpcomingCount = () => {
    return bookings.filter(b => new Date(b.checkIn) >= new Date()).length;
  };

  const getTotalSpent = () => {
    return bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
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
                Réservations à venir
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez vos prochains voyages et séjours
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-gray-700">
              <CalendarDays className="w-5 h-5" />
              <span className="font-medium">{getUpcomingCount()} voyages à venir</span>
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
                  <div className="text-gray-600">Réservations totales</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {getUpcomingCount()}
                  </div>
                  <div className="text-gray-600">À venir</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="pending">En attente</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Vos réservations ({filteredBookings.length})
            </h2>
            <div className="text-sm text-gray-600">
              Triées par date d'arrivée
            </div>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <TravelerBookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune réservation à venir
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Aucune réservation ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas de réservations à venir. Commencez à planifier votre prochain voyage !'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
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

        {/* Conseils */}
        {bookings.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Conseils pour vos voyages à venir
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Contactez vos hôtes 48h avant votre arrivée pour confirmer les détails
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Vérifiez les politiques d'annulation de chaque réservation
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Téléchargez l'application Airbnb pour un accès facile à vos réservations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}