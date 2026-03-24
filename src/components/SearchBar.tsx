"use client";

import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching:", { location, dates, guests });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2"
    >
      {/* Location */}
      <div className="flex-1 min-w-0 px-6 py-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Où allez-vous ?
        </label>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher une destination"
            className="w-full border-none focus:outline-none text-gray-900 placeholder-gray-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-8 w-px bg-gray-200" />

      {/* Dates */}
      <div className="flex-1 min-w-0 px-6 py-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dates
        </label>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Ajouter des dates"
            className="w-full border-none focus:outline-none text-gray-900 placeholder-gray-400"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-8 w-px bg-gray-200" />

      {/* Guests */}
      <div className="flex-1 min-w-0 px-6 py-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Voyageurs
        </label>
        <div className="flex items-center">
          <Users className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Ajouter des voyageurs"
            className="w-full border-none focus:outline-none text-gray-900 placeholder-gray-400"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-[#FF385C] text-white p-3 rounded-full hover:bg-[#E31C5F] transition-colors flex items-center justify-center"
      >
        <Search className="w-5 h-5" />
        <span className="ml-2 hidden md:inline">Rechercher</span>
      </button>
    </form>
  );
}