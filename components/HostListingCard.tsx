"use client";

import { Listing } from "@prisma/client";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HostListingCardProps {
  listing: Listing & {
    _count?: {
      bookings: number;
      reviews: number;
    };
  };
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, isActive: boolean) => void;
}

export default function HostListingCard({ 
  listing, 
  onDelete, 
  onToggleStatus 
}: HostListingCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Simuler un statut actif/inactif (à remplacer par un champ réel dans la base)
  const isActive = Math.random() > 0.3; // Pour le MVP

  const handleEdit = () => {
    router.push(`/dashboard/host/listings/${listing.id}/edit`);
  };

  const handleDelete = async () => {
    if (!onDelete || !confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
    
    setIsDeleting(true);
    try {
      await onDelete(listing.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!onToggleStatus) return;
    
    setIsToggling(true);
    try {
      await onToggleStatus(listing.id, !isActive);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
            <p className="text-gray-600 mt-1">{listing.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {isActive ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Prix/nuit</p>
            <p className="text-2xl font-bold text-gray-900">{listing.price} €</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Voyageurs max</p>
            <p className="text-2xl font-bold text-gray-900">{listing.maxGuests}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Chambres</p>
            <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Réservations</p>
            <p className="text-2xl font-bold text-gray-900">
              {listing._count?.bookings || 0}
            </p>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-2 mb-6">{listing.description}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {isToggling ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : isActive ? (
                <>
                  <EyeOff size={16} />
                  Désactiver
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Activer
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              <Edit size={16} />
              Modifier
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <>
                  <Trash2 size={16} />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}