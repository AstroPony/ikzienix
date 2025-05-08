import { db, auth } from '@/lib/firebase-admin'

async function seed() {
  try {
    console.log('Starting Firebase seed...')

    // Create admin user if it doesn't exist
    let adminUser
    try {
      adminUser = await auth.getUserByEmail('admin@example.com')
      console.log('Admin user already exists')
    } catch (error) {
      adminUser = await auth.createUser({
        email: 'admin@example.com',
        password: 'admin123',
        displayName: 'Admin User'
      })
      console.log('Created admin user')
    }

    // Create admin user document if it doesn't exist
    const adminDoc = await db.collection('users').doc(adminUser.uid).get()
    if (!adminDoc.exists) {
      await db.collection('users').doc(adminUser.uid).set({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Created admin user document')
    } else {
      console.log('Admin user document already exists')
    }

    // Create regular user if it doesn't exist
    let regularUser
    try {
      regularUser = await auth.getUserByEmail('user@example.com')
      console.log('Regular user already exists')
    } catch (error) {
      regularUser = await auth.createUser({
        email: 'user@example.com',
        password: 'user123',
        displayName: 'Regular User'
      })
      console.log('Created regular user')
    }

    // Create regular user document if it doesn't exist
    const regularDoc = await db.collection('users').doc(regularUser.uid).get()
    if (!regularDoc.exists) {
      await db.collection('users').doc(regularUser.uid).set({
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Created regular user document')
    } else {
      console.log('Regular user document already exists')
    }

    // Create sample products
    const products = [
      {
        name: 'Classic Black',
        description: 'Timeless black sunglasses with UV400 protection and lightweight frame.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'classic',
        inStock: true,
        featured: true,
        new: false,
        sale: false,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Retro Round',
        description: 'Vintage-inspired round sunglasses perfect for any occasion.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'retro',
        inStock: true,
        featured: true,
        new: true,
        sale: false,
        stock: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sport Shield',
        description: 'Performance sunglasses designed for active lifestyles.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'sport',
        inStock: true,
        featured: false,
        new: false,
        sale: false,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aviator Gold',
        description: 'Classic aviator style with gold-tone frame and mirrored lenses.',
        price: 44.99,
        image: 'https://images.unsplash.com/photo-1565616261009-68c3ef5b9c7d?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'aviator',
        inStock: true,
        featured: true,
        new: false,
        sale: true,
        salePrice: 39.99,
        stock: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cat Eye Black',
        description: 'Feminine cat-eye sunglasses with a modern twist.',
        price: 32.99,
        image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'cat-eye',
        inStock: true,
        featured: false,
        new: true,
        sale: false,
        stock: 45,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wayfarer Classic',
        description: 'Iconic wayfarer design with polarized lenses.',
        price: 37.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'wayfarer',
        inStock: true,
        featured: true,
        new: false,
        sale: false,
        stock: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Festival Neon',
        description: 'Bold and colorful frames perfect for festivals and parties.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'festival',
        inStock: true,
        featured: true,
        new: true,
        sale: false,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Urban Square',
        description: 'Modern square frames with gradient lenses.',
        price: 42.99,
        image: 'https://images.unsplash.com/photo-1546180245-c59500ad14d0?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'urban',
        inStock: true,
        featured: false,
        new: true,
        sale: false,
        stock: 55,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eco Bamboo',
        description: 'Sustainable sunglasses made from bamboo with polarized lenses.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'eco',
        inStock: true,
        featured: true,
        new: true,
        sale: false,
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kids Fun',
        description: 'Colorful and durable sunglasses for children.',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1533511627347-4d1b893e1ad9?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1584036553516-5d8c4d9aa0b4?auto=format&fit=crop&w=800&q=80'
        ],
        category: 'kids',
        inStock: true,
        featured: false,
        new: false,
        sale: true,
        salePrice: 19.99,
        stock: 70,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Delete existing products
    const existingProducts = await db.collection('products').get()
    const batch = db.batch()
    existingProducts.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
    console.log('Deleted existing products')

    // Add new products
    for (const product of products) {
      await db.collection('products').add(product)
      console.log('Created product:', product.name)
    }

    // Create global settings if they don't exist
    const settingsDoc = await db.collection('settings').doc('global').get()
    if (!settingsDoc.exists) {
      await db.collection('settings').doc('global').set({
        storeName: 'Ikzienix',
        storeEmail: 'store@ikzienix.com',
        currency: 'USD',
        taxRate: 0.1,
        shippingFee: 5.99,
        orderEmailNotifications: true,
        lowStockThreshold: 5,
        maintenanceMode: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Created global settings')
    } else {
      console.log('Global settings already exist')
    }

    console.log('Firebase seed completed successfully!')
  } catch (error) {
    console.error('Error seeding Firebase:', error)
    process.exit(1)
  }
}

seed() 