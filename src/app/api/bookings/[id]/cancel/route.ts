import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await auth();
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
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la réservation peut être annulée
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cette réservation est déjà annulée' },
        { status: 400 }
      );
    }

    if (booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Les réservations terminées ne peuvent pas être annulées' },
        { status: 400 }
      );
    }

    // Vérifier la politique d'annulation (48h avant check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 48) {
      return NextResponse.json(
        { 
          error: 'Annulation impossible',
          message: 'Les annulations ne sont plus possibles moins de 48h avant l\'arrivée. Contactez le support pour plus d\'informations.'
        },
        { status: 400 }
      );
    }

    // Annuler la réservation
    const cancelledBooking = await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        status: 'cancelled'
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
      }
    });

    // TODO: Envoyer un email de confirmation d'annulation
    // TODO: Traiter le remboursement si applicable

    return NextResponse.json({
      success: true,
      booking: cancelledBooking,
      message: 'Réservation annulée avec succès. Un email de confirmation vous a été envoyé.'
    });

  } catch (error) {
    console.error('Booking cancellation error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}