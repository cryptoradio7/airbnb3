import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Calendar, Home, Heart, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'

export default async function TravelerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#222222] mb-2">Tableau de bord voyageur</h1>
      <p className="text-[#717171] mb-8">Bienvenue, {session.user?.name || session.user?.email} !</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/dashboard/traveler/upcoming" className="bg-white p-6 rounded-2xl border border-[#EBEBEB] hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF385C]/10 p-3 rounded-full">
              <Calendar className="text-[#FF385C]" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#222222]">Réservations à venir</h3>
              <p className="text-3xl font-bold text-[#222222]">3</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/traveler/past" className="bg-white p-6 rounded-2xl border border-[#EBEBEB] hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Home className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#222222]">Voyages passés</h3>
              <p className="text-3xl font-bold text-[#222222]">7</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/traveler/favorites" className="bg-white p-6 rounded-2xl border border-[#EBEBEB] hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Heart className="text-pink-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#222222]">Favoris</h3>
              <p className="text-3xl font-bold text-[#222222]">12</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/traveler/messages" className="bg-white p-6 rounded-2xl border border-[#EBEBEB] hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#222222]">Messages non lus</h3>
              <p className="text-3xl font-bold text-[#222222]">2</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#222222] mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/search" className="px-6 py-3 bg-[#FF385C] text-white rounded-full font-medium hover:bg-[#E14B50] transition-colors">
            Rechercher un logement
          </Link>
          <Link href="/dashboard/traveler/upcoming" className="px-6 py-3 border border-[#EBEBEB] rounded-full font-medium hover:bg-gray-50 transition-colors">
            Voir mes réservations
          </Link>
          <Link href="/dashboard/traveler/reviews" className="px-6 py-3 border border-[#EBEBEB] rounded-full font-medium hover:bg-gray-50 transition-colors">
            Laisser un avis
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#222222]">Réservations récentes</h2>
          <Link href="/dashboard/traveler/upcoming" className="text-[#FF385C] font-medium hover:underline">
            Voir tout
          </Link>
        </div>
        
        <div className="space-y-4">
          {[
            { id: 1, title: "Appartement moderne à Paris", dates: "15-22 avril 2024", status: "Confirmée" },
            { id: 2, title: "Villa avec piscine à Nice", dates: "5-12 mai 2024", status: "Confirmée" },
            { id: 3, title: "Chalet en montagne", dates: "20-27 mars 2024", status: "Terminée" },
          ].map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-[#EBEBEB] rounded-xl hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-[#222222]">{booking.title}</h3>
                <p className="text-sm text-[#717171]">{booking.dates}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'Confirmée' ? 'bg-green-100 text-green-800' :
                  booking.status === 'Terminée' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
                <Link href={`/bookings/${booking.id}`} className="text-[#FF385C] hover:underline">
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}