"use client";

import { useState } from "react";
import { Search, Globe, Menu, User, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 bg-[#FF385C] rounded-full"></div>
            <span className="text-xl font-bold text-[#FF385C] hidden md:inline">
              airbnb
            </span>
          </div>

          {/* Barre de recherche (desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="w-full">
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <button className="px-4 py-3 text-sm font-semibold border-r border-gray-300">
                  Partout
                </button>
                <button className="px-4 py-3 text-sm text-gray-600 border-r border-gray-300">
                  N&apos;importe quand
                </button>
                <button className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
                  <span>Voyageurs</span>
                  <div className="w-8 h-8 bg-[#FF385C] text-white rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Barre de recherche (mobile) */}
          <div className="md:hidden flex-1 mx-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-full shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="text-sm text-gray-600">Rechercher</span>
              </div>
              <div className="w-6 h-6 border border-gray-300 rounded-full"></div>
            </button>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            <button className="hidden md:inline px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors">
              Devenir hôte
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 hover:shadow-md transition-shadow cursor-pointer">
              <Menu className="w-5 h-5" />
              <User className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recherche mobile */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
              <span className="font-semibold">Rechercher</span>
              <div className="w-10"></div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  placeholder="Où allez-vous ?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Arrivée</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Départ</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Voyageurs</label>
                <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg">
                  <span>2 voyageurs</span>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                      -
                    </button>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-[#FF385C] text-white font-semibold rounded-lg hover:bg-[#E31C5F] transition-colors">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}