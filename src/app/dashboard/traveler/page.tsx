'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Home,
  Heart,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  upcomingBookings: number;
  totalSpent: number;
}

interface Booking {
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

export default function TravelerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/traveler');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentBookings(data.bookings.slice(0, 3));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Réservations à venir',
      value: stats?.upcomingBookings || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/dashboard/traveler/upcoming',
    },
    {
      title: 'Voyages passés',
      value: stats ? stats.totalBookings - stats.upcomingBookings : 0,
      icon: Home,
      color: 'bg-green-500',
      link: '/dashboard/traveler/past',
    },
    {
      title: 'Favoris',
      value: 'Mes annonces',
      icon: Heart,
      color: 'bg-pink-500',
      link: '/dashboard/traveler/favorites',
    },
    {
      title: 'Messages',
      value: 'Historique',
      icon: MessageSquare,
      color: 'bg-purple-500',
      link: '/dashboard/traveler/messages',
    },
  ];

  const quickActions = [
    {
      title: 'Rechercher un logement',
      description: 'Trouvez votre prochaine destination',
      icon: Home,
      link: '/listings',
      color: 'bg-[#FF385C]',
    },
    {
      title: 'Voir mes réservations',
      description: 'Gérez toutes vos réservations',
      icon: Calendar,
      link: '/dashboard/traveler/upcoming',
      color: 'bg-blue-500',
    },
    {
      title: 'Contacter le support',
      description: 'Aide et assistance',
      icon: MessageSquare,
      link: '/help',
      color: 'bg-green-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {session?.user?.name || 'Voyageur'} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue sur votre tableau de bord voyageur
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              href={card.link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-[#FF385C] font-medium">
                Voir plus
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Statistiques détaillées */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Aperçu de vos voyages
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalBookings}
                  </div>
                  <div className="text-sm text-gray-600">Total réservations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.confirmedBookings}
                  </div>
                  <div className="text-sm text-gray-600">Confirmées</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.upcomingBookings}
                  </div>
                  <div className="text-sm text-gray-600">À venir</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalSpent.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-sm text-gray-600">Total dépensé</div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Actions rapides
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.link}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`${action.color} p-2 rounded-lg mr-4`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {action.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {action.description}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Réservations récentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Réservations récentes
            </h2>
            <Link
              href="/dashboard/traveler/upcoming"
              className="text-[#FF385C] font-medium hover:underline flex items-center"
            >
              Voir toutes
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.listing.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.listing.city}, {booking.listing.country}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {booking.totalPrice.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.checkIn).toLocaleDateString('fr-FR')} -{' '}
                      {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune réservation récente</p>
              <Link
                href="/listings"
                className="inline-block mt-4 px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
              >
                Rechercher un logement
              </Link>
            </div>
          )}
        </div>

        {/* Conseils et recommandations */}
        <div className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Prêt pour votre prochain voyage ?
              </h3>
              <p className="opacity-90">
                Découvrez nos destinations populaires et trouvez l'inspiration
                pour votre prochaine aventure.
              </p>
            </div>
            <Link
              href="/listings"
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-[#FF385C] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explorer les destinations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}