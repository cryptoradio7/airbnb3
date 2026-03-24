import SearchBar from "@/components/SearchBar";
import { MapPin, Star, Shield, Heart } from "lucide-react";

export default function Home() {
  const popularDestinations = [
    { city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop" },
    { city: "Lyon", country: "France", image: "https://images.unsplash.com/photo-1569949381669-ecf31b5f3b6a?w-800&auto=format&fit=crop" },
    { city: "Marseille", country: "France", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop" },
    { city: "Nice", country: "France", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-[#FF385C] to-[#FD5B61]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Trouvez des logements uniques
            <br />
            <span className="text-yellow-300">et des expériences</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl">
            Découvrez des hébergements, des activités et bien plus avec Airbnb
          </p>
          
          <div className="w-full max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Destinations populaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{dest.city}</h3>
                  <p className="text-gray-200">{dest.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Pourquoi choisir Airbnb ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-[#FF385C]" />
              </div>
              <h3 className="text-xl font-semibold">Confiance et sécurité</h3>
              <p className="text-gray-600">
                Profitez d&apos;une expérience de voyage sécurisée avec nos vérifications et notre assistance 24/7.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-[#FF385C]" />
              </div>
              <h3 className="text-xl font-semibold">Qualité garantie</h3>
              <p className="text-gray-600">
                Tous nos logements sont vérifiés pour garantir votre confort et satisfaction.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-[#FF385C]" />
              </div>
              <h3 className="text-xl font-semibold">Expériences uniques</h3>
              <p className="text-gray-600">
                Découvrez des hébergements et activités que vous ne trouverez nulle part ailleurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-r from-[#FF385C] to-[#FD5B61] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à partir à l&apos;aventure ?
          </h2>
          <p className="text-xl mb-10">
            Rejoignez des millions de voyageurs qui font confiance à Airbnb
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-[#FF385C] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Explorer les logements
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
              Devenir hôte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}