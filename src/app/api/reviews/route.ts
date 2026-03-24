import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/reviews?listingId=...&rating=...&page=...&limit=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const ratingFilter = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    if (!listingId) {
      return NextResponse.json(
        { error: 'listingId est requis' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { listingId };
    if (ratingFilter && ratingFilter !== 'all') {
      where.rating = parseInt(ratingFilter, 10);
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    // Compute average rating for this listing (unfiltered)
    const allReviews = await prisma.review.findMany({
      where: { listingId },
      select: { rating: true },
    });
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      averageRating: parseFloat(averageRating.toFixed(2)),
    });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, bookingId, rating, comment } = body;

    if (!listingId || !bookingId || !rating) {
      return NextResponse.json(
        { error: 'listingId, bookingId et rating sont requis' },
        { status: 400 }
      );
    }

    const ratingNum = parseInt(rating, 10);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    // Verify booking belongs to user and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation introuvable' },
        { status: 404 }
      );
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Cette réservation ne vous appartient pas' },
        { status: 403 }
      );
    }

    // Check booking is for the right listing
    if (booking.listingId !== listingId) {
      return NextResponse.json(
        { error: 'La réservation ne correspond pas au logement' },
        { status: 400 }
      );
    }

    // Check stay is completed (checkOut must be in the past)
    const now = new Date();
    if (booking.checkOut > now) {
      return NextResponse.json(
        { error: 'Vous ne pouvez laisser un avis qu\'après votre séjour' },
        { status: 400 }
      );
    }

    // Prevent duplicates: 1 review per booking
    const existing = await prisma.review.findFirst({
      where: { bookingId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour ce séjour' },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        listingId,
        userId: session.user.id,
        bookingId,
        rating: ratingNum,
        comment: comment?.trim() || null,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
