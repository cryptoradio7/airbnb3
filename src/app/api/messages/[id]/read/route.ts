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

    const messageId = params.id;

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

    // Vérifier que le message existe et que l'utilisateur est le destinataire
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        booking: {
          include: {
            listing: {
              select: {
                hostId: true
              }
            }
          }
        }
      }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le destinataire
    if (message.recipientId !== user.id) {
      return NextResponse.json(
        { error: 'Accès non autorisé à ce message' },
        { status: 403 }
      );
    }

    // Marquer le message comme lu
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        read: true
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
      message: updatedMessage,
      notification: 'Message marqué comme lu'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonction pour marquer tous les messages non lus d'une réservation comme lus
export async function POST(
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

    const messageId = params.id;

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

    // Récupérer le message pour obtenir le bookingId
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: {
        bookingId: true
      }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    // Marquer tous les messages non lus de cette réservation comme lus
    const result = await prisma.message.updateMany({
      where: {
        bookingId: message.bookingId,
        recipientId: user.id,
        read: false
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      notification: `${result.count} message(s) marqué(s) comme lu(s)`
    });

  } catch (error) {
    console.error('Mark all messages as read error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}