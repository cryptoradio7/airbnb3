'use client';

import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    createdAt: string | Date;
    read: boolean;
    sender: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  isOwnMessage: boolean;
  onMarkAsRead?: (messageId: string) => void;
}

export default function MessageBubble({ message, isOwnMessage, onMarkAsRead }: MessageBubbleProps) {
  const formattedTime = format(new Date(message.createdAt), 'HH:mm', { locale: fr });
  const formattedDate = format(new Date(message.createdAt), 'dd MMM yyyy', { locale: fr });

  const handleClick = () => {
    if (!isOwnMessage && !message.read && onMarkAsRead) {
      onMarkAsRead(message.id);
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      onClick={handleClick}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {/* Avatar pour les messages de l'autre personne */}
        {!isOwnMessage && (
          <div className="flex items-end mb-1">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium mr-2">
              {message.sender.image ? (
                <img
                  src={message.sender.image}
                  alt={message.sender.name || 'Utilisateur'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                message.sender.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <span className="text-xs text-gray-500">{message.sender.name}</span>
          </div>
        )}

        {/* Bulle de message */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isOwnMessage
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-900 rounded-tl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          
          {/* Timestamp et statut de lecture */}
          <div className={`flex items-center justify-between mt-2 ${isOwnMessage ? 'text-rose-100' : 'text-gray-500'}`}>
            <span className="text-xs">{formattedTime}</span>
            
            {isOwnMessage && (
              <div className="flex items-center ml-2">
                {message.read ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date complète pour le premier message du jour */}
        <div className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {formattedDate}
        </div>
      </div>

      {/* Avatar pour nos propres messages */}
      {isOwnMessage && (
        <div className="order-1 ml-2 self-end">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
            Moi
          </div>
        </div>
      )}
    </div>
  );
}