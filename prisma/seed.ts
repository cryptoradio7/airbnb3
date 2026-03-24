import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { faker } from "@faker-js/faker/locale/fr";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

// Prisma 7 requires a driver adapter
const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const libsqlUrl = dbUrl.replace(/^file:\.\//, "file:");
const adapter = new PrismaLibSql({ url: libsqlUrl });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// ─── Images Unsplash réelles par ville/type ───────────────────────────────────
const UNSPLASH_IMAGES = {
  paris: [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800",
    "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800",
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
  ],
  lyon: [
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800",
    "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
  ],
  marseille: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800",
  ],
  bordeaux: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800",
  ],
  nice: [
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  ],
  toulouse: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  ],
  strasbourg: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
    "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800",
  ],
  nantes: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    "https://images.unsplash.com/photo-1615529162924-f8605388461d?w=800",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
  ],
};

const AMENITIES_POOL = [
  "WiFi",
  "Cuisine équipée",
  "Climatisation",
  "Parking gratuit",
  "Piscine",
  "Jacuzzi",
  "Terrasse",
  "Jardin",
  "Vue sur mer",
  "Vue sur la ville",
  "Lave-linge",
  "Sèche-linge",
  "Télévision",
  "Netflix",
  "Animaux acceptés",
  "Vélos disponibles",
  "Cheminée",
  "Barbecue",
  "Ascenseur",
  "Accès handicapé",
  "Salle de sport",
  "Bureau de travail",
  "Fer à repasser",
  "Sèche-cheveux",
  "Produits de toilette",
];

// ─── Données des 25 logements ─────────────────────────────────────────────────
const LISTINGS_DATA = [
  // PARIS (8 logements)
  {
    title: "Appartement haussmannien avec vue sur la Tour Eiffel",
    description:
      "Superbe appartement du 19ème siècle entièrement rénové, situé dans le 7ème arrondissement avec une vue imprenable sur la Tour Eiffel. Parquet en chêne, moulures d'époque, cuisine moderne entièrement équipée.",
    price: 280,
    location: "7ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3003,
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    imageKey: "paris",
    amenities: ["WiFi", "Cuisine équipée", "Télévision", "Vue sur la ville", "Lave-linge"],
  },
  {
    title: "Studio moderne dans le Marais",
    description:
      "Studio chic et moderne au cœur du Marais, à deux pas des galeries d'art et des meilleurs restaurants. Déco contemporaine, lumière naturelle abondante.",
    price: 120,
    location: "Le Marais, 3ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8593,
    longitude: 2.3564,
    maxGuests: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    imageKey: "paris",
    amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Ascenseur"],
  },
  {
    title: "Loft industriel République avec terrasse",
    description:
      "Grand loft au style industriel chic avec une terrasse de 30m². Plafonds hauts, grandes fenêtres, mobilier design. Idéal pour un séjour en couple ou en famille.",
    price: 195,
    location: "République, 11ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8637,
    longitude: 2.3637,
    maxGuests: 6,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    imageKey: "paris",
    amenities: ["WiFi", "Terrasse", "Lave-linge", "Cuisine équipée", "Netflix"],
  },
  {
    title: "Chambre cosy Montmartre vue Sacré-Cœur",
    description:
      "Chambre charmante dans un appartement typique de Montmartre avec vue sur le Sacré-Cœur. Hôte présent pour vous faire découvrir le quartier.",
    price: 75,
    location: "Montmartre, 18ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8867,
    longitude: 2.3431,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    imageKey: "paris",
    amenities: ["WiFi", "Vue sur la ville", "Sèche-cheveux", "Produits de toilette"],
  },
  {
    title: "Penthouse luxueux avec piscine privée - 16ème",
    description:
      "Penthouse d'exception au dernier étage avec piscine privée sur le toit. Vue panoramique sur Paris, décoration haut de gamme, service de conciergerie disponible.",
    price: 850,
    location: "16ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8637,
    longitude: 2.2769,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    imageKey: "paris",
    amenities: ["WiFi", "Piscine", "Climatisation", "Vue sur la ville", "Cuisine équipée", "Ascenseur", "Parking gratuit"],
  },
  {
    title: "Appartement Saint-Germain-des-Prés",
    description:
      "Appartement élégant au cœur de Saint-Germain-des-Prés, quartier bohème et intellectuel de Paris. À deux pas des cafés littéraires et des boutiques.",
    price: 210,
    location: "Saint-Germain-des-Prés, 6ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8543,
    longitude: 2.3339,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    imageKey: "paris",
    amenities: ["WiFi", "Cuisine équipée", "Lave-linge", "Télévision", "Fer à repasser"],
  },
  {
    title: "Appartement familial Bastille",
    description:
      "Grand appartement lumineux proche de la Bastille, parfait pour les familles. Cuisine entièrement équipée, espace de jeu pour enfants, quartier animé.",
    price: 165,
    location: "Bastille, 12ème arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8533,
    longitude: 2.3692,
    maxGuests: 7,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    imageKey: "paris",
    amenities: ["WiFi", "Cuisine équipée", "Lave-linge", "Animaux acceptés", "Parking gratuit"],
  },
  {
    title: "Studio élégant près du Louvre",
    description:
      "Studio soigneusement décoré à 5 minutes à pied du Louvre. Emplacement idéal pour visiter les musées et les monuments du centre de Paris.",
    price: 110,
    location: "Louvre, 1er arrondissement",
    city: "Paris",
    country: "France",
    latitude: 48.8606,
    longitude: 2.3376,
    maxGuests: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    imageKey: "paris",
    amenities: ["WiFi", "Climatisation", "Ascenseur", "Cuisine équipée"],
  },
  // LYON (3 logements)
  {
    title: "Appartement Vieux-Lyon avec vue sur la colline de Fourvière",
    description:
      "Appartement authentique dans le Vieux-Lyon classé UNESCO. Pierre dorée, voûtes médiévales. Vue magnifique sur la colline de Fourvière et la Basilique.",
    price: 130,
    location: "Vieux-Lyon",
    city: "Lyon",
    country: "France",
    latitude: 45.7625,
    longitude: 4.8272,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    imageKey: "lyon",
    amenities: ["WiFi", "Vue sur la ville", "Cuisine équipée", "Télévision"],
  },
  {
    title: "Loft design Confluence - bord de Saône",
    description:
      "Loft contemporain dans le nouveau quartier Confluence, face au Rhône. Architecture moderne, grandes baies vitrées, équipements dernière génération.",
    price: 145,
    location: "Confluence",
    city: "Lyon",
    country: "France",
    latitude: 45.7392,
    longitude: 4.8165,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    imageKey: "lyon",
    amenities: ["WiFi", "Climatisation", "Parking gratuit", "Cuisine équipée", "Bureau de travail"],
  },
  {
    title: "Maison Croix-Rousse avec jardin secret",
    description:
      "Belle maison de ville sur les pentes de la Croix-Rousse avec un jardin privatif insolite. Quartier des Canuts, idéal pour découvrir le Lyon authentique.",
    price: 175,
    location: "Croix-Rousse",
    city: "Lyon",
    country: "France",
    latitude: 45.7742,
    longitude: 4.8302,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    imageKey: "lyon",
    amenities: ["WiFi", "Jardin", "Barbecue", "Lave-linge", "Animaux acceptés", "Parking gratuit"],
  },
  // MARSEILLE (3 logements)
  {
    title: "Villa vue mer dans les Calanques",
    description:
      "Villa d'exception avec piscine à débordement et vue panoramique sur les Calanques. Accès privé aux criques. Séjour inoubliable en pleine nature méditerranéenne.",
    price: 450,
    location: "Calanques de Morgiou",
    city: "Marseille",
    country: "France",
    latitude: 43.2147,
    longitude: 5.4497,
    maxGuests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 3,
    imageKey: "marseille",
    amenities: ["WiFi", "Piscine", "Vue sur mer", "Barbecue", "Parking gratuit", "Climatisation", "Terrasse"],
  },
  {
    title: "Appartement Vieux-Port vue sur la mer",
    description:
      "Appartement lumineux au cœur du Vieux-Port de Marseille. Vue directe sur le port et Notre-Dame-de-la-Garde. À deux pas du marché aux poissons.",
    price: 140,
    location: "Vieux-Port",
    city: "Marseille",
    country: "France",
    latitude: 43.2951,
    longitude: 5.3747,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    imageKey: "marseille",
    amenities: ["WiFi", "Vue sur mer", "Climatisation", "Cuisine équipée", "Télévision"],
  },
  {
    title: "Maison bohème Cours Julien",
    description:
      "Maison colorée et bohème dans le quartier artistique du Cours Julien. Patio ombragé, déco vintage, ambiance unique. Au cœur de la scène culturelle marseillaise.",
    price: 95,
    location: "Cours Julien",
    city: "Marseille",
    country: "France",
    latitude: 43.2913,
    longitude: 5.3836,
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    imageKey: "marseille",
    amenities: ["WiFi", "Jardin", "Barbecue", "Lave-linge", "Animaux acceptés"],
  },
  // BORDEAUX (3 logements)
  {
    title: "Château viticole Saint-Émilion",
    description:
      "Séjournez dans un véritable château viticole à Saint-Émilion. Dégustations privées, vues sur les vignes, architecture XVIII siècle. Expérience unique en Gironde.",
    price: 380,
    location: "Saint-Émilion",
    city: "Bordeaux",
    country: "France",
    latitude: 44.8953,
    longitude: -0.1554,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    imageKey: "bordeaux",
    amenities: ["WiFi", "Parking gratuit", "Jardin", "Piscine", "Barbecue", "Cheminée"],
  },
  {
    title: "Appartement design Triangle d'Or Bordeaux",
    description:
      "Appartement contemporain dans le Triangle d'Or de Bordeaux, classé UNESCO. Pierres blondes, molures préservées, équipements modernes. Emplacement idéal.",
    price: 155,
    location: "Triangle d'Or",
    city: "Bordeaux",
    country: "France",
    latitude: 44.8378,
    longitude: -0.5792,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    imageKey: "bordeaux",
    amenities: ["WiFi", "Climatisation", "Cuisine équipée", "Lave-linge", "Ascenseur"],
  },
  {
    title: "Maison de vigneron avec cave à vin",
    description:
      "Authentique maison de vigneron avec cave à vin privée contenant 50 bouteilles de grands crus bordelais. Jardin avec vue sur vignes, barbecue, ambiance authentique.",
    price: 220,
    location: "Médoc",
    city: "Bordeaux",
    country: "France",
    latitude: 45.1500,
    longitude: -0.8500,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    imageKey: "bordeaux",
    amenities: ["WiFi", "Parking gratuit", "Jardin", "Barbecue", "Cheminée", "Animaux acceptés"],
  },
  // NICE (2 logements)
  {
    title: "Villa Belle Époque vue mer Côte d'Azur",
    description:
      "Villa Belle Époque avec piscine chauffée et vue panoramique sur la Méditerranée. Jardin exotique, terrasses multiples, à 5 minutes de la Promenade des Anglais.",
    price: 520,
    location: "Promenade des Anglais",
    city: "Nice",
    country: "France",
    latitude: 43.6966,
    longitude: 7.2557,
    maxGuests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 4,
    imageKey: "nice",
    amenities: ["WiFi", "Piscine", "Vue sur mer", "Jacuzzi", "Parking gratuit", "Climatisation", "Terrasse", "Barbecue"],
  },
  {
    title: "Appartement Vieux-Nice avec terrasse fleurie",
    description:
      "Charmant appartement dans le Vieux-Nice aux façades colorées. Terrasse avec géraniums et vue sur les toits. Marchés provençaux à deux pas.",
    price: 125,
    location: "Vieux-Nice",
    city: "Nice",
    country: "France",
    latitude: 43.6961,
    longitude: 7.2764,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    imageKey: "nice",
    amenities: ["WiFi", "Terrasse", "Climatisation", "Cuisine équipée", "Vue sur la ville"],
  },
  // TOULOUSE (2 logements)
  {
    title: "Loft capitole au cœur de la Ville Rose",
    description:
      "Magnifique loft au cœur de Toulouse à deux pas du Capitole. Briques roses, hauteur sous plafond 4m, déco minimaliste et chaleureuse. Tout à pied.",
    price: 135,
    location: "Capitole",
    city: "Toulouse",
    country: "France",
    latitude: 43.6047,
    longitude: 1.4442,
    maxGuests: 4,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    imageKey: "toulouse",
    amenities: ["WiFi", "Cuisine équipée", "Climatisation", "Lave-linge", "Bureau de travail"],
  },
  {
    title: "Maison de ville avec patio - quartier des Carmes",
    description:
      "Maison toulousaine typique avec son beau patio ombragé. Quartier des Carmes, marché quotidien, restaurants de qualité. Idéal pour explorer la ville à pied.",
    price: 160,
    location: "Quartier des Carmes",
    city: "Toulouse",
    country: "France",
    latitude: 43.5958,
    longitude: 1.4430,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    imageKey: "toulouse",
    amenities: ["WiFi", "Jardin", "Lave-linge", "Barbecue", "Parking gratuit"],
  },
  // STRASBOURG (2 logements)
  {
    title: "Maison à colombages Petite France",
    description:
      "Authentique maison à colombages dans le quartier enchanteur de la Petite France, classé UNESCO. Vue sur les canaux, ambiance alsacienne unique, tout à pied.",
    price: 185,
    location: "Petite France",
    city: "Strasbourg",
    country: "France",
    latitude: 48.5797,
    longitude: 7.7441,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    imageKey: "strasbourg",
    amenities: ["WiFi", "Cheminée", "Cuisine équipée", "Lave-linge", "Vue sur la ville"],
  },
  {
    title: "Appartement Neustadt avec vue sur la Cathédrale",
    description:
      "Appartement haussmannien dans le quartier Neustadt avec vue sur la cathédrale de Strasbourg. À deux pas du marché de Noël le plus célèbre d'Europe.",
    price: 150,
    location: "Neustadt",
    city: "Strasbourg",
    country: "France",
    latitude: 48.5830,
    longitude: 7.7521,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    imageKey: "strasbourg",
    amenities: ["WiFi", "Vue sur la ville", "Cuisine équipée", "Ascenseur", "Lave-linge"],
  },
  // NANTES (2 logements)
  {
    title: "Appartement Île de Nantes - bord de Loire",
    description:
      "Appartement contemporain sur l'Île de Nantes avec vue sur la Loire. Quartier en pleine transformation artistique, machines de l'île à proximité, ambiance unique.",
    price: 115,
    location: "Île de Nantes",
    city: "Nantes",
    country: "France",
    latitude: 47.2071,
    longitude: -1.5585,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    imageKey: "nantes",
    amenities: ["WiFi", "Cuisine équipée", "Lave-linge", "Bureau de travail", "Vélos disponibles"],
  },
  {
    title: "Maison bretonne jardin - Quartier Bouffay",
    description:
      "Charmante maison bretonne avec grand jardin dans le quartier médiéval du Bouffay. Poutres apparentes, pierres de taille, déco cosy. Restaurants à pied.",
    price: 145,
    location: "Quartier Bouffay",
    city: "Nantes",
    country: "France",
    latitude: 47.2153,
    longitude: -1.5526,
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    imageKey: "nantes",
    amenities: ["WiFi", "Jardin", "Barbecue", "Cheminée", "Lave-linge", "Animaux acceptés"],
  },
];

const REVIEW_COMMENTS = [
  "Séjour absolument parfait ! L'appartement était exactement comme sur les photos, peut-être encore plus beau. Hôte très réactif et attentionné.",
  "Emplacement idéal, logement propre et bien équipé. Je recommande vivement pour un séjour à Paris.",
  "Superbe vue, appartement confortable. Quelques petits détails pourraient être améliorés mais dans l'ensemble très satisfait.",
  "Endroit magique, nous avons passé un week-end inoubliable. L'hôte nous a laissé de très bons conseils pour les restaurants.",
  "Bon rapport qualité-prix pour Paris. Quartier animé, transports en commun à proximité. On reviendra !",
  "Logement conforme à la description. Propre, fonctionnel, bien situé. Hôte disponible et sympathique.",
  "Coup de cœur ! La vue depuis la terrasse est à couper le souffle. Le quartier est vivant et authentique.",
  "Appartement moderne et bien équipé. La literie est très confortable. Seul bémol : le bruit de la rue le soir.",
  "Magnifique logement ! Photos fidèles à la réalité. L'hôte a pensé à tout pour rendre le séjour agréable.",
  "Parfait pour un city-break. Tout est à portée de marche. Nous reviendrons certainement.",
  "Séjour en famille réussi. Appartement spacieux et bien équipé pour les enfants. L'hôte a été adorable.",
  "Logement calme et reposant malgré l'emplacement central. Insonorisation remarquable. Je recommande.",
  "Beau logement avec un charme particulier. Quelques équipements datent un peu mais tout fonctionne bien.",
  "Très belle expérience. L'hôte nous a accueillis chaleureusement avec des produits locaux. Un vrai plus !",
  "Idéal pour découvrir la ville. L'appartement est propre, lumineux et la connexion WiFi excellente.",
  "Un peu de difficulté à trouver le logement mais une fois arrivé, on ne regrette rien ! Superbe.",
  "Rapport qualité-prix excellent. Bien meilleur qu'un hôtel pour le même budget. Merci !",
  "Logement cosy et chaleureux, parfait pour les nuits fraîches. La cheminée est un vrai atout.",
  "Séjour romantique parfait. Tout était prévu pour nous faciliter la vie. Hôte irréprochable.",
  "Vue extraordinaire sur la mer ! Logement confortable et propre. On rêve d'y revenir.",
];

async function main() {
  console.log("🌱 Début du seed...");

  // Nettoyage de la base
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // ─── 1. Créer 10 utilisateurs ───────────────────────────────────────────────
  console.log("👤 Création des utilisateurs...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const usersData = [
    { name: "Sophie Moreau", email: "sophie.moreau@example.fr" },
    { name: "Julien Dupont", email: "julien.dupont@example.fr" },
    { name: "Camille Bernard", email: "camille.bernard@example.fr" },
    { name: "Thomas Martin", email: "thomas.martin@example.fr" },
    { name: "Léa Petit", email: "lea.petit@example.fr" },
    { name: "Nicolas Robert", email: "nicolas.robert@example.fr" },
    { name: "Emma Leroy", email: "emma.leroy@example.fr" },
    { name: "Antoine Simon", email: "antoine.simon@example.fr" },
    { name: "Chloé Michel", email: "chloe.michel@example.fr" },
    { name: "Maxime Durand", email: "maxime.durand@example.fr" },
  ];

  const users = await Promise.all(
    usersData.map((u) =>
      prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: hashedPassword,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
          emailVerified: new Date(),
        },
      })
    )
  );

  console.log(`✅ ${users.length} utilisateurs créés`);

  // ─── 2. Créer 25 logements ──────────────────────────────────────────────────
  console.log("🏠 Création des logements...");

  const listings = await Promise.all(
    LISTINGS_DATA.map((listingData, index) => {
      const hostIndex = index % users.length;
      const imageSet = UNSPLASH_IMAGES[listingData.imageKey as keyof typeof UNSPLASH_IMAGES];

      // Sélectionner 3 images différentes pour chaque logement
      const images = JSON.stringify([
        imageSet[0],
        imageSet[1 % imageSet.length],
        imageSet[2 % imageSet.length],
      ]);

      // Sélectionner 5-8 équipements aléatoires + les équipements spécifiques
      const specificAmenities = listingData.amenities;
      const extraAmenities = faker.helpers
        .arrayElements(
          AMENITIES_POOL.filter((a) => !specificAmenities.includes(a)),
          faker.number.int({ min: 1, max: 3 })
        );
      const allAmenities = [...new Set([...specificAmenities, ...extraAmenities])];

      return prisma.listing.create({
        data: {
          title: listingData.title,
          description: listingData.description,
          price: listingData.price,
          location: listingData.location,
          city: listingData.city,
          country: listingData.country,
          latitude: listingData.latitude,
          longitude: listingData.longitude,
          images: images,
          amenities: JSON.stringify(allAmenities),
          maxGuests: listingData.maxGuests,
          bedrooms: listingData.bedrooms,
          beds: listingData.beds,
          bathrooms: listingData.bathrooms,
          hostId: users[hostIndex].id,
        },
      });
    })
  );

  console.log(`✅ ${listings.length} logements créés`);

  // ─── 3. Créer 50 réservations historiques ───────────────────────────────────
  console.log("📅 Création des réservations...");

  const bookings: Array<{ id: string; listingId: string; userId: string; checkIn: Date; checkOut: Date; guests: number; totalPrice: number; status: string }> = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const listing = listings[i % listings.length];

    // Trouver un utilisateur qui n'est pas l'hôte du logement
    const availableGuests = users.filter((u) => u.id !== listing.hostId);
    const guest = availableGuests[i % availableGuests.length];

    // Dates dans le passé récent (1 à 18 mois en arrière)
    const daysBack = faker.number.int({ min: 14, max: 540 });
    const checkIn = new Date(now);
    checkIn.setDate(checkIn.getDate() - daysBack);
    checkIn.setHours(14, 0, 0, 0); // Check-in à 14h

    const stayDuration = faker.number.int({ min: 2, max: 14 });
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + stayDuration);
    checkOut.setHours(11, 0, 0, 0); // Check-out à 11h

    const guests = faker.number.int({ min: 1, max: listing.maxGuests });
    const totalPrice = listing.price * stayDuration;

    // Statut : 80% completed (passé), 15% confirmed, 5% cancelled
    const statusRoll = Math.random();
    const status =
      statusRoll < 0.80 ? "completed" : statusRoll < 0.95 ? "confirmed" : "cancelled";

    const booking = await prisma.booking.create({
      data: {
        listingId: listing.id,
        userId: guest.id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status,
        createdAt: new Date(checkIn.getTime() - faker.number.int({ min: 1, max: 30 }) * 24 * 60 * 60 * 1000),
      },
    });

    bookings.push(booking);
  }

  console.log(`✅ ${bookings.length} réservations créées`);

  // ─── 4. Créer 100 avis et notes ─────────────────────────────────────────────
  console.log("⭐ Création des avis...");

  // Sélectionner les réservations "completed" pour les avis
  const completedBookings = bookings.filter((b) => b.status === "completed");

  // On crée des avis pour ~100 des réservations completées (certaines avec 2 avis si besoin)
  let reviewCount = 0;
  const reviewedBookings = new Set<string>();

  // D'abord, un avis par réservation complétée
  for (const booking of completedBookings) {
    if (reviewCount >= 100) break;
    if (reviewedBookings.has(booking.id)) continue;

    const rating = faker.number.int({ min: 3, max: 5 }); // Tendance positive
    const comment = REVIEW_COMMENTS[reviewCount % REVIEW_COMMENTS.length];

    await prisma.review.create({
      data: {
        listingId: booking.listingId,
        userId: booking.userId,
        bookingId: booking.id,
        rating,
        comment,
        createdAt: new Date(
          booking.checkOut.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000
        ),
      },
    });

    reviewedBookings.add(booking.id);
    reviewCount++;
  }

  // Si moins de 100 avis, en ajouter d'autres sur les mêmes réservations (hôtes notant aussi)
  // en créant de nouvelles réservations fantômes pour atteindre 100
  if (reviewCount < 100) {
    // Créer des réservations supplémentaires pour avoir assez d'avis
    const extraNeeded = 100 - reviewCount;
    const extraBookings: Array<{ id: string; listingId: string; userId: string; checkIn: Date; checkOut: Date }> = [];

    for (let i = 0; i < extraNeeded; i++) {
      const listing = listings[(completedBookings.length + i) % listings.length];
      const availableGuests = users.filter((u) => u.id !== listing.hostId);
      const guest = availableGuests[(completedBookings.length + i) % availableGuests.length];

      const daysBack = faker.number.int({ min: 60, max: 720 });
      const checkIn = new Date(now);
      checkIn.setDate(checkIn.getDate() - daysBack);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + faker.number.int({ min: 2, max: 10 }));

      const extraBooking = await prisma.booking.create({
        data: {
          listingId: listing.id,
          userId: guest.id,
          checkIn,
          checkOut,
          guests: faker.number.int({ min: 1, max: listing.maxGuests }),
          totalPrice: listing.price * faker.number.int({ min: 2, max: 10 }),
          status: "completed",
          createdAt: new Date(checkIn.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      });

      extraBookings.push(extraBooking);
      bookings.push(extraBooking);
    }

    for (let i = 0; i < extraBookings.length && reviewCount < 100; i++) {
      const booking = extraBookings[i];
      const rating = faker.number.int({ min: 3, max: 5 });
      const comment = REVIEW_COMMENTS[(reviewCount) % REVIEW_COMMENTS.length];

      await prisma.review.create({
        data: {
          listingId: booking.listingId,
          userId: booking.userId,
          bookingId: booking.id,
          rating,
          comment,
          createdAt: new Date(
            booking.checkOut.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000
          ),
        },
      });

      reviewCount++;
    }
  }

  console.log(`✅ ${reviewCount} avis créés`);

  // ─── 5. Créer quelques messages ──────────────────────────────────────────────
  console.log("💬 Création des messages...");

  const messageContents = [
    "Bonjour, votre réservation est confirmée. Voici les instructions d'arrivée...",
    "Merci pour votre réservation ! N'hésitez pas si vous avez des questions.",
    "Pourriez-vous arriver entre 15h et 19h ? La boîte à clés est au code 1234.",
    "Bonjour, tout s'est bien passé ? Y a-t-il quelque chose que je puisse faire ?",
    "Merci pour votre accueil chaleureux ! Le logement était parfait.",
    "Nous avons adoré notre séjour. À bientôt !",
    "La check-out est à 11h. Pouvez-vous laisser les clés sur la table ?",
    "Bien reçu, merci ! On laissera les clés comme convenu.",
  ];

  let messageCount = 0;
  const bookingsForMessages = bookings.slice(0, 20); // 20 premières réservations

  for (const booking of bookingsForMessages) {
    const listing = listings.find((l) => l.id === booking.listingId);
    if (!listing) continue;

    const host = users.find((u) => u.id === listing.hostId);
    const guest = users.find((u) => u.id === booking.userId);
    if (!host || !guest) continue;

    // 2 messages par réservation
    await prisma.message.create({
      data: {
        bookingId: booking.id,
        senderId: host.id,
        recipientId: guest.id,
        content: messageContents[messageCount % 4],
        read: true,
        createdAt: new Date(booking.checkIn.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    });
    messageCount++;

    await prisma.message.create({
      data: {
        bookingId: booking.id,
        senderId: guest.id,
        recipientId: host.id,
        content: messageContents[(messageCount % 4) + 4],
        read: false,
        createdAt: new Date(booking.checkIn.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    });
    messageCount++;
  }

  console.log(`✅ ${messageCount} messages créés`);

  // ─── Résumé final ────────────────────────────────────────────────────────────
  const totalBookings = await prisma.booking.count();
  console.log("\n🎉 Seed terminé avec succès !");
  console.log(`   👤 Utilisateurs : ${users.length}`);
  console.log(`   🏠 Logements    : ${listings.length}`);
  console.log(`   📅 Réservations : ${totalBookings}`);
  console.log(`   ⭐ Avis         : ${reviewCount}`);
  console.log(`   💬 Messages     : ${messageCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
