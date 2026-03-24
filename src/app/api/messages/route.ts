import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Le paramètre bookingId est requis' },
        { status: 400 }
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

    // Vérifier que l'utilisateur a accès à cette réservation
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: {
            hostId: true
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

    // Vérifier que l'utilisateur est soit le voyageur, soit l'hôte
    const isTraveler = booking.userId === user.id;
    const isHost = booking.listing.hostId === user.id;

    if (!isTraveler && !isHost) {
      return NextResponse.json(
        { error: 'Accès non autorisé à cette conversation' },
        { status: 403 }
      );
    }

    // Déterminer l'autre participant
    const otherParticipantId = isTraveler ? booking.listing.hostId : booking.userId;

    // Récupérer les messages de cette réservation
    const messages = await prisma.message.findMany({
      where: {
        bookingId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Récupérer les informations de l'autre participant
    const otherParticipant = await prisma.user.findUnique({
      where: { id: otherParticipantId },
      select: {
        id: true,
        name: true,
        image: true
      }
    });

    // Compter les messages non lus pour l'utilisateur actuel
    const unreadCount = await prisma.message.count({
      where: {
        bookingId,
        recipientId: user.id,
        read: false
      }
    });

    return NextResponse.json({
      messages,
      otherParticipant,
      booking,
      unreadCount,
      currentUser: {
        id: user.id,
        name: user.name,
        image: user.image
      }
    });

  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

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
    const { bookingId, content } = body;

    // Validation des données
    if (!bookingId || !content) {
      return NextResponse.json(
        { error: 'Le bookingId et le contenu sont requis' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le message ne peut pas être vide' },
        { status: 400 }
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

    // Vérifier que la réservation existe
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: {
            hostId: true
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

    // Vérifier que l'utilisateur est soit le voyageur, soit l'hôte
    const isTraveler = booking.userId === user.id;
    const isHost = booking.listing.hostId === user.id;

    if (!isTraveler && !isHost) {
      return NextResponse.json(
        { error: 'Accès non autorisé à cette conversation' },
        { status: 403 }
      );
    }

    // Déterminer le destinataire
    const recipientId = isTraveler ? booking.listing.hostId : booking.userId;

    // Créer le message
    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId: user.id,
        recipientId,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message,
      notification: 'Message envoyé avec succès'
    });

  } catch (error) {
    console.error('Message creation error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}