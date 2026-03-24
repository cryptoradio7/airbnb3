import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const bookingId = params.id;

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

    // Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: user.id // S'assurer que l'utilisateur est propriétaire
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            city: true,
            country: true,
            price: true,
            images: true,
            amenities: true,
            maxGuests: true,
            bedrooms: true,
            beds: true,
            bathrooms: true,
            host: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const bookingId = params.id;
    const body = await request.json();
    const { checkIn, checkOut, guests } = body;

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

    // Récupérer la réservation existante
    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        userId: user.id // S'assurer que l'utilisateur est propriétaire
      },
      include: {
        listing: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la réservation peut être modifiée
    if (existingBooking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Cette réservation ne peut pas être modifiée' },
        { status: 400 }
      );
    }

    // Vérifier que la date de modification n'est pas trop proche
    const now = new Date();
    const checkInDate = new Date(existingBooking.checkIn);
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilCheckIn < 2) {
      return NextResponse.json(
        { error: 'Les modifications ne sont plus possibles moins de 48h avant l\'arrivée' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (checkIn) {
      const newCheckIn = new Date(checkIn);
      if (newCheckIn < new Date()) {
        return NextResponse.json(
          { error: 'La date d\'arrivée ne peut pas être dans le passé' },
          { status: 400 }
        );
      }
      updateData.checkIn = newCheckIn;
    }

    if (checkOut) {
      const newCheckOut = new Date(checkOut);
      const effectiveCheckIn = updateData.checkIn || existingBooking.checkIn;
      
      if (newCheckOut <= effectiveCheckIn) {
        return NextResponse.json(
          { error: 'La date de départ doit être après la date d\'arrivée' },
          { status: 400 }
        );
      }
      updateData.checkOut = newCheckOut;
    }

    if (guests) {
      if (guests > existingBooking.listing.maxGuests) {
        return NextResponse.json(
          { error: `Ce logement ne peut accueillir que ${existingBooking.listing.maxGuests} voyageurs maximum` },
          { status: 400 }
      );
      }
      updateData.guests = guests;
    }

    // Si les dates changent, vérifier la disponibilité
    if (updateData.checkIn || updateData.checkOut) {
      const effectiveCheckIn = updateData.checkIn ? new Date(updateData.checkIn) : existingBooking.checkIn;
      const effectiveCheckOut = updateData.checkOut ? new Date(updateData.checkOut) : existingBooking.checkOut;

      const conflictingBookings = await prisma.booking.findMany({
        where: {
          listingId: existingBooking.listingId,
          id: {
            not: bookingId
          },
          status: {
            in: ['confirmed', 'pending']
          },
          OR: [
            {
              checkIn: {
                lt: effectiveCheckOut
              },
              checkOut: {
                gt: effectiveCheckIn
              }
            }
          ]
        }
      });

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          { error: 'Le logement n\'est pas disponible pour ces nouvelles dates' },
          { status: 409 }
        );
      }

      // Recalculer le prix total
      const nights = Math.ceil((effectiveCheckOut.getTime() - effectiveCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      const subtotal = existingBooking.listing.price * nights;
      const cleaningFee = 50;
      const serviceFee = Math.round(subtotal * 0.1);
      updateData.totalPrice = subtotal + cleaningFee + serviceFee;
    }

    // Mettre à jour la réservation
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: updateData,
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
      }
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Réservation mise à jour avec succès'
    });

  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}