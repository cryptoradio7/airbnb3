"use client";

import { useState } from "react";
import { Filter, DollarSign, Home, Check } from "lucide-react";

interface FiltersProps {
  onFilterChange: (filters: {
    minPrice: number;
    maxPrice: number;
    types: string[];
    amenities: string[];
  }) => void;
}

const propertyTypes = [
  { id: "entire", label: "Logement entier", icon: "🏠" },
  { id: "private", label: "Chambre privée", icon: "🚪" },
  { id: "shared", label: "Chambre partagée", icon: "👥" },
];

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "kitchen", label: "Cuisine" },
  { id: "parking", label: "Parking" },
  { id: "pool", label: "Piscine" },
  { id: "ac", label: "Climatisation" },
  { id: "heating", label: "Chauffage" },
  { id: "tv", label: "Télévision" },
  { id: "washer", label: "Lave-linge" },
];

export default function Filters({ onFilterChange }: FiltersProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice,
      maxPrice,
      types: selectedTypes,
      amenities: selectedAmenities,
    });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(1000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    onFilterChange({
      minPrice: 0,
      maxPrice: 1000,
      types: [],
      amenities: [],
    });
  };

  return (
    <div className="relative">
      {/* Bouton filtre mobile/compact */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filtres</span>
        {(selectedTypes.length > 0 || selectedAmenities.length > 0 || minPrice > 0 || maxPrice < 1000) && (
          <span className="w-2 h-2 bg-[#FF385C] rounded-full"></span>
        )}
      </button>

      {/* Sidebar desktop */}
      <div className={`hidden md:block w-64 space-y-6 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </h3>
          
          {/* Prix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Prix par nuit
              </h4>
              <span className="text-sm text-gray-600">
                {minPrice}€ - {maxPrice}€
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>0€</span>
              <span>500€</span>
              <span>1000€</span>
            </div>
          </div>
          
          {/* Type de logement */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Type de logement
            </h4>
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeToggle(type.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTypes.includes(type.id)
                      ? "border-[#FF385C] bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                  {selectedTypes.includes(type.id) && (
                    <Check className="w-5 h-5 text-[#FF385C]" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Équipements */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Équipements</h4>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => handleAmenityToggle(amenity.id)}
                  className={`p-3 rounded-lg border transition-colors text-sm ${
                    selectedAmenities.includes(amenity.id)
                      ? "border-[#FF385C] bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{amenity.label}</span>
                    {selectedAmenities.includes(amenity.id) && (
                      <Check className="w-4 h-4 text-[#FF385C]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="space-y-3 pt-4 border-t">
          <button
            onClick={applyFilters}
            className="w-full py-3 bg-[#FF385C] text-white font-semibold rounded-lg hover:bg-[#E31C5F] transition-colors"
          >
            Appliquer les filtres
          </button>
          <button
            onClick={resetFilters}
            className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Modal mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Filtres</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Prix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">Prix par nuit</h4>
                  <span className="text-sm text-gray-600">
                    {minPrice}€ - {maxPrice}€
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Type de logement */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Type de logement</h4>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeToggle(type.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedTypes.includes(type.id)
                          ? "border-[#FF385C] bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                      {selectedTypes.includes(type.id) && (
                        <Check className="w-5 h-5 text-[#FF385C]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Équipements */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Équipements</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-3 rounded-lg border transition-colors text-sm ${
                        selectedAmenities.includes(amenity.id)
                          ? "border-[#FF385C] bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{amenity.label}</span>
                        {selectedAmenities.includes(amenity.id) && (
                          <Check className="w-4 h-4 text-[#FF385C]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-6 mt-6 border-t">
              <button
                onClick={applyFilters}
                className="w-full py-3 bg-[#FF385C] text-white font-semibold rounded-lg hover:bg-[#E31C5F] transition-colors"
              >
                Afficher les résultats
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
              >
                Tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}