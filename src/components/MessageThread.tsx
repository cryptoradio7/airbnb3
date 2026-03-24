'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, User, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageThreadProps {
  bookingId: string;
  onBack?: () => void;
  showHeader?: boolean;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  read: boolean;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface BookingInfo {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  listing: {
    title: string;
    location: string;
    city: string;
    country: string;
    price: number;
    images: string;
  };
}

interface OtherParticipant {
  id: string;
  name: string | null;
  image: string | null;
}

interface CurrentUser {
  id: string;
  name: string | null;
  image: string | null;
}

export default function MessageThread({ bookingId, onBack, showHeader = true }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [otherParticipant, setOtherParticipant] = useState<OtherParticipant | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Charger les messages
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/messages?bookingId=${bookingId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement des messages');
      }
      
      const data = await response.json();
      setMessages(data.messages);
      setBookingInfo(data.booking);
      setOtherParticipant(data.otherParticipant);
      setCurrentUser(data.currentUser);
      setUnreadCount(data.unreadCount);
      
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  // Charger les messages au montage et toutes les 10 secondes
  useEffect(() => {
    loadMessages();
    
    const interval = setInterval(loadMessages, 10000); // Polling toutes les 10 secondes
    
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Marquer un message comme lu
  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        // Mettre à jour l'état local
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // Marquer tous les messages comme lus
  const markAllAsRead = async () => {
    if (unreadCount === 0 || !messages.length) return;
    
    try {
      const response = await fetch(`/api/messages/${messages[0].id}/read`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Mettre à jour tous les messages comme lus
        setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all messages as read:', err);
    }
  };

  // Envoyer un message
  const sendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          content
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }
      
      // Recharger les messages après envoi
      await loadMessages();
      
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du message');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // Calculer le nombre de nuits
  const calculateNights = () => {
    if (!bookingInfo) return 0;
    const checkIn = new Date(bookingInfo.checkIn);
    const checkOut = new Date(bookingInfo.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {showHeader && onBack && (
          <div className="border-b border-gray-200 p-4 bg-white">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement de la conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        {showHeader && onBack && (
          <div className="border-b border-gray-200 p-4 bg-white">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-red-500 text-2xl">!</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadMessages}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* En-tête */}
      {showHeader && (
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  className="mr-3 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              {/* Avatar et nom de l'autre participant */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium mr-3">
                  {otherParticipant?.image ? (
                    <img
                      src={otherParticipant.image}
                      alt={otherParticipant.name || 'Utilisateur'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    otherParticipant?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {otherParticipant?.name || 'Utilisateur'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {bookingInfo?.listing?.city}, {bookingInfo?.listing?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Badge messages non lus */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm hover:bg-rose-200"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Informations de réservation */}
          {bookingInfo && (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {format(new Date(bookingInfo.checkIn), 'dd MMM', { locale: fr })} -{' '}
                  {format(new Date(bookingInfo.checkOut), 'dd MMM', { locale: fr })}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>{bookingInfo.guests} voyageur{bookingInfo.guests > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{bookingInfo.listing.title}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{calculateNights()} nuit{calculateNights() > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zone des messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <div className="text-gray-400 text-3xl">💬</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Commencez la conversation
            </h3>
            <p className="text-gray-600 max-w-md">
              Envoyez un message à {otherParticipant?.name || 'votre hôte/voyageur'} pour discuter de votre séjour.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.sender.id === currentUser?.id}
                onMarkAsRead={markMessageAsRead}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Zone de saisie */}
      <MessageInput
        onSendMessage={sendMessage}
        disabled={isSending || !currentUser}
        placeholder={`Écrivez à ${otherParticipant?.name || '...'}`}
      />
    </div>
  );
}