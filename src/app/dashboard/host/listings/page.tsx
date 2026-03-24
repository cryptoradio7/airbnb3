"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import HostListingCard from "@/components/HostListingCard";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  country: string;
  images: string;
  amenities: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
    reviews: number;
  };
}

export default function HostListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    filterListings();
  }, [searchTerm, statusFilter, listings]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      // Pour le MVP, on simule des données
      const mockListings: Listing[] = [
        {
          id: "1",
          title: "Appartement moderne avec vue sur la Tour Eiffel",
          description: "Magnifique appartement rénové avec vue imprenable sur la Tour Eiffel. Idéal pour un séjour romantique ou professionnel.",
          price: 120,
          location: "7ème arrondissement, Paris",
          city: "Paris",
          country: "France",
          images: JSON.stringify(["https://picsum.photos/800/600?random=1"]),
          amenities: JSON.stringify(["WiFi", "Cuisine équipée", "Climatisation"]),
          maxGuests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 1,
          hostId: session?.user?.id || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _count: {
            bookings: 8,
            reviews: 12,
          },
        },
        {
          id: "2",
          title: "Studio cosy proche métro",
          description: "Studio entièrement équipé dans quartier animé. Parfait pour les voyageurs solo ou les couples.",
          price: 65,
          location: "11ème arrondissement, Paris",
          city: "Paris",
          country: "France",
          images: JSON.stringify(["https://picsum.photos/800/600?random=2"]),
          amenities: JSON.stringify(["WiFi", "Machine à laver", "TV"]),
          maxGuests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1,
          hostId: session?.user?.id || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _count: {
            bookings: 15,
            reviews: 20,
          },
        },
        {
          id: "3",
          title: "Maison de campagne avec piscine",
          description: "Grande maison de campagne avec jardin privé et piscine. Calme garantie à seulement 1h de Paris.",
          price: 180,
          location: "Normandie",
          city: "Rouen",
          country: "France",
          images: JSON.stringify(["https://picsum.photos/800/600?random=3"]),
          amenities: JSON.stringify(["Piscine", "Jardin", "BBQ", "Parking"]),
          maxGuests: 8,
          bedrooms: 4,
          beds: 6,
          bathrooms: 3,
          hostId: session?.user?.id || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _count: {
            bookings: 5,
            reviews: 7,
          },
        },
      ];

      setListings(mockListings);
      setFilteredListings(mockListings);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut (simulé pour le MVP)
    if (statusFilter !== "all") {
      filtered = filtered.filter((listing, index) => {
        const isActive = index % 3 !== 0; // Simulation: 2/3 actifs
        return statusFilter === "active" ? isActive : !isActive;
      });
    }

    setFilteredListings(filtered);
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
    
    try {
      // Pour le MVP, on simule la suppression
      setListings(listings.filter((listing) => listing.id !== id));
      alert("Annonce supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      // Pour le MVP, on simule le changement de statut
      alert(`Annonce ${isActive ? "activée" : "désactivée"} avec succès`);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors du changement de statut");
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Mes annonces</h1>
            <p className="text-gray-600 mt-2">
              Gérez toutes vos annonces en un seul endroit
            </p>
          </div>
          
          <Link
            href="/dashboard/host/listings/new"
            className="flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E31C5F] transition-colors font-medium"
          >
            <Plus size={20} />
            Nouvelle annonce
          </Link>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher une annonce
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par titre, localisation..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actives seulement</option>
                  <option value="inactive">Inactives seulement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
              <p className="text-gray-600 text-sm">Total annonces</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(listings.length * 0.67)}
              </p>
              <p className="text-gray-600 text-sm">Annonces actives</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {listings.reduce((sum, listing) => sum + (listing._count?.bookings || 0), 0)}
              </p>
              <p className="text-gray-600 text-sm">Réservations totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {listings.reduce((sum, listing) => sum + listing.price, 0)} €
              </p>
              <p className="text-gray-600 text-sm">Revenu mensuel estimé</p>
            </div>
          </div>
        </div>

        {/* Liste des annonces */}
        <div className="space-y-6">
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" 
                  ? "Aucune annonce ne correspond à vos critères" 
                  : "Vous n'avez pas encore d'annonce"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Créez votre première annonce pour commencer à recevoir des réservations"}
              </p>
              <Link
                href="/dashboard/host/listings/new"
                className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E31C5F] transition-colors font-medium"
              >
                <Plus size={20} />
                Créer une annonce
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  {filteredListings.length} annonce{filteredListings.length > 1 ? "s" : ""} trouvée{filteredListings.length > 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>

              {filteredListings.map((listing) => (
                <HostListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={handleDeleteListing}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </>
          )}
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Conseils pour optimiser vos annonces</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold mb-2">Photos de qualité</h4>
              <p className="text-sm opacity-90">
                Ajoutez des photos lumineuses et professionnelles pour attirer plus de voyageurs.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Description détaillée</h4>
              <p className="text-sm opacity-90">
                Décrivez précisément votre hébergement et ses équipements.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Prix compétitif</h4>
              <p className="text-sm opacity-90">
                Analysez les prix de la concurrence pour optimiser votre tarif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}