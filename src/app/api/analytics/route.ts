import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface Order {
  id: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: { seconds: number }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all orders
    const ordersRef = db.collection('orders')
    const ordersSnapshot = await ordersRef.get()
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[]

    // Get all users
    const usersRef = db.collection('users')
    const usersSnapshot = await usersRef.get()
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Calculate total revenue (including pending orders)
    const totalRevenue = orders.reduce((sum, order: any) => {
      return (order.status === 'paid' || order.status === 'pending') ? sum + order.total : sum
    }, 0)

    // Calculate total orders (including pending orders)
    const totalOrders = orders.length

    // Calculate total users
    const totalUsers = users.length

    // Group orders by product to find top selling products
    const productSales: { [key: string]: number } = {}
    const productRevenue: { [key: string]: number } = {}

    for (const order of orders) {
      if (order.status === 'paid' || order.status === 'pending') {
        for (const item of order.items) {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity
          productRevenue[item.productId] = (productRevenue[item.productId] || 0) + (item.price * item.quantity)
        }
      }
    }

    // Get product details for top selling products
    const topSellingProducts = await Promise.all(
      Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(async ([productId, quantity]) => {
          const productDoc = await db.collection('products').doc(productId).get()
          const productData = productDoc.data()
          return {
            name: productData?.name || 'Unknown Product',
            sales: quantity
          }
        })
    )

    // Group orders by date to calculate daily sales
    const dailySales = orders.reduce((acc: any, order: any) => {
      if (order.status === 'paid' || order.status === 'pending') {
        const date = new Date(order.createdAt.seconds * 1000).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + order.total
      }
      return acc
    }, {})

    // Convert daily sales to array and sort by date
    const dailyRevenue = Object.entries(dailySales)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate sales by category
    const salesByCategory: Record<string, number> = {}
    for (const order of orders) {
      if (order.status === 'paid' || order.status === 'pending') {
        for (const item of order.items) {
          const productDoc = await db.collection('products').doc(item.productId).get()
          const productData = productDoc.data()
          const category = productData?.category || 'Uncategorized'
          salesByCategory[category] = (salesByCategory[category] || 0) + (item.price * item.quantity)
        }
      }
    }

    return NextResponse.json({
      revenue: totalRevenue,
      orders: totalOrders,
      visitors: totalUsers,
      newUsers: totalUsers,
      revenueChange: 0, // You can implement this based on previous period
      ordersChange: 0, // You can implement this based on previous period
      visitorsChange: 0, // You can implement this based on previous period
      newUsersChange: 0, // You can implement this based on previous period
      salesByCategory,
      topProducts: topSellingProducts,
      dailyRevenue
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 