import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';
    const past = searchParams.get('past') === 'true';

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const now = new Date();
    
    let whereClause: any = {
      userId: user.id,
    };

    if (status) {
      whereClause.status = status;
    }

    if (upcoming) {
      whereClause.checkIn = {
        gte: now,
      };
    }

    if (past) {
      whereClause.checkOut = {
        lt: now,
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            city: true,
            country: true,
            images: true,
            price: true,
          },
        },
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    // Calculer les statistiques
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const upcomingBookings = bookings.filter(b => new Date(b.checkIn) >= now).length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    const stats = {
      totalBookings,
      confirmedBookings,
      upcomingBookings,
      totalSpent,
    };

    return NextResponse.json({
      bookings,
      stats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}