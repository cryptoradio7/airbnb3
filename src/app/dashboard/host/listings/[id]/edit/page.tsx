"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ListingForm from "@/components/ListingForm";
import { Listing } from "@prisma/client";

export default function EditListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id && listingId) {
      fetchListing();
    }
  }, [session, listingId]);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      // Pour le MVP, on simule la récupération d'une annonce
      const mockListing: Listing = {
        id: listingId,
        title: "Appartement moderne avec vue sur la Tour Eiffel",
        description: "Magnifique appartement rénové avec vue imprenable sur la Tour Eiffel. Idéal pour un séjour romantique ou professionnel.",
        price: 120,
        location: "7ème arrondissement, Paris",
        city: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
        images: JSON.stringify([
          "https://picsum.photos/800/600?random=1",
          "https://picsum.photos/800/600?random=4",
          "https://picsum.photos/800/600?random=5"
        ]),
        amenities: JSON.stringify(["WiFi", "Cuisine équipée", "Climatisation", "TV", "Machine à laver"]),
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        hostId: session?.user?.id || "",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-03-20"),
      };

      setListing(mockListing);
    } catch (error) {
      console.error("Erreur lors du chargement de l'annonce:", error);
      alert("Impossible de charger l'annonce");
      router.push("/dashboard/host/listings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Récupérer les données du formulaire
      const listingData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseInt(formData.get("price") as string),
        location: formData.get("location") as string,
        city: formData.get("city") as string,
        country: formData.get("country") as string,
        maxGuests: parseInt(formData.get("maxGuests") as string),
        bedrooms: parseInt(formData.get("bedrooms") as string),
        beds: parseInt(formData.get("beds") as string),
        bathrooms: parseFloat(formData.get("bathrooms") as string),
        images: formData.get("images") as string,
        amenities: formData.get("amenities") as string,
      };

      console.log("Données mises à jour:", listingData);

      // Pour le MVP, on simule la mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Annonce mise à jour avec succès !");
      router.push("/dashboard/host/listings");
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw error;
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

  if (!listing) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Annonce non trouvée</h2>
          <p className="text-gray-600 mb-6">L'annonce que vous essayez de modifier n'existe pas.</p>
          <button
            onClick={() => router.push("/dashboard/host/listings")}
            className="bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E31C5F] transition-colors"
          >
            Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Modifier l'annonce</h1>
              <p className="text-gray-600 mt-2">
                Mettez à jour les informations de votre hébergement
              </p>
            </div>
            <button
              onClick={() => router.push(`/listings/${listingId}`)}
              className="text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors"
            >
              Voir la page publique →
            </button>
          </div>
        </div>

        {/* Informations sur l'annonce */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Informations actuelles</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {listing.price} €/nuit
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Localisation:</span>
              <span className="font-medium ml-2">{listing.location}, {listing.city}</span>
            </div>
            <div>
              <span className="text-gray-600">Capacité:</span>
              <span className="font-medium ml-2">{listing.maxGuests} voyageurs</span>
            </div>
            <div>
              <span className="text-gray-600">Chambres:</span>
              <span className="font-medium ml-2">{listing.bedrooms} chambres, {listing.beds} lits</span>
            </div>
            <div>
              <span className="text-gray-600">Dernière mise à jour:</span>
              <span className="font-medium ml-2">
                {new Date(listing.updatedAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <ListingForm listing={listing} onSubmit={handleSubmit} />

        {/* Section suppression */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Zone de danger</h3>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-red-900 mb-2">Supprimer cette annonce</h4>
                <p className="text-red-700 text-sm">
                  Une fois supprimée, cette annonce ne pourra plus être restaurée. 
                  Toutes les réservations futures seront annulées.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Êtes-vous sûr de vouloir supprimer définitivement cette annonce ?")) {
                    alert("Annonce supprimée (simulation)");
                    router.push("/dashboard/host/listings");
                  }
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
              >
                Supprimer l'annonce
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}