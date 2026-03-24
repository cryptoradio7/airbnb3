"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Calendar, DollarSign, Users, TrendingUp, Star } from "lucide-react";
import Link from "next/link";

export default function HostDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats();
      fetchRecentBookings();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      // Pour le MVP, on simule des données
      setStats({
        totalListings: 3,
        activeListings: 2,
        totalBookings: 12,
        pendingBookings: 2,
        totalEarnings: 2450,
        averageRating: 4.7,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      // Pour le MVP, on simule des données
      setRecentBookings([
        {
          id: "1",
          guestName: "Marie Dupont",
          listingTitle: "Appartement moderne Paris",
          checkIn: "2024-03-25",
          checkOut: "2024-03-30",
          totalPrice: 450,
          status: "confirmed",
        },
        {
          id: "2",
          guestName: "Jean Martin",
          listingTitle: "Studio vue mer Nice",
          checkIn: "2024-04-05",
          checkOut: "2024-04-12",
          totalPrice: 560,
          status: "pending",
        },
        {
          id: "3",
          guestName: "Sophie Bernard",
          listingTitle: "Maison campagne",
          checkIn: "2024-04-15",
          checkOut: "2024-04-20",
          totalPrice: 320,
          status: "confirmed",
        },
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Tableau de bord Hôte</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos annonces, réservations et revenus
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Annonces totales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalListings}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.activeListings} actives
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FF385C]/10 flex items-center justify-center">
                <Home className="text-[#FF385C]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Réservations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                <p className="text-sm text-amber-600 mt-1">
                  {stats.pendingBookings} en attente
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Revenus totaux</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEarnings} €</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp size={16} className="inline mr-1" />
                  +12% ce mois
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/dashboard/host/listings/new"
            className="bg-[#FF385C] text-white p-4 rounded-xl shadow-lg hover:bg-[#E31C5F] transition-colors text-center"
          >
            <Home size={24} className="mx-auto mb-2" />
            <span className="font-medium">Nouvelle annonce</span>
          </Link>

          <Link
            href="/dashboard/host/bookings"
            className="bg-blue-500 text-white p-4 rounded-xl shadow-lg hover:bg-blue-600 transition-colors text-center"
          >
            <Calendar size={24} className="mx-auto mb-2" />
            <span className="font-medium">Réservations</span>
          </Link>

          <Link
            href="/dashboard/host/calendar"
            className="bg-green-500 text-white p-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors text-center"
          >
            <Calendar size={24} className="mx-auto mb-2" />
            <span className="font-medium">Calendrier</span>
          </Link>

          <Link
            href="/dashboard/host/earnings"
            className="bg-purple-500 text-white p-4 rounded-xl shadow-lg hover:bg-purple-600 transition-colors text-center"
          >
            <DollarSign size={24} className="mx-auto mb-2" />
            <span className="font-medium">Revenus</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Réservations récentes */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Réservations récentes</h2>
              <Link
                href="/dashboard/host/bookings"
                className="text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors"
              >
                Voir tout →
              </Link>
            </div>

            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users size={16} className="text-gray-400" />
                      <span className="font-medium">{booking.guestName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {booking.status === "confirmed" ? "Confirmée" : "En attente"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{booking.listingTitle}</p>
                    <p className="text-gray-500 text-xs">
                      {booking.checkIn} → {booking.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{booking.totalPrice} €</p>
                    <button className="mt-2 text-sm text-[#FF385C] hover:text-[#E31C5F]">
                      {booking.status === "pending" ? "Gérer" : "Détails"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Note moyenne</span>
                  <span className="font-bold text-gray-900">{stats.averageRating}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#FF385C] h-2 rounded-full"
                    style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Taux d'occupation</span>
                  <span className="font-bold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Temps de réponse moyen</span>
                  <span className="font-bold text-gray-900">2h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Conseils pour améliorer</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600">
                  <Star size={16} className="text-amber-500" />
                  Ajoutez plus de photos à vos annonces
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Star size={16} className="text-amber-500" />
                  Répondez rapidement aux demandes
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Star size={16} className="text-amber-500" />
                  Mettez à jour votre calendrier régulièrement
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Annonces récentes */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vos annonces</h2>
            <Link
              href="/dashboard/host/listings"
              className="text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors"
            >
              Gérer toutes les annonces →
            </Link>
          </div>

          <div className="text-center py-12">
            <Home size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Vous avez {stats.totalListings} annonce(s)</p>
            <p className="text-gray-500 text-sm mt-2">
              {stats.activeListings} sont actuellement actives
            </p>
            <Link
              href="/dashboard/host/listings"
              className="mt-4 inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E31C5F] transition-colors font-medium"
            >
              Gérer mes annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}