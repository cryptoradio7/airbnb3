'use client';

import { useState } from 'react';
import { Calendar, Users, Check } from 'lucide-react';

interface BookingWidgetProps {
  price: number;
  listingId: string;
}

export default function BookingWidget({ price, listingId }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  
  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const subtotal = price * nights;
  const cleaningFee = 50;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + cleaningFee + serviceFee;

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert('Veuillez sélectionner les dates de séjour');
      return;
    }

    setIsBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          checkIn,
          checkOut,
          guests,
          totalPrice: total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers la page de confirmation
        window.location.href = `/bookings/${data.booking.id}/confirmation`;
      } else {
        alert(`Erreur: ${data.error || 'Échec de la réservation'}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Une erreur est survenue lors de la réservation');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="sticky top-24 border rounded-2xl shadow-lg p-6 bg-white">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-2xl font-bold">${price}</span>
        <span className="text-gray-600">/ nuit</span>
      </div>

      {/* Date pickers */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrivée
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Départ
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Guests selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Voyageurs
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} voyageur{i + 1 > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book button */}
      <button
        onClick={handleBooking}
        disabled={isBooking}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {isBooking ? 'Réservation en cours...' : 'Réserver'}
      </button>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">
            ${price} × {nights} nuit{nights > 1 ? 's' : ''}
          </span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de ménage</span>
          <span>${cleaningFee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frais de service</span>
          <span>${serviceFee}</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Annulation gratuite jusqu'à 48h avant</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Paiement sécurisé</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Assistance 24h/24</span>
        </div>
      </div>
    </div>
  );
}