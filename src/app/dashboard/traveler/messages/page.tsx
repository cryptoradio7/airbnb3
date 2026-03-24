'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, User, Calendar, MapPin, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Conversation {
  bookingId: string;
  otherParticipant: {
    id: string;
    name: string | null;
    image: string | null;
  };
  booking: {
    id: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    listing: {
      title: string;
      city: string;
      country: string;
      images: string;
    };
  };
  lastMessage: {
    content: string;
    createdAt: string;
    read: boolean;
  } | null;
  unreadCount: number;
}

export default function TravelerMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les conversations
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Pour l'instant, nous allons simuler des données
      // Dans une vraie implémentation, on appellerait une API
      // qui retourne toutes les conversations de l'utilisateur
      
      // Simulation de données
      const mockConversations: Conversation[] = [
        {
          bookingId: '1',
          otherParticipant: {
            id: 'host1',
            name: 'Marie Dubois',
            image: null
          },
          booking: {
            id: 'booking1',
            checkIn: '2024-04-15',
            checkOut: '2024-04-22',
            guests: 2,
            listing: {
              title: 'Appartement moderne à Paris',
              city: 'Paris',
              country: 'France',
              images: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'
            }
          },
          lastMessage: {
            content: 'Bonjour, je vous confirme que les clés seront disponibles à partir de 15h.',
            createdAt: '2024-04-10T14:30:00Z',
            read: true
          },
          unreadCount: 0
        },
        {
          bookingId: '2',
          otherParticipant: {
            id: 'host2',
            name: 'Pierre Martin',
            image: null
          },
          booking: {
            id: 'booking2',
            checkIn: '2024-05-05',
            checkOut: '2024-05-12',
            guests: 4,
            listing: {
              title: 'Villa avec piscine à Nice',
              city: 'Nice',
              country: 'France',
              images: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233'
            }
          },
          lastMessage: {
            content: 'La piscine sera chauffée pendant votre séjour.',
            createdAt: '2024-04-11T09:15:00Z',
            read: false
          },
          unreadCount: 2
        },
        {
          bookingId: '3',
          otherParticipant: {
            id: 'host3',
            name: 'Sophie Laurent',
            image: null
          },
          booking: {
            id: 'booking3',
            checkIn: '2024-06-10',
            checkOut: '2024-06-17',
            guests: 3,
            listing: {
              title: 'Chalet en montagne',
              city: 'Chamonix',
              country: 'France',
              images: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
            }
          },
          lastMessage: {
            content: 'Avez-vous des questions sur les équipements ?',
            createdAt: '2024-04-09T16:45:00Z',
            read: true
          },
          unreadCount: 0
        }
      ];
      
      // Dans la vraie implémentation :
      // const response = await fetch('/api/messages/conversations');
      // const data = await response.json();
      // setConversations(data.conversations);
      
      setConversations(mockConversations);
      
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Erreur lors du chargement des conversations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Filtrer les conversations par recherche
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.otherParticipant.name?.toLowerCase().includes(searchLower) ||
      conv.booking.listing.title.toLowerCase().includes(searchLower) ||
      conv.booking.listing.city.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  // Calculer le nombre de nuits
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Formater la date relative
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `il y a ${diffHours} h`;
    } else if (diffDays < 7) {
      return `il y a ${diffDays} j`;
    } else {
      return format(date, 'dd MMM', { locale: fr });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-[#222222]">Messages</h1>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#222222]">Messages</h1>
            <p className="text-[#717171]">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
              {conversations.some(c => c.unreadCount > 0) && (
                <span className="ml-2">
                  • <span className="text-rose-500 font-medium">
                    {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} non lu
                    {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 1 ? 's' : ''}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>
        
        <Link
          href="/search"
          className="px-6 py-3 bg-[#FF385C] text-white rounded-full font-medium hover:bg-[#E14B50] transition-colors"
        >
          Nouvelle réservation
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une conversation, un hôte, un logement..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-red-500 text-2xl">!</div>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadConversations}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {searchQuery 
              ? 'Aucune conversation ne correspond à votre recherche.'
              : 'Vous n\'avez pas encore de conversation. Réservez un logement pour commencer à échanger avec les hôtes.'
            }
          </p>
          {!searchQuery && (
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 bg-[#FF385C] text-white rounded-full font-medium hover:bg-[#E14B50] transition-colors"
            >
              Rechercher un logement
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.bookingId}
              className="bg-white rounded-2xl border border-[#EBEBEB] hover:shadow-lg transition-all overflow-hidden cursor-pointer"
              onClick={() => router.push(`/dashboard/traveler/messages/${conversation.bookingId}`)}
            >
              <div className="p-6">
                {/* En-tête de la conversation */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                      {conversation.otherParticipant.image ? (
                        <img
                          src={conversation.otherParticipant.image}
                          alt={conversation.otherParticipant.name || 'Hôte'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        conversation.otherParticipant.name?.charAt(0).toUpperCase() || 'H'
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {conversation.otherParticipant.name || 'Hôte'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversation.booking.listing.city}, {conversation.booking.listing.country}
                      </p>
                    </div>
                  </div>
                  
                  {/* Badge messages non lus */}
                  {conversation.unreadCount > 0 && (
                    <span className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                {/* Informations de réservation */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {conversation.booking.listing.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {calculateNights(conversation.booking.checkIn, conversation.booking.checkOut)} nuits
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(conversation.booking.checkIn), 'dd MMM', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{conversation.booking.guests} voyageur{conversation.booking.guests > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Dernier message */}
                {conversation.lastMessage && (
                  <div className={`p-3 rounded-lg ${conversation.unreadCount > 0 ? 'bg-rose-50' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                      {conversation.lastMessage.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${conversation.unreadCount > 0 ? 'text-rose-600 font-medium' : 'text-gray-500'}`}>
                        {formatRelativeTime(conversation.lastMessage.createdAt)}
                      </span>
                      {!conversation.lastMessage.read && conversation.unreadCount > 0 && (
                        <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bouton d'action */}
                <div className="mt-4 pt-4 border-t">
                  <button className="w-full text-center text-rose-500 font-medium hover:text-rose-600">
                    Ouvrir la conversation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-12 bg-blue-50 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Comment fonctionne la messagerie ?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Échangez avec vos hôtes avant, pendant et après votre séjour</li>
          <li>• Posez des questions sur le logement, les équipements, les horaires d'arrivée</li>
          <li>• Recevez des notifications pour les nouveaux messages</li>
          <li>• Toutes les conversations sont sécurisées et privées</li>
        </ul>
      </div>
    </div>
  );
}