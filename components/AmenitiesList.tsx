import { Check, Wifi, Tv, Wind, Coffee, Utensils, Car, Dumbbell, Waves, Snowflake } from 'lucide-react';

interface AmenitiesListProps {
  amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="w-5 h-5" />,
  'Télévision': <Tv className="w-5 h-5" />,
  'Climatisation': <Wind className="w-5 h-5" />,
  'Chauffage': <Snowflake className="w-5 h-5" />,
  'Cuisine équipée': <Utensils className="w-5 h-5" />,
  'Machine à café': <Coffee className="w-5 h-5" />,
  'Parking gratuit': <Car className="w-5 h-5" />,
  'Salle de sport': <Dumbbell className="w-5 h-5" />,
  'Piscine': <Waves className="w-5 h-5" />,
};

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) {
    return (
      <div className="text-gray-500">
        Aucun équipement listé
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {amenities.map((amenity, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            {amenityIcons[amenity] || <Check className="w-4 h-4 text-gray-600" />}
          </div>
          <span className="text-gray-700">{amenity}</span>
        </div>
      ))}
    </div>
  );
}