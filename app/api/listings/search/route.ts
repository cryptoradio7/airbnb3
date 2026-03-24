import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Paramètres de recherche
    const location = searchParams.get("location") || undefined;
    const checkIn = searchParams.get("checkIn") || undefined;
    const checkOut = searchParams.get("checkOut") || undefined;
    const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")!) : undefined;
    
    // Filtres
    const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : 0;
    const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 1000;
    const types = searchParams.get("types")?.split(",") || [];
    const amenities = searchParams.get("amenities")?.split(",") || [];
    
    // Tri et pagination
    const sortBy = searchParams.get("sortBy") || "price_asc";
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 12;
    const skip = (page - 1) * limit;

    // Construction de la requête
    const where: any = {
      AND: [
        { price: { gte: minPrice } },
        { price: { lte: maxPrice } },
      ],
    };

    // Filtre par localisation
    if (location) {
      where.AND.push({
        OR: [
          { city: { contains: location, mode: "insensitive" } },
          { country: { contains: location, mode: "insensitive" } },
          { location: { contains: location, mode: "insensitive" } },
        ],
      });
    }

    // Filtre par capacité
    if (guests) {
      where.AND.push({ maxGuests: { gte: guests } });
    }

    // Filtre par type (basé sur les équipements)
    if (types.length > 0) {
      // Pour simplifier, on filtre par certains équipements spécifiques
      const typeConditions = types.map(type => ({
        amenities: { contains: type, mode: "insensitive" },
      }));
      where.AND.push({ OR: typeConditions });
    }

    // Filtre par équipements
    if (amenities.length > 0) {
      const amenityConditions = amenities.map(amenity => ({
        amenities: { contains: amenity, mode: "insensitive" },
      }));
      where.AND.push({ AND: amenityConditions });
    }

    // Filtre par disponibilité (simplifié)
    if (checkIn && checkOut) {
      // Vérifier les réservations existantes
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          OR: [
            {
              AND: [
                { checkIn: { lte: new Date(checkOut) } },
                { checkOut: { gte: new Date(checkIn) } },
              ],
            },
          ],
          status: "confirmed",
        },
        select: { listingId: true },
      });

      const bookedListingIds = conflictingBookings.map(b => b.listingId);
      if (bookedListingIds.length > 0) {
        where.AND.push({ id: { notIn: bookedListingIds } });
      }
    }

    // Construction du tri
    let orderBy: any = {};
    switch (sortBy) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "rating_desc":
        orderBy = { reviews: { _count: "desc" } };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Exécution des requêtes
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    // Calcul des notes moyennes
    const listingsWithAvgRating = listings.map(listing => ({
      ...listing,
      averageRating: listing.reviews.length > 0
        ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
        : 0,
    }));

    return NextResponse.json({
      success: true,
      data: listingsWithAvgRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      filters: {
        location,
        checkIn,
        checkOut,
        guests,
        minPrice,
        maxPrice,
        types,
        amenities,
        sortBy,
      },
    });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la recherche" },
      { status: 500 }
    );
  }
}