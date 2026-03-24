"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Check, X, Clock, User, Home, Filter } from "lucide-react";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  listingTitle: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

export default function HostBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchBookings();
    }
  }, [session]);

  useEffect(() => {
    filterBookings();
  }, [statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // Pour le MVP, on simule des données
      const mockBookings: Booking[] = [
        {
          id: "1",
          guestName: "Marie Dupont",
          guestEmail: "marie.dupont@email.com",
          listingTitle: "Appartement moderne Paris",
          listingId: "1",
          checkIn: "2024-03-25",
          checkOut: "2024-03-30",
          guests: 2,
          totalPrice: 450,
          status: "confirmed",
          createdAt: "2024-03-10",
        },
        {
          id: "2",
          guestName: "Jean Martin",
          guestEmail: "jean.martin@email.com",
          listingTitle: "Studio vue mer Nice",
          listingId: "2",
          checkIn: "2024-04-05",
          checkOut: "2024-04-12",
          guests: 1,
          totalPrice: 560,
          status: "pending",
          createdAt: "2024-03-15",
        },
        {
          id: "3",
          guestName: "Sophie Bernard",
          guestEmail: "sophie.bernard@email.com",
          listingTitle: "Maison campagne",
          listingId: "3",
          checkIn: "2024-04-15",
          checkOut: "2024-04-20",
          guests: 4,
          totalPrice: 320,
          status: "confirmed",
          createdAt: "2024-03-12",
        },
        {
          id: "4",
          guestName: "Pierre Leroy",
          guestEmail: "pierre.leroy@email.com",
          listingTitle: "Appartement moderne Paris",
          listingId: "1",
          checkIn: "2024-05-10",
          checkOut: "2024-05-15",
          guests: 3,
          totalPrice: 600,
          status: "pending",
          createdAt: "2024-03-18",
        },
        {
          id: "5",
          guestName: "Alice Moreau",
          guestEmail: "alice.moreau@email.com",
          listingTitle: "Studio vue mer Nice",
          listingId: "2",
          checkIn: "2024-03-20",
          checkOut: "2024-03-22",
          guests: 2,
          totalPrice: 130,
          status: "completed",
          createdAt: "2024-03-05",
        },
        {
          id: "6",
          guestName: "Thomas Petit",
          guestEmail: "thomas.petit@email.com",
          listingTitle: "Maison campagne",
          listingId: "3",
          checkIn: "2024-02-28",
          checkOut: "2024-03-02",
          guests: 2,
          totalPrice: 200,
          status: "cancelled",
          createdAt: "2024-02-20",
        },
      ];

      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((booking) => {
        const checkInDate = new Date(booking.checkIn);
        switch (dateFilter) {
          case "upcoming":
            return checkInDate > now;
          case "past":
            return checkInDate < now;
          case "current":
            const checkOutDate = new Date(booking.checkOut);
            return checkInDate <= now && checkOutDate >= now;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  };

  const handleConfirmBooking = async (id: string) => {
    try {
      // Pour le MVP, on simule la confirmation
      setBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, status: "confirmed" } : booking
        )
      );
      alert("Réservation confirmée avec succès");
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
      alert("Erreur lors de la confirmation");
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir refuser cette réservation ?")) return;
    
    try {
      // Pour le MVP, on simule le refus
      setBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, status: "cancelled" } : booking
        )
      );
      alert("Réservation refusée");
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      alert("Erreur lors du refus");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "cancelled":
        return "Annulée";
      case "completed":
        return "Terminée";
      default:
        return status;
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
          <h1 className="text-4xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-gray-600 mt-2">
            Gérez toutes les réservations de vos hébergements
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-2" />
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="cancelled">Annulées</option>
                <option value="completed">Terminées</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Période
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              >
                <option value="all">Toutes les dates</option>
                <option value="upcoming">À venir</option>
                <option value="current">En cours</option>
                <option value="past">Passées</option>
              </select>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              <p className="text-gray-600 text-sm">Total réservations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === "pending").length}
              </p>
              <p className="text-gray-600 text-sm">En attente</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {bookings.filter(b => b.status === "confirmed").length}
              </p>
              <p className="text-gray-600 text-sm">Confirmées</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)} €
              </p>
              <p className="text-gray-600 text-sm">Revenus totaux</p>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Aucune réservation ne correspond à vos critères
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou revenez plus tard
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  {filteredBookings.length} réservation{filteredBookings.length > 1 ? "s" : ""} trouvée{filteredBookings.length > 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                  className="text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>

              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          {booking.status === "pending" && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <Clock size={14} />
                              <span className="text-sm">À confirmer</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{booking.listingTitle}</h3>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{booking.totalPrice} €</p>
                        <p className="text-gray-600 text-sm">
                          {booking.guests} voyageur{booking.guests > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Voyageur</p>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-gray-500">{booking.guestEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Calendar size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Arrivée</p>
                          <p className="font-medium">
                            {new Date(booking.checkIn).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Calendar size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Départ</p>
                          <p className="font-medium">
                            {new Date(booking.checkOut).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Home size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Durée</p>
                          <p className="font-medium">
                            {Math.ceil(
                              (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
                              (1000 * 60 * 60 * 24)
                            )} nuits
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {booking.status === "pending" && (
                      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                          <X size={18} />
                          Refuser
                        </button>
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors font-medium"
                        >
                          <Check size={18} />
                          Confirmer
                        </button>
                      </div>
                    )}

                    {booking.status === "confirmed" && (
                      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => router.push(`/listings/${booking.listingId}`)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Voir l'annonce
                        </button>
                        <