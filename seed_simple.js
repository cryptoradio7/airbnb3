const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Clean up existing data
    await prisma.review.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();

    // Create a test host
    const host = await prisma.user.create({
      data: {
        email: 'host@example.com',
        name: 'Jean Dupont',
        password: await bcrypt.hash('password123', 10),
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    });

    console.log('Host created:', host.id);

    // Create a listing
    const listing = await prisma.listing.create({
      data: {
        title: 'Magnifique appartement avec vue sur la mer',
        description: 'Appartement moderne et lumineux situé en bord de mer. Parfait pour des vacances en famille ou entre amis. Grande terrasse avec vue imprenable sur l\'océan. Proche des commerces et des restaurants.',
        price: 120,
        location: '123 Promenade des Anglais',
        city: 'Nice',
        country: 'France',
        latitude: 43.7102,
        longitude: 7.2620,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
          'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        ]),
        amenities: JSON.stringify([
          'Wi-Fi',
          'Télévision',
          'Climatisation',
          'Cuisine équipée',
          'Machine à café',
          'Parking gratuit',
          'Piscine',
          'Salle de sport',
        ]),
        maxGuests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        hostId: host.id,
      },
    });

    console.log('Listing created:', listing.id);

    // Create a guest
    const guest = await prisma.user.create({
      data: {
        email: 'guest@example.com',
        name: 'Marie Martin',
        password: await bcrypt.hash('password123', 10),
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    });

    console.log('Guest created:', guest.id);

    // Create some reviews
    await prisma.review.createMany({
      data: [
        {
          listingId: listing.id,
          userId: guest.id,
          bookingId: 'test-booking-1',
          rating: 5,
          comment: 'Superbe séjour ! L\'appartement est encore plus beau en vrai. La vue est incroyable et l\'hôte très attentionné.',
        },
        {
          listingId: listing.id,
          userId: guest.id,
          bookingId: 'test-booking-2',
          rating: 4,
          comment: 'Très bon emplacement, appartement propre et bien équipé. Je recommande !',
        },
        {
          listingId: listing.id,
          userId: guest.id,
          bookingId: 'test-booking-3',
          rating: 5,
          comment: 'Parfait pour un week-end en amoureux. La terrasse est un vrai plus.',
        },
      ],
    });

    console.log('Reviews created');
    console.log('\nTest data created successfully!');
    console.log('Listing ID to test:', listing.id);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();