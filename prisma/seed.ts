import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Placeholder images — replace per product once real photos are shot.
// No text param — avoids Next.js image optimizer URL encoding issues.
const img = (shade = '111111') =>
  `https://placehold.co/600x600/${shade}/c8f135.png`;

const products = [
  // ── Wayfarer ──────────────────────────────────────────────
  {
    pairNumber: 1,
    name: 'Shadow Classic',
    slug: 'shadow-classic',
    description: 'Clean wayfarer. Timeless silhouette. Zero effort required.',
    price: 2999,
    stock: 1,
    images: [img()],
    category: 'wayfarer',
    isLimited: false,
  },
  {
    pairNumber: 6,
    name: 'The Default',
    slug: 'the-default',
    description: 'The wayfarer you actually reach for.',
    price: 2799,
    stock: 1,
    images: [img('0f0f0f')],
    category: 'wayfarer',
    isLimited: false,
  },
  {
    pairNumber: 7,
    name: 'Zero',
    slug: 'zero',
    description: 'Ultra-thin frame. Maximum nothing.',
    price: 2599,
    stock: 1,
    images: [img('141414')],
    category: 'wayfarer',
    isLimited: false,
  },
  {
    pairNumber: 8,
    name: 'Flat Black',
    slug: 'flat-black',
    description: 'Matte finish. No glare. No apologies.',
    price: 2899,
    stock: 1,
    images: [img('0a0a0a')],
    category: 'wayfarer',
    isLimited: false,
  },
  {
    pairNumber: 9,
    name: 'Frame',
    slug: 'frame',
    description: 'Thin wire frame. Less is more.',
    price: 2699,
    stock: 1,
    images: [img('0d0d0d')],
    category: 'wayfarer',
    isLimited: false,
  },

  // ── Oversized ─────────────────────────────────────────────
  {
    pairNumber: 2,
    name: 'Oversized Void',
    slug: 'oversized-void',
    description: 'Wear your whole face. Amsterdam-approved.',
    price: 3299,
    stock: 1,
    images: [img()],
    category: 'oversized',
    isLimited: false,
  },
  {
    pairNumber: 10,
    name: 'Wide Load',
    slug: 'wide-load',
    description: 'Maximum coverage. Minimum visibility.',
    price: 3199,
    stock: 1,
    images: [img('131313')],
    category: 'oversized',
    isLimited: false,
  },
  {
    pairNumber: 11,
    name: 'The Block',
    slug: 'the-block',
    description: 'Square. Bold. Takes up space on purpose.',
    price: 3299,
    stock: 1,
    images: [img('0e0e0e')],
    category: 'oversized',
    isLimited: false,
  },
  {
    pairNumber: 12,
    name: 'Low Profile',
    slug: 'low-profile',
    description: 'Oversized but quiet about it.',
    price: 2999,
    stock: 1,
    images: [img('121212')],
    category: 'oversized',
    isLimited: false,
  },
  {
    pairNumber: 13,
    name: 'Signal',
    slug: 'signal',
    description: 'Bold tint. You are the broadcast.',
    price: 3399,
    stock: 1,
    images: [img('0c0c0c')],
    category: 'oversized',
    isLimited: false,
  },

  // ── Sporty / Wrap ─────────────────────────────────────────
  {
    pairNumber: 4,
    name: 'Sport Wrap',
    slug: 'sport-wrap',
    description: 'Built for the skatepark. Acceptable at brunch.',
    price: 3199,
    stock: 1,
    images: [img()],
    category: 'sporty',
    isLimited: false,
  },
  {
    pairNumber: 14,
    name: 'Circuit',
    slug: 'circuit',
    description: 'Full wrap. Wind resistant. Speed optional.',
    price: 2999,
    stock: 1,
    images: [img('101010')],
    category: 'sporty',
    isLimited: false,
  },
  {
    pairNumber: 15,
    name: 'Track',
    slug: 'track',
    description: 'Lightweight. Stays on when things get fast.',
    price: 2799,
    stock: 1,
    images: [img('0f0f0f')],
    category: 'sporty',
    isLimited: false,
  },
  {
    pairNumber: 16,
    name: 'Flex',
    slug: 'flex',
    description: 'Flexible frame. Does not break under pressure.',
    price: 3099,
    stock: 1,
    images: [img('141414')],
    category: 'sporty',
    isLimited: false,
  },
  {
    pairNumber: 17,
    name: 'Node',
    slug: 'node',
    description: 'Technical frame. Looks like it does something.',
    price: 3199,
    stock: 1,
    images: [img('0d0d0d')],
    category: 'sporty',
    isLimited: false,
  },

  // ── Retro / Round ─────────────────────────────────────────
  {
    pairNumber: 3,
    name: 'Retro Arc',
    slug: 'retro-arc',
    description: 'Round. Small. Slightly unhinged. Very on-brand.',
    price: 2799,
    stock: 1,
    images: [img()],
    category: 'round',
    isLimited: false,
  },
  {
    pairNumber: 18,
    name: 'Dot',
    slug: 'dot',
    description: 'Tiny rounds. Big personality. Small face welcome.',
    price: 2499,
    stock: 1,
    images: [img('131313')],
    category: 'round',
    isLimited: false,
  },
  {
    pairNumber: 19,
    name: 'Orbit',
    slug: 'orbit',
    description: 'Medium round. The sweet spot.',
    price: 2699,
    stock: 1,
    images: [img('0e0e0e')],
    category: 'round',
    isLimited: false,
  },
  {
    pairNumber: 20,
    name: 'Small Hours',
    slug: 'small-hours',
    description: 'Delicate frame. Loud attitude.',
    price: 2599,
    stock: 1,
    images: [img('121212')],
    category: 'round',
    isLimited: false,
  },
  {
    pairNumber: 21,
    name: 'Lens',
    slug: 'lens',
    description: 'Thick acetate round. Art school approved.',
    price: 2899,
    stock: 1,
    images: [img('0c0c0c')],
    category: 'round',
    isLimited: false,
  },

  // ── Statement ─────────────────────────────────────────────
  {
    pairNumber: 5,
    name: 'The Statement',
    slug: 'the-statement',
    description: 'Not subtle. Not sorry. Pure ikzienix energy.',
    price: 3499,
    stock: 1,
    images: [img()],
    category: 'statement',
    isLimited: true,
  },
  {
    pairNumber: 22,
    name: 'Glitch',
    slug: 'glitch',
    description: 'Something went right.',
    price: 3499,
    stock: 1,
    images: [img('0f0f0f')],
    category: 'statement',
    isLimited: true,
  },
  {
    pairNumber: 23,
    name: 'Error',
    slug: 'error',
    description: 'Unexpected. Unresolved. Unwearable by cowards.',
    price: 3399,
    stock: 1,
    images: [img('101010')],
    category: 'statement',
    isLimited: true,
  },
  {
    pairNumber: 24,
    name: 'Patch Notes',
    slug: 'patch-notes',
    description: 'Fixed nothing. Shipped anyway.',
    price: 3599,
    stock: 1,
    images: [img('0d0d0d')],
    category: 'statement',
    isLimited: true,
  },
  {
    pairNumber: 25,
    name: 'Null',
    slug: 'null',
    description: 'Pair #25. The last one. Make it count.',
    price: 2999,
    stock: 1,
    images: [img('0a0a0a')],
    category: 'statement',
    isLimited: true,
  },
];

async function main() {
  console.log(`Seeding ${products.length} beta products...\n`);

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.log(`  ✓ #${String(product.pairNumber).padStart(2, '0')} — ${product.name}`);
  }

  console.log(`\n✓ All ${products.length} pairs seeded. Beta drop ready.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
