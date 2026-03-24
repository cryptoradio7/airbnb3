import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

// PUT /api/reviews/[id]/reply — host replies to a review
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { reply } = body;

    if (!reply || !reply.trim()) {
      return NextResponse.json(
        { error: 'La réponse ne peut pas être vide' },
        { status: 400 }
      );
    }

    // Find the review with listing info
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        listing: { select: { hostId: true } },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Avis introuvable' },
        { status: 404 }
      );
    }

    // Only the host of that listing can reply
    if (review.listing.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Seul l\'hôte du logement peut répondre à cet avis' },
        { status: 403 }
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { hostReply: reply.trim() },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('PUT /api/reviews/[id]/reply error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
