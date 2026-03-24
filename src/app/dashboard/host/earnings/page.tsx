"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Download, Filter, Calendar, Clock } from "lucide-react";

interface Earning {
  id: string;
  date: string;
  listingTitle: string;
  guestName: string;
  amount: number;
  status: "paid" | "pending" | "cancelled";
  type: "booking" | "adjustment";
}

interface MonthlySummary {
  month: string;
  total: number;
  bookings: number;
  averagePrice: number;
}

export default function HostEarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("month");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchEarnings();
      fetchMonthlySummaries();
    }
  }, [session, timeRange]);

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      // Pour le MVP, on simule des données
      const mockEarnings: Earning[] = [
        {
          id: "1",
          date: "2024-03-25",
          listingTitle: "Appartement moderne Paris",
          guestName: "Marie Dupont",
          amount: 450,
          status: "paid",
          type: "booking",
        },
        {
          id: "2",
          date: "2024-04-05",
          listingTitle: "Studio vue mer Nice",
          guestName: "Jean Martin",
          amount: 560,
          status: "pending",
          type: "booking",
        },
        {
          id: "3",
          date: "2024-04-15",
          listingTitle: "Maison campagne",
          guestName: "Sophie Bernard",
          amount: 320,
          status: "paid",
          type: "booking",
        },
        {
          id: "4",
          date: "2024-03-28",
          listingTitle: "Appartement moderne Paris",
          guestName: "Pierre Leroy",
          amount: 600,
          status: "pending",
          type: "booking",
        },
        {
          id: "5",
          date: "2024-03-20",
          listingTitle: "Studio vue mer Nice",
          guestName: "Alice Moreau",
          amount: 130,
          status: "paid",
          type: "booking",
        },
        {
          id: "6",
          date: "2024-03-18",
          listingTitle: "Appartement moderne Paris",
          guestName: "Thomas Petit",
          amount: -50,
          status: "paid",
          type: "adjustment",
        },
        {
          id: "7",
          date: "2024-02-28",
          listingTitle: "Maison campagne",
          guestName: "Lucie Martin",
          amount: 200,
          status: "cancelled",
          type: "booking",
        },
        {
          id: "8",
          date: "2024-02-15",
          listingTitle: "Studio vue mer Nice",
          guestName: "David Blanc",
          amount: 280,
          status: "paid",
          type: "booking",
        },
      ];

      setEarnings(mockEarnings);
    } catch (error) {
      console.error("Erreur lors du chargement des revenus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthlySummaries = async () => {
    try {
      // Pour le MVP, on simule des données
      const mockSummaries: MonthlySummary[] = [
        {
          month: "Mars 2024",
          total: 1550,
          bookings: 5,
          averagePrice: 310,
        },
        {
          month: "Février 2024",
          total: 480,
          bookings: 2,
          averagePrice: 240,
        },
        {
          month: "Janvier 2024",
          total: 1200,
          bookings: 4,
          averagePrice: 300,
        },
        {
          month: "Décembre 2023",
          total: 1800,
          bookings: 6,
          averagePrice: 300,
        },
      ];

      setMonthlySummaries(mockSummaries);
    } catch (error) {
      console.error("Erreur lors du chargement des résumés:", error);
    }
  };

  const getFilteredEarnings = () => {
    let filtered = earnings;

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((earning) => earning.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((earning) => {
        const earningDate = new Date(earning.date);
        switch (dateFilter) {
          case "this-month":
            return earningDate.getMonth() === now.getMonth() && 
                   earningDate.getFullYear() === now.getFullYear();
          case "last-month":
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return earningDate.getMonth() === lastMonth.getMonth() && 
                   earningDate.getFullYear() === lastMonth.getFullYear();
          case "this-year":
            return earningDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const getStats = () => {
    const filteredEarnings = getFilteredEarnings();
    const totalEarnings = filteredEarnings
      .filter(e => e.status === "paid" && e.amount > 0)
      .reduce((sum, earning) => sum + earning.amount, 0);
    
    const pendingEarnings = filteredEarnings
      .filter(e => e.status === "pending")
      .reduce((sum, earning) => sum + earning.amount, 0);
    
    const totalBookings = filteredEarnings.filter(e => e.type === "booking").length;
    
    const averageEarning = totalBookings > 0 ? Math.round(totalEarnings / totalBookings) : 0;

    return { totalEarnings, pendingEarnings, totalBookings, averageEarning };
  };

  const stats = getStats();
  const filteredEarnings = getFilteredEarnings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
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
          <h1 className="text-4xl font-bold text-gray-900">Revenus et paiements</h1>
          <p className="text-gray-600 mt-2">
            Suivez vos revenus, paiements et performances financières
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Revenus totaux</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEarnings} €</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm text-green-600">+12% vs mois dernier</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">En attente de paiement</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingEarnings} €</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={16} className="text-amber-600" />
                  <span className="text-sm text-amber-600">À régler</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="text-amber-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Réservations moyennes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageEarning} €</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span className="text-sm text-blue-600">+8% vs moyenne</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="text-blue-500" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et contrôles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-2" />
                Statut du paiement
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="paid">Payés</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulés</option>
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
                <option value="all">Toutes les périodes</option>
                <option value="this-month">Ce mois</option>
                <option value="last-month">Mois dernier</option>
                <option value="this-year">Cette année</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  // Pour le MVP, on simule l'export
                  alert("Données exportées (simulation)");
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Download size={18} />
                Exporter les données
              </button>
            </div>
          </div>

          {/* Résumé */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-gray-600 text-sm">Réservations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalEarnings} €</p>
              <p className="text-gray-600 text-sm">Revenus totaux</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.pendingEarnings} €</p>
              <p className="text-gray-600 text-sm">En attente</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.averageEarning} €</p>
              <p className="text-gray-600 text-sm">Moyenne/réservation</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des revenus */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Transactions récentes</h2>
                <span className="text-gray-600">
                  {filteredEarnings.length} transaction{filteredEarnings.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-4">
                {filteredEarnings.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">Aucune transaction ne correspond à vos critères</p>
                  </div>
                ) : (
                  filteredEarnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          earning.amount > 0 ? "bg-green-100" : "bg-red-100"
                        }`}>
                          <DollarSign className={earning.amount > 0 ? "text-green-600" : "text-red-600"} size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{earning.listingTitle}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(earning.status)}`}>
                              {getStatusText(earning.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {earning.guestName} • {new Date(earning.date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          earning.amount > 0 ? "text-gray-900" : "text-red-600"
                        }`}>
                          {earning.amount > 0 ? "+" : ""}{earning.amount} €
                        </p>
                        <p className="text-gray-500 text-sm">
                          {earning.type === "booking" ? "Réservation" : "Ajustement"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Résumé mensuel */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance mensuelle</h2>
              
              <div className="space-y-6">
                {monthlySummaries.map((summary) => (
                  <div key={summary.month} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{summary.month}</span>
                      <span className="text-xl font-bold text-gray-900">{summary.total} €</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{summary.bookings} réservation{summary.bookings > 1 ? "s" : ""}</span>
                      <span>Moyenne: {summary.averagePrice} €</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#FF385C] h-2 rounded-full"
                        style={{ width: `${(summary.total / 2000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Prochain paiement</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-blue-900">Montant à recevoir</span>
                    <span className="text-xl font-bold text-blue-900">1,160 €</span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Paiement prévu le 05/04/2024
                  </p>
                  <button className="mt-3 w-full text-center text-blue-700 font-medium hover:text-blue-800">
                    Voir les détails →
                  </button>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Optimisez vos revenus</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-1">🎯 Prix stratégique</h4>
                  <p className="text-sm opacity-90">
                    Ajustez vos tarifs selon la saison et la demande.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-1">📈 Augmentez l'occupation</h4>
                  <p className="text-sm opacity-90">
                    Offrez des promotions pour les séjours longs.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-1">💰 Réduisez les frais</h4>
                  <p className="text-sm opacity-90">
                    Optimisez vos coûts pour maximiser vos profits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique (simulé) */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Évolution des revenus</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 60, 80, 100, 85, 95, 120, 110, 130, 140, 125, 155].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-[#FF385C] to-[#E31C5F] rounded-t-lg"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-gray-600">
            Évolution mensuelle sur 12 mois (en centaines d'euros)
          </div>
        </div>
      </div>
    </div>
  );
}