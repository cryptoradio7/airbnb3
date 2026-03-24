"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ListingForm from "@/components/ListingForm";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
        hostId: session?.user?.id,
      };

      console.log("Données de l'annonce:", listingData);

      // Pour le MVP, on simule la création
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Annonce créée avec succès !");
      router.push("/dashboard/host/listings");
      
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      throw error;
    }
  };

  if (status === "loading") {
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
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Créer une nouvelle annonce</h1>
          <p className="text-gray-600 mt-2">
            Remplissez le formulaire ci-dessous pour publier votre hébergement
          </p>
        </div>

        {/* Guide */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Conseils pour une annonce réussie</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">📸</span>
              <span>Ajoutez au moins 5 photos de qualité (lumineuses, nettes, montrant tous les espaces)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✍️</span>
              <span>Rédigez une description détaillée et accueillante</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">💰</span>
              <span>Fixez un prix compétitif en comparant avec les annonces similaires</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✅</span>
              <span>Listez tous les équipements disponibles pour attirer plus de voyageurs</span>
            </li>
          </ul>
        </div>

        {/* Formulaire */}
        <ListingForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}