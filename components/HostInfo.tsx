import { User, Star, Shield, Clock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HostInfoProps {
  host: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
  };
  hostListingsCount?: number;
  hostRating?: number;
}

export default function HostInfo({ host, hostListingsCount = 1, hostRating = 4.8 }: HostInfoProps) {
  const memberSince = format(new Date(host.createdAt), 'MMMM yyyy', { locale: fr });

  return (
    <div className="border rounded-xl p-6">
      <div className="flex items-start gap-4 mb-6">
        {host.image ? (
          <img
            src={host.image}
            alt={host.name || 'Hôte'}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold">Hôte : {host.name || 'Anonyme'}</h3>
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{hostRating.toFixed(1)}</span>
            </div>
            <div>•</div>
            <div>{hostListingsCount} annonce{hostListingsCount > 1 ? 's' : ''}</div>
            <div>•</div>
            <div>Membre depuis {memberSince}</div>
          </div>
        </div>
      </div>

      {/* Host badges */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Shield className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium">Hôte vérifié</div>
            <div className="text-sm text-gray-500">Identité confirmée</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium">Réponse rapide</div>
            <div className="text-sm text-gray-500">Répond en moins de 1h</div>
          </div>
        </div>
      </div>

      {/* Host description */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">À propos de l'hôte</h4>
        <p className="text-gray-700">
          Passionné par l'accueil et le partage, je mets un point d'honneur à ce que mes invités 
          passent un séjour inoubliable. Je suis disponible pour toutes vos questions et 
          recommandations sur les meilleurs endroits à visiter dans la région.
        </p>
      </div>

      {/* Contact button */}
      <button className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Contacter l'hôte
      </button>

      {/* Safety note */}
      <div className="mt-6 pt-6 border-t text-sm text-gray-500">
        <p>
          Pour votre sécurité, ne transférez jamais d'argent et ne communiquez pas en dehors 
          de la plateforme Airbnb.
        </p>
      </div>
    </div>
  );
}