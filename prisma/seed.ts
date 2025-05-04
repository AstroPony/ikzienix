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
      role: 'ADMIN',
    },
  })

  // Create guest user for anonymous orders
  await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      id: 'guest',
      email: 'guest@example.com',
      name: 'Guest User',
      password: await bcrypt.hash('guest123', 10),
      role: 'user',
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

  // Create sample products
  const products = [
    // Featured Products
    {
      name: 'Aviator Silver',
      description: 'Classic aviator sunglasses with silver frame and polarized lenses.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Sunglasses',
      inStock: true,
      featured: true,
    },
    {
      name: 'Retro Gold',
      description: 'Vintage-inspired round sunglasses with gold frame.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D',
      category: 'Sunglasses',
      inStock: true,
      featured: true,
    },
    {
      name: 'Eco Green',
      description: 'Sustainable sunglasses made from recycled materials.',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Sunglasses',
      inStock: true,
      featured: true,
    },
    // New Arrivals
    {
      name: 'Sport Shield Pro',
      description: 'Professional sports sunglasses with impact-resistant lenses.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNwb3J0JTIwc3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D',
      category: 'Sports',
      inStock: true,
      featured: false,
      new: true,
    },
    {
      name: 'Urban Matte Black',
      description: 'Modern matte black sunglasses with UV400 protection.',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Urban',
      inStock: true,
      featured: false,
      new: true,
    },
    // Sale Items
    {
      name: 'Classic Tortoise',
      description: 'Timeless tortoise shell sunglasses with polarized lenses.',
      price: 149.99,
      salePrice: 99.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D',
      category: 'Classic',
      inStock: true,
      featured: false,
      sale: true,
    },
    {
      name: 'Polarized Blue',
      description: 'Blue polarized lenses for enhanced clarity and reduced glare.',
      price: 119.99,
      salePrice: 79.99,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Polarized',
      inStock: true,
      featured: false,
      sale: true,
    },
    // Regular Products
    {
      name: 'Wayfarer Classic',
      description: 'Iconic wayfarer design with UV400 protection.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Classic',
      inStock: true,
      featured: false,
    },
    {
      name: 'Round Brown',
      description: 'Trendy round sunglasses with brown frame.',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D',
      category: 'Round',
      inStock: true,
      featured: false,
    },
    {
      name: 'Cat Eye Black',
      description: 'Elegant cat eye sunglasses in black.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D',
      category: 'Cat Eye',
      inStock: true,
      featured: false,
    },
  ]

  try {
    // Delete existing data in the correct order
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    // Create new products
    for (const product of products) {
      await prisma.product.create({
        data: product,
      })
    }

    console.log('Database has been seeded.')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 