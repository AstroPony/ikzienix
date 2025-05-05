import { PrismaClient } from '@prisma/client';
import { db } from '../src/lib/firebase-admin';

const prisma = new PrismaClient();

async function migrateToFirebase() {
  try {
    console.log('Starting migration to Firebase...');

    // Migrate Users
    console.log('Migrating users...');
    const users = await prisma.user.findMany();
    for (const user of users) {
      await db.collection('users').doc(user.id).set({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    // Migrate Products
    console.log('Migrating products...');
    const products = await prisma.product.findMany();
    for (const product of products) {
      await db.collection('products').doc(product.id).set({
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        featured: product.featured,
        new: product.new,
        sale: product.sale,
        quantity: product.quantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }

    // Migrate Orders
    console.log('Migrating orders...');
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        shippingAddress: true,
      },
    });
    for (const order of orders) {
      await db.collection('orders').doc(order.id).set({
        userId: order.userId,
        status: order.status,
        total: order.total,
        paymentIntentId: order.paymentIntentId,
        items: order.items,
        shippingAddress: order.shippingAddress,
        shippingMethod: order.shippingMethod,
        shippingCost: order.shippingCost,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    }

    // Migrate Settings
    console.log('Migrating settings...');
    const settings = await prisma.settings.findFirst();
    if (settings) {
      await db.collection('settings').doc('1').set({
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
        currency: settings.currency,
        taxRate: settings.taxRate,
        shippingFee: settings.shippingFee,
        orderEmailNotifications: settings.orderEmailNotifications,
        lowStockThreshold: settings.lowStockThreshold,
        maintenanceMode: settings.maintenanceMode,
        updatedAt: settings.updatedAt,
      });
    }

    // Migrate Analytics
    console.log('Migrating analytics...');
    const analytics = await prisma.analytics.findMany();
    for (const analytic of analytics) {
      await db.collection('analytics').doc(analytic.id).set({
        date: analytic.date,
        revenue: analytic.revenue,
        orders: analytic.orders,
        visitors: analytic.visitors,
        newUsers: analytic.newUsers,
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToFirebase(); 