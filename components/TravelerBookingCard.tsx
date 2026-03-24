import React from 'react';
import Image from 'next/image';
import { Calendar, Users, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TravelerBookingCardProps {
  booking: {
    id: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalPrice: number;
    status: 'confirmed' | 'cancelled' | 'pending';
    listing: {
      id: string;
      title: string;
      location: string;
      city: string;
      country: string;
      images: string;
      price: number;
    };
  };
  showActions?: boolean;
}

export default function TravelerBookingCard({ booking, showActions = true }: TravelerBookingCardProps) {
  const images = booking.listing.images ? JSON.parse(booking.listing.images) : [];
  const mainImage = images[0] || '/placeholder-listing.jpg';
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: fr });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'cancelled':
        return 'Annulée';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:w-1/3 relative h-48 md:h-auto">
          <Image
            src={mainImage}
            alt={booking.listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{booking.listing.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{booking.listing.location}, {booking.listing.city}, {booking.listing.country}</span>
              </div>
            </div>
            
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="text-sm font-medium">{getStatusText(booking.status)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Dates</div>
                <div className="font-medium">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Voyageurs</div>
                <div className="font-medium">{booking.guests} {booking.guests > 1 ? 'personnes' : 'personne'}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Prix total</div>
              <div className="text-2xl font-bold text-gray-900">{booking.totalPrice.toLocaleString('fr-FR')} €</div>
              <div className="text-sm text-gray-500">
                {Math.round(booking.totalPrice / ((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))).toLocaleString('fr-FR')} €/nuit
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Voir les détails
                </button>
                {booking.status === 'confirmed' && (
                  <button className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] transition-colors">
                    Contacter l'hôte
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}