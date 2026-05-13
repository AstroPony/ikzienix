import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connStr = process.env.ikzienix_db_POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;
const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const PRODUCTS_DIR = path.resolve(process.cwd(), '..', 'Products');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public', 'images', 'products');

async function run() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const products = await prisma.product.findMany({
    select: { slug: true, pairNumber: true, name: true },
    orderBy: { pairNumber: 'asc' },
  });

  console.log(`\nCopying photos for ${products.length} products...\n`);

  let updated = 0;

  for (const { slug, pairNumber, name } of products) {
    const src = path.join(PRODUCTS_DIR, slug);
    if (!fs.existsSync(src)) {
      console.log(`  · #${String(pairNumber ?? '?').padStart(2, '0')} ${name} — folder not found, skipping`);
      continue;
    }

    const files = fs.readdirSync(src)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();

    if (files.length === 0) {
      console.log(`  · #${String(pairNumber ?? '?').padStart(2, '0')} ${name} — no images, skipping`);
      continue;
    }

    const dest = path.join(PUBLIC_DIR, slug);
    fs.mkdirSync(dest, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
      urls.push(`/images/products/${slug}/${file}`);
    }

    await prisma.product.update({ where: { slug }, data: { images: urls } });
    console.log(`  ✓ #${String(pairNumber ?? '?').padStart(2, '0')} ${name} — ${urls.length} image(s) copied`);
    updated++;
  }

  await pool.end();
  console.log(`\nDone. ${updated} products updated.`);
  console.log(`Images written to: public/images/products/`);
  console.log(`Deploy with: vercel --prod`);
}

run().catch(e => { console.error(e); process.exit(1); });
