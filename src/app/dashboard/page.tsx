"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Home, Calendar, Star, Settings } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {session.user?.name || "Utilisateur"} ! Gérez vos réservations et annonces.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Réservations actives</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FF385C]/10 flex items-center justify-center">
                <Calendar className="text-[#FF385C]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Annonces publiées</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FF385C]/10 flex items-center justify-center">
                <Home className="text-[#FF385C]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Note moyenne</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FF385C]/10 flex items-center justify-center">
                <Star className="text-[#FF385C]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Revenus totaux</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0 €</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#FF385C]/10 flex items-center justify-center">
                <Settings className="text-[#FF385C]" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prochaines réservations */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prochaines réservations</h2>
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Aucune réservation à venir</p>
              <button className="mt-4 text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors">
                Explorer les hébergements
              </button>
            </div>
          </div>

          {/* Vos annonces */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Vos annonces</h2>
              <button className="bg-[#FF385C] text-white px-4 py-2 rounded-lg hover:bg-[#E31C5F] transition-colors">
                + Nouvelle annonce
              </button>
            </div>
            <div className="text-center py-12">
              <Home size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Vous n'avez pas encore publié d'annonce</p>
              <button className="mt-4 text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors">
                Créer votre première annonce
              </button>
            </div>
          </div>
        </div>

        {/* Section activité récente */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité récente</h2>
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune activité récente</p>
            <p className="text-gray-500 text-sm mt-2">
              Vos réservations, messages et avis apparaîtront ici
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}