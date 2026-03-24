'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Search, Filter, User, Calendar, Home, Clock, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
  recipient: {
    id: string;
    name: string;
    image: string;
  };
  booking: {
    id: string;
    listing: {
      id: string;
      title: string;
      images: string;
    };
  };
}

interface Conversation {
  userId: string;
  userName: string;
  userImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookingId: string;
  listingTitle: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchConversations();
    }
  }, [status, router]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
        setFilteredConversations(data.conversations);
      } else {
        // Si l'API n'existe pas, on crée des données de démo
        createDemoConversations();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      createDemoConversations();
    } finally {
      setLoading(false);
    }
  };

  const createDemoConversations = () => {
    const demoConversations: Conversation[] = [
      {
        userId: '1',
        userName: 'Marie Dubois',
        userImage: '',
        lastMessage: 'Bonjour, je vous confirme votre réservation pour le week-end !',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        bookingId: '1',
        listingTitle: 'Appartement cosy en centre-ville',
      },
      {
        userId: '2',
        userName: 'Pierre Martin',
        userImage: '',
        lastMessage: 'La clé sera dans la boîte aux lettres comme convenu.',
        lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        unreadCount: 1,
        bookingId: '2',
        listingTitle: 'Maison avec jardin près de la mer',
      },
      {
        userId: '3',
        userName: 'Sophie Bernard',
        userImage: '',
        lastMessage: 'Merci pour votre séjour, à bientôt !',
        lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        bookingId: '3',
        listingTitle: 'Studio moderne en montagne',
      },
    ];
    setConversations(demoConversations);
    setFilteredConversations(demoConversations);
  };

  const fetchMessages = async (userId: string) => {
    try {
      // Pour l'instant, on crée des messages de démo
      const demoMessages: Message[] = [
        {
          id: '1',
          content: 'Bonjour, je vous confirme votre réservation pour le week-end !',
          read: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          sender: { id: userId, name: 'Marie Dubois', image: '' },
          recipient: { id: 'current', name: session?.user?.name || 'Vous', image: '' },
          booking: {
            id: '1',
            listing: {
              id: '1',
              title: 'Appartement cosy en centre-ville',
              images: '[]',
            },
          },
        },
        {
          id: '2',
          content: 'Merci beaucoup ! Je suis impatient de découvrir votre appartement.',
          read: true,
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          sender: { id: 'current', name: session?.user?.name || 'Vous', image: '' },
          recipient: { id: userId, name: 'Marie Dubois', image: '' },
          booking: {
            id: '1',
            listing: {
              id: '1',
              title: 'Appartement cosy en centre-ville',
              images: '[]',
            },
          },
        },
        {
          id: '3',
          content: 'N\'hésitez pas si vous avez des questions avant votre arrivée.',
          read: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          sender: { id: userId, name: 'Marie Dubois', image: '' },
          recipient: { id: 'current', name: session?.user?.name || 'Vous', image: '' },
          booking: {
            id: '1',
            listing: {
              id: '1',
              title: 'Appartement cosy en centre-ville',
              images: '[]',
            },
          },
        },
      ];
      setMessages(demoMessages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  useEffect(() => {
    let filtered = conversations;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (conv) =>
          conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  const handleSelectConversation = (userId: string) => {
    setSelectedConversation(userId);
    fetchMessages(userId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Pour l'instant, on simule l'envoi d'un message
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      read: false,
      createdAt: new Date().toISOString(),
      sender: { id: 'current', name: session?.user?.name || 'Vous', image: '' },
      recipient: { 
        id: selectedConversation, 
        name: conversations.find(c => c.userId === selectedConversation)?.userName || '', 
        image: '' 
      },
      booking: {
        id: '1',
        listing: {
          id: '1',
          title: conversations.find(c => c.userId === selectedConversation)?.listingTitle || '',
          images: '[]',
        },
      },
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Mettre à jour la conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.userId === selectedConversation) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setFilteredConversations(updatedConversations);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return format(date, 'EEEE', { locale: fr });
    } else {
      return format(date, 'dd/MM/yyyy', { locale: fr });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 h-96 bg-gray-200 rounded-xl"></div>
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Communiquez avec vos hôtes et voyageurs
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-gray-700">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} non lu{conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {conversations.length}
                  </div>
                  <div className="text-gray-600">Conversations</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Array.from(new Set(conversations.map(c => c.userId))).length}
                  </div>
                  <div className="text-gray-600">Contacts différents</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {conversations.length > 0 
                      ? Math.round(conversations.reduce((sum, conv) => {
                          const days = Math.floor((Date.now() - new Date(conv.lastMessageTime).getTime()) / (1000 * 60 * 60 * 24));
                          return sum + days;
                        }, 0) / conversations.length)
                      : 0}j
                  </div>
                  <div className="text-gray-600">Délai moyen de réponse</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interface de messagerie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[600px]">
            {/* Liste des conversations */}
            <div className="lg:w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une conversation..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[500px]">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation === conversation.userId ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation.userId)}
                    >
                      <div className="flex items-start">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF385C] text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-semibold text-gray-900 truncate">
                              {conversation.userName}
                            </div>
                            <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatTime(conversation.lastMessageTime)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <Home className="w-3 h-3 mr-1" />
                            <span className="truncate">{conversation.listingTitle}</span>
                          </div>
                          
                          <div className="text-gray-600 text-sm mt-2 truncate">
                            {conversation.lastMessage}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune conversation trouvée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Zone de conversation */}
            <div className="lg:w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* En-tête de la conversation */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900">
                          {conversations.find(c => c.userId === selectedConversation)?.userName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Home className="w-3 h-3 mr-1" />
                          {conversations.find(c => c.userId === selectedConversation)?.listingTitle}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === 'current' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.sender.id === 'current'
                              ? 'bg-[#FF385C] text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 flex items-center ${message.sender.id === 'current' ? 'text-white/80' : 'text-gray-500'}`}>
                            {formatTime(message.createdAt)}
                            {message.sender.id === 'current' && (
                              <span className="ml-2">
                                {message.read ? (
                                  <CheckCheck className="w-3 h-3" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input d'envoi */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Tapez votre message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`px-6 py-2 rounded-lg font-medium ${
                          newMessage.trim()
                            ? 'bg-[#FF385C] text-white hover:bg-[#E31C5F]'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        } transition-colors`}
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Choisissez une conversation dans la liste pour commencer à échanger avec vos hôtes ou voyageurs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bonnes pratiques de communication
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Répondez rapidement aux messages pour améliorer votre expérience
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Soyez clair et précis dans vos questions et réponses
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Conservez toutes les communications dans l'application pour référence
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Confirmez les détails importants (heures d'arrivée, instructions d'accès)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}