"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Calendar, Edit, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          name,
        },
      });

      setIsEditing(false);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
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
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-b border-white/50 focus:border-white focus:outline-none text-white"
                        placeholder="Votre nom"
                      />
                    ) : (
                      session.user?.name || "Utilisateur"
                    )}
                  </h1>
                  <p className="text-white/80 mt-1">Membre depuis 2024</p>
                </div>
              </div>
              <div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-white text-[#FF385C] px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      <Save size={20} />
                      <span>{loading ? "Enregistrement..." : "Enregistrer"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setName(session.user?.name || "");
                      }}
                      className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <X size={20} />
                      <span>Annuler</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-white text-[#FF385C] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit size={20} />
                    <span>Modifier le profil</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Mail size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{session.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{session.user?.name || "Non renseigné"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID utilisateur</p>
                      <p className="font-medium text-sm font-mono">{session.user?.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#FF385C]">0</div>
                    <p className="text-gray-600 mt-2">Réservations</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#FF385C]">0</div>
                    <p className="text-gray-600 mt-2">Annonces</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#FF385C]">0</div>
                    <p className="text-gray-600 mt-2">Avis reçus</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-[#FF385C]">0</div>
                    <p className="text-gray-600 mt-2">Avis donnés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section sécurité */}
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Mot de passe</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Dernière modification il y a plus de 90 jours
                    </p>
                  </div>
                  <button className="text-[#FF385C] font-medium hover:text-[#E31C5F] transition-colors">
                    Modifier le mot de passe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}