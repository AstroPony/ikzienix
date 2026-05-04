/**
 * update-photos.ts
 *
 * Scans public/images/products/ for image files, matches them to products
 * by slug, and updates the database images array.
 *
 * Run with: npm run photos:update
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'images', 'products');
const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp'];

function getImagesForSlug(slug: string): string[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  const files = fs.readdirSync(PRODUCTS_DIR);

  // Hero image: exact slug match (e.g. shadow-classic.jpg)
  // Extra images: slug-2.jpg, slug-3.jpg, etc.
  const matched = files
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      const base = path.basename(f, ext);
      return SUPPORTED.includes(ext) && (base === slug || base.match(new RegExp(`^${slug}-\\d+$`)));
    })
    .sort((a, b) => {
      // Hero first, then numbered extras
      const baseA = path.basename(a, path.extname(a));
      const baseB = path.basename(b, path.extname(b));
      if (baseA === slug) return -1;
      if (baseB === slug) return 1;
      return baseA.localeCompare(baseB);
    })
    .map((f) => `/images/products/${f}`);

  return matched;
}

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { pairNumber: 'asc' },
  });

  console.log(`\nScanning public/images/products/ for ${products.length} products...\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const images = getImagesForSlug(product.slug);

    if (images.length === 0) {
      console.log(`  · #${String(product.pairNumber ?? '?').padStart(2, '0')} ${product.name.padEnd(20)} — no photo yet, keeping placeholder`);
      skipped++;
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { images },
    });

    const extras = images.length > 1 ? ` (+ ${images.length - 1} extra)` : '';
    console.log(`  ✓ #${String(product.pairNumber ?? '?').padStart(2, '0')} ${product.name.padEnd(20)} → ${images[0]}${extras}`);
    updated++;
  }

  console.log(`\n${updated} updated · ${skipped} still using placeholder\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
