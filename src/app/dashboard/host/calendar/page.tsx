"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Home, Check, X } from "lucide-react";

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isBooked: boolean;
  isBlocked: boolean;
  price?: number;
}

interface Listing {
  id: string;
  title: string;
}

export default function HostCalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedListing, setSelectedListing] = useState<string>("all");
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchListings();
    }
  }, [session]);

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      // Pour le MVP, on simule des données
      const mockListings: Listing[] = [
        { id: "1", title: "Appartement moderne Paris" },
        { id: "2", title: "Studio vue mer Nice" },
        { id: "3", title: "Maison campagne" },
      ];

      setListings(mockListings);
      setSelectedListing("all");
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Premier jour à afficher (peut être du mois précédent)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Dernier jour à afficher (peut être du mois suivant)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Générer les jours du calendrier
    const current = new Date(startDate);
    while (current <= endDate) {
      const date = new Date(current);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      // Pour le MVP, on simule des réservations et blocages aléatoires
      const isBooked = Math.random() > 0.7 && isCurrentMonth;
      const isBlocked = Math.random() > 0.8 && isCurrentMonth;
      const price = isCurrentMonth ? Math.floor(Math.random() * 100) + 50 : undefined;
      
      days.push({
        date,
        isToday,
        isCurrentMonth,
        isBooked,
        isBlocked,
        price,
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const toggleDayStatus = (dayIndex: number) => {
    // Pour le MVP, on simule le changement de statut
    setCalendarDays(calendarDays.map((day, index) => {
      if (index === dayIndex && day.isCurrentMonth) {
        return {
          ...day,
          isBlocked: !day.isBlocked,
          isBooked: day.isBlocked ? false : day.isBooked,
        };
      }
      return day;
    }));
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  const getDayStats = () => {
    const currentMonthDays = calendarDays.filter(day => day.isCurrentMonth);
    const bookedDays = currentMonthDays.filter(day => day.isBooked).length;
    const blockedDays = currentMonthDays.filter(day => day.isBlocked).length;
    const availableDays = currentMonthDays.length - bookedDays - blockedDays;
    
    return { bookedDays, blockedDays, availableDays };
  };

  const dayStats = getDayStats();

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
          <h1 className="text-4xl font-bold text-gray-900">Calendrier de disponibilité</h1>
          <p className="text-gray-600 mt-2">
            Gérez les disponibilités et prix de vos hébergements
          </p>
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatMonthYear(currentDate)}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="text-sm text-[#FF385C] hover:text-[#E31C5F] transition-colors"
                >
                  Revenir à aujourd'hui
                </button>
              </div>
              
              <button
                onClick={nextMonth}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home size={16} className="inline mr-2" />
                  Sélectionner une annonce
                </label>
                <select
                  value={selectedListing}
                  onChange={(e) => setSelectedListing(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                >
                  <option value="all">Toutes les annonces</option>
                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    // Pour le MVP, on simule l'export
                    alert("Calendrier exporté (simulation)");
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Check className="text-green-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dayStats.availableDays}</p>
              <p className="text-gray-600 text-sm">Jours disponibles</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <CalendarIcon className="text-blue-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dayStats.bookedDays}</p>
              <p className="text-gray-600 text-sm">Jours réservés</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                <X className="text-red-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dayStats.blockedDays}</p>
              <p className="text-gray-600 text-sm">Jours bloqués</p>
            </div>
          </div>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          {/* En-tête des jours */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div
                key={day}
                className="py-4 text-center font-medium text-gray-700 bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={day.date.toISOString()}
                className={`min-h-32 border-r border-b border-gray-100 p-2 ${
                  !day.isCurrentMonth ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex flex-col h-full">
                  {/* En-tête du jour */}
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-sm font-medium ${
                        day.isToday
                          ? "bg-[#FF385C] text-white w-6 h-6 rounded-full flex items-center justify-center"
                          : day.isCurrentMonth
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                    
                    {day.isCurrentMonth && day.price && (
                      <span className="text-xs font-medium text-gray-600">
                        {day.price}€
                      </span>
                    )}
                  </div>

                  {/* Statut du jour */}
                  {day.isCurrentMonth && (
                    <div className="flex-1">
                      {day.isBooked ? (
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-1">
                          Réservé
                        </div>
                      ) : day.isBlocked ? (
                        <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-1">
                          Bloqué
                        </div>
                      ) : (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-1">
                          Disponible
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {day.isCurrentMonth && (
                    <button
                      onClick={() => toggleDayStatus(index)}
                      className="mt-2 text-xs text-[#FF385C] hover:text-[#E31C5F] transition-colors"
                    >
                      {day.isBlocked ? "Débloquer" : "Bloquer"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Légende et actions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Légende */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Légende</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-green-100 border border-green-300"></div>
                <span className="text-gray-700">Disponible</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-blue-100 border border-blue-300"></div>
                <span className="text-gray-700">Réservé</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-red-100 border border-red-300"></div>
                <span className="text-gray-700">Bloqué</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FF385C]"></div>
                <span className="text-gray-700">Aujourd'hui</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-4">
              <button
                onClick={() => {
                  // Pour le MVP, on simule le blocage d'une période
                  alert("Période bloquée (simulation)");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium">Bloquer une période</span>
                <p className="text-sm text-gray-600 mt-1">
                  Rendre indisponible plusieurs jours d'affilée
                </p>
              </button>
              
              <button
                onClick={() => {
                  // Pour le MVP, on simule la modification des prix
                  alert("Modification des prix (simulation)");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium">Ajuster les prix</span>
                <p className="text-sm text-gray-600 mt-1">
                  Modifier les tarifs pour une période spécifique
                </p>
              </button>
              
              <button
                onClick={() => {
                  // Pour le MVP, on simule la copie du calendrier
                  alert("Calendrier copié vers une autre annonce (simulation)");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium">Copier vers une autre annonce</span>
                <p className="text-sm text-gray-600 mt-1">
                  Répliquer la disponibilité sur un autre hébergement
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Optimisez votre calendrier</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-2">📈 Prix dynamique</h4>
              <p className="text-sm opacity-90">
                Augmentez vos tarifs pendant les périodes de forte demande (weekends, vacances).
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">📅 Blocages intelligents</h4>
              <p className="text-sm opacity-90">
                Bloquez les jours où vous ne pouvez pas accueillir de voyageurs à l'avance.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">🔄 Synchronisation</h4>
              <p className="text-sm opacity-90">
                Synchronisez votre calendrier avec d'autres plateformes pour éviter les doubles réservations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}