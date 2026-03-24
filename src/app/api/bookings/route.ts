import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, checkIn, checkOut, guests, totalPrice } = body;

    // Validation des données
    if (!listingId || !checkIn || !checkOut || !guests || !totalPrice) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Convertir les dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validation des dates
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'La date de départ doit être après la date d\'arrivée' },
        { status: 400 }
      );
    }

    if (checkInDate < new Date()) {
      return NextResponse.json(
        { error: 'La date d\'arrivée ne peut pas être dans le passé' },
        { status: 400 }
      );
    }

    // Vérifier la disponibilité du logement
    const existingBookings = await prisma.booking.findMany({
      where: {
        listingId,
        status: {
          in: ['confirmed', 'pending']
        },
        OR: [
          {
            checkIn: {
              lt: checkOutDate
            },
            checkOut: {
              gt: checkInDate
            }
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Le logement n\'est pas disponible pour ces dates' },
        { status: 409 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le logement
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Logement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le nombre maximum de voyageurs
    if (guests > listing.maxGuests) {
      return NextResponse.json(
        { error: `Ce logement ne peut accueillir que ${listing.maxGuests} voyageurs maximum` },
        { status: 400 }
      );
    }

    // Calculer le prix total (vérification)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const calculatedTotal = listing.price * nights;
    
    // Ajouter les frais (comme dans le widget)
    const cleaningFee = 50;
    const serviceFee = Math.round(calculatedTotal * 0.1);
    const expectedTotal = calculatedTotal + cleaningFee + serviceFee;

    // Vérifier que le prix correspond (tolérance de 5%)
    if (Math.abs(totalPrice - expectedTotal) > expectedTotal * 0.05) {
      return NextResponse.json(
        { error: 'Le prix total ne correspond pas au calcul attendu' },
        { status: 400 }
      );
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        listingId,
        userId: user.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        totalPrice: expectedTotal, // Utiliser le prix calculé côté serveur
        status: 'confirmed'
      },
      include: {
        listing: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      booking,
      message: 'Réservation confirmée avec succès'
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les réservations de l'utilisateur
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            city: true,
            country: true,
            price: true,
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}