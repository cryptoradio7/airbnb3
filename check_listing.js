const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    adapter: require('@prisma/adapter-libsql').PrismaLibSql({ url: 'file:dev.db' }),
  });

  try {
    const listing = await prisma.listing.findFirst({
      select: { id: true, title: true },
    });
    
    if (listing) {
      console.log('Listing found:', listing);
    } else {
      console.log('No listings found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();