const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.listing.count();
  console.log('Nombre de logements:', count);
  
  const sample = await prisma.listing.findFirst({
    include: { host: true }
  });
  console.log('Exemple de logement:', JSON.stringify(sample, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
