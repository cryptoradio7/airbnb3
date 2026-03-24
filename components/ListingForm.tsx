"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@prisma/client";
import { Upload, X } from "lucide-react";

interface ListingFormProps {
  listing?: Listing | null;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function ListingForm({ listing, onSubmit }: ListingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(
    listing?.images ? JSON.parse(listing.images) : []
  );
  const [amenities, setAmenities] = useState<string[]>(
    listing?.amenities ? JSON.parse(listing.amenities) : []
  );
  const [newAmenity, setNewAmenity] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Ajouter les images et amenities au formData
    formData.append("images", JSON.stringify(images));
    formData.append("amenities", JSON.stringify(amenities));

    try {
      await onSubmit(formData);
      router.push("/dashboard/host/listings");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = () => {
    // Pour le MVP, on simule l'upload avec une URL placeholder
    const placeholderImage = `https://picsum.photos/seed/${Date.now()}/800/600`;
    setImages([...images, placeholderImage]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section Informations de base */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de base</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              defaultValue={listing?.title}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="Ex: Magnifique appartement avec vue sur mer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix par nuit (€) *
            </label>
            <input
              type="number"
              name="price"
              defaultValue={listing?.price}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="Ex: 89"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              defaultValue={listing?.description}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="Décrivez votre hébergement en détail..."
            />
          </div>
        </div>
      </div>

      {/* Section Localisation */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Localisation</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse complète *
            </label>
            <input
              type="text"
              name="location"
              defaultValue={listing?.location}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="Ex: 123 Rue de la Paix"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville *
            </label>
            <input
              type="text"
              name="city"
              defaultValue={listing?.city}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="Ex: Paris"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <input
              type="text"
              name="country"
              defaultValue={listing?.country}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              placeholder="Ex: France"
            />
          </div>
        </div>
      </div>

      {/* Section Capacité */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Capacité</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voyageurs max *
            </label>
            <input
              type="number"
              name="maxGuests"
              defaultValue={listing?.maxGuests}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chambres *
            </label>
            <input
              type="number"
              name="bedrooms"
              defaultValue={listing?.bedrooms}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lits *
            </label>
            <input
              type="number"
              name="beds"
              defaultValue={listing?.beds}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salles de bain *
            </label>
            <input
              type="number"
              name="bathrooms"
              defaultValue={listing?.bathrooms}
              required
              min="0"
              step="0.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Section Images */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Ajoutez au moins 5 photos de qualité. La première photo sera la photo principale.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {images.length < 10 && (
              <button
                type="button"
                onClick={handleAddImage}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#FF385C] transition-colors"
              >
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-gray-600">Ajouter une photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section Équipements */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Équipements</h2>
        
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Ex: WiFi, Piscine, Parking..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors"
            >
              Ajouter
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-lg"
              >
                <span>{amenity}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Enregistrement...
            </div>
          ) : listing ? (
            "Mettre à jour l'annonce"
          ) : (
            "Créer l'annonce"
          )}
        </button>
      </div>
    </form>
  );
}