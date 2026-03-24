'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Search, Filter, MapPin, Star, Users, Home, X } from 'lucide-react';

interface Favorite {
  id: string;
  listingId: string;
  createdAt: string;
  listing: {
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
    host: {
      id: string;
      name: string;
      image: string;
    };
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
        setFilteredFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = favorites;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (fav) =>
          fav.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fav.listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fav.listing.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fav.listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par prix
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter((fav) => fav.listing.price < 100);
          break;
        case 'medium':
          filtered = filtered.filter((fav) => fav.listing.price >= 100 && fav.listing.price < 200);
          break;
        case 'high':
          filtered = filtered.filter((fav) => fav.listing.price >= 200);
          break;
      }
    }

    setFilteredFavorites(filtered);
  }, [searchTerm, priceFilter, favorites]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      setRemovingId(favoriteId);
      const response = await fetch(`/api/favorites?id=${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      } else {
        alert('Erreur lors de la suppression du favori');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du favori');
    } finally {
      setRemovingId(null);
    }
  };

  const getAmenitiesList = (amenities: string) => {
    try {
      return JSON.parse(amenities);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
                Mes favoris
              </h1>
              <p className="text-gray-600 mt-2">
                Retrouvez toutes les annonces que vous avez aimées
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-gray-700">
              <Heart className="w-5 h-5 text-[#FF385C]" />
              <span className="font-medium">{favorites.length} favoris</span>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {favorites.length}
                  </div>
                  <div className="text-gray-600">Favoris enregistrés</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Array.from(new Set(favorites.map(f => f.listing.city))).length}
                  </div>
                  <div className="text-gray-600">Villes différentes</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {favorites.length > 0 
                      ? Math.round(favorites.reduce((sum, fav) => sum + fav.listing.price, 0) / favorites.length)
                      : 0} €
                  </div>
                  <div className="text-gray-600">Prix moyen/nuit</div>
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
                placeholder="Rechercher par titre, ville, description..."
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
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="all">Tous les prix</option>
                  <option value="low">Moins de 100€/nuit</option>
                  <option value="medium">100€ - 200€/nuit</option>
                  <option value="high">Plus de 200€/nuit</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des favoris */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Vos annonces favorites ({filteredFavorites.length})
            </h2>
            <div className="text-sm text-gray-600">
              Triées par date d'ajout
            </div>
          </div>

          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((favorite) => {
                const images = favorite.listing.images ? JSON.parse(favorite.listing.images) : [];
                const mainImage = images[0] || '/placeholder-listing.jpg';
                const amenities = getAmenitiesList(favorite.listing.amenities);

                return (
                  <div
                    key={favorite.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-48">
                      <Image
                        src={mainImage}
                        alt={favorite.listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <button
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        disabled={removingId === favorite.id}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                        title="Retirer des favoris"
                      >
                        {removingId === favorite.id ? (
                          <div className="w-4 h-4 border-2 border-[#FF385C] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Heart className="w-4 h-4 text-[#FF385C] fill-[#FF385C]" />
                        )}
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {favorite.listing.title}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">5.0</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">
                          {favorite.listing.city}, {favorite.listing.country}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{favorite.listing.maxGuests} voyageurs</span>
                        <span className="mx-2">•</span>
                        <span>{favorite.listing.bedrooms} chambre{favorite.listing.bedrooms > 1 ? 's' : ''}</span>
                        <span className="mx-2">•</span>
                        <span>{favorite.listing.beds} lit{favorite.listing.beds > 1 ? 's' : ''}</span>
                      </div>
                      
                      {amenities.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-gray-500 mb-2">Équipements :</div>
                          <div className="flex flex-wrap gap-2">
                            {amenities.slice(0, 3).map((amenity: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                            {amenities.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{amenities.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {favorite.listing.price.toLocaleString('fr-FR')} €
                          </div>
                          <div className="text-sm text-gray-500">par nuit</div>
                        </div>
                        <button
                          onClick={() => router.push(`/listings/${favorite.listing.id}`)}
                          className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
                        >
                          Voir l'annonce
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {favorites.length === 0 ? 'Aucun favori' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-600 mb-6">
                {favorites.length === 0
                  ? 'Vous n\'avez pas encore ajouté d\'annonces à vos favoris. Parcourez les annonces et cliquez sur le cœur pour les enregistrer !'
                  : 'Aucune annonce ne correspond à vos critères de recherche.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {favorites.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPriceFilter('all');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
                <button
                  onClick={() => router.push('/listings')}
                  className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
                >
                  {favorites.length === 0 ? 'Parcourir les annonces' : 'Rechercher des annonces'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conseils */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-pink-50 border border-pink-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Astuces pour vos favoris
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    Les prix peuvent changer rapidement - réservez tôt pour garantir le meilleur tarif
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    Contactez les hôtes pour poser des questions avant de réserver
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">•</span>
                    Activez les notifications pour être alerté des baisses de prix
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