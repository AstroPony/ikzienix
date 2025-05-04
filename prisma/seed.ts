import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Create initial settings
  await prisma.settings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      storeName: 'My E-commerce Store',
      storeEmail: 'store@example.com',
      currency: 'USD',
      taxRate: 0,
      shippingFee: 0,
      orderEmailNotifications: true,
      lowStockThreshold: 5,
      maintenanceMode: false,
    },
  })

  console.log('Database has been seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 