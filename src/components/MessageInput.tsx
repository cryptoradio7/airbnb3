'use client';

import { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ onSendMessage, disabled = false, placeholder = "Écrivez votre message..." }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center gap-2">
        {/* Bouton pièce jointe */}
        <button
          type="button"
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Joindre un fichier"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Bouton emoji */}
        <button
          type="button"
          disabled={disabled}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Insérer un emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Zone de texte */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="w-full border border-gray-300 rounded-2xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Compteur de caractères */}
          <div className="absolute right-3 bottom-2 text-xs text-gray-400">
            {message.length}/500
          </div>
        </div>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={!message.trim() || isSending || disabled}
          className={`p-3 rounded-full ${
            message.trim() && !isSending && !disabled
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          } transition-all`}
          title="Envoyer le message"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Indicateur d'état */}
      {isSending && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          Envoi en cours...
        </div>
      )}

      {/* Conseils */}
      <div className="text-xs text-gray-400 mt-2">
        Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> pour envoyer,{' '}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded">Shift+Enter</kbd> pour aller à la ligne
      </div>
    </form>
  );
}