"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import ListingCard from "@/components/ListingCard";
import { Filter, ChevronDown, Grid, List } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    types: [] as string[],
    amenities: [] as string[],
  });
  const [sortBy, setSortBy] = useState("price_asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Récupérer les paramètres d'URL initiaux
  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        ...(location && { location }),
        ...(checkIn && { checkIn }),
        ...(checkOut && { checkOut }),
        ...(guests && { guests }),
        ...(filters.minPrice > 0 && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice < 1000 && { maxPrice: filters.maxPrice.toString() }),
        ...(filters.types.length > 0 && { types: filters.types.join(",") }),
        ...(filters.amenities.length > 0 && { amenities: filters.amenities.join(",") }),
      });

      const response = await fetch(`/api/listings/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setListings(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || "Erreur lors de la recherche");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, [filters, sortBy, location, checkIn, checkOut, guests]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchListings(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sortOptions = [
    { value: "price_asc", label: "Prix croissant" },
    { value: "price_desc", label: "Prix décroissant" },
    { value: "rating_desc", label: "Meilleures notes" },
    { value: "newest", label: "Plus récents" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec barre de recherche */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchBar compact />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête avec résultats et filtres */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {location ? `Logements à ${location}` : "Tous les logements"}
            </h1>
            <p className="text-gray-600">
              {pagination.total} logement{pagination.total > 1 ? "s" : ""} disponible{pagination.total > 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Bouton filtre mobile */}
            <div className="md:hidden">
              <Filters onFilterChange={handleFilterChange} />
            </div>

            {/* Sélecteur de vue */}
            <div className="hidden md:flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sélecteur de tri */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar avec filtres (desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Filters onFilterChange={handleFilterChange} />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️ {error}</div>
                <button
                  onClick={() => fetchListings(1)}
                  className="px-6 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun logement trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={() => handleFilterChange({
                    minPrice: 0,
                    maxPrice: 1000,
                    types: [],
                    amenities: [],
                  })}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Grille/liste des logements */}
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }>
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className={viewMode === "list" ? "bg-white rounded-2xl shadow-sm p-6" : ""}
                    >
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                      Précédent
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            pagination.page === pageNum
                              ? "bg-[#FF385C] text-white"
                              : "border border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}