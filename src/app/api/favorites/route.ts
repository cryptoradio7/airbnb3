import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            location: true,
            city: true,
            country: true,
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
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json(
        { error: 'ID de l\'annonce requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier si l'annonce existe
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        listingId: listingId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Cette annonce est déjà dans vos favoris' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        listingId: listingId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Ajouté aux favoris', favorite },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get('id');
    const listingId = searchParams.get('listingId');

    if (!favoriteId && !listingId) {
      return NextResponse.json(
        { error: 'ID du favori ou ID de l\'annonce requis' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    let whereClause: any = { userId: user.id };

    if (favoriteId) {
      whereClause.id = favoriteId;
    } else if (listingId) {
      whereClause.listingId = listingId;
    }

    const favorite = await prisma.favorite.findFirst({
      where: whereClause,
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favori non trouvé' },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return NextResponse.json({ message: 'Retiré des favoris' });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}