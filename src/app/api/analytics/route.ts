import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface GroupedData {
  productId: string
  _sum: {
    quantity: number | null
  }
}

interface DailyData {
  createdAt: Date
  _sum: {
    total: number | null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '7d'

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    // Get current period data
    const [
      currentRevenue,
      currentOrders,
      currentVisitors,
      currentNewUsers,
      salesByCategory,
      topProducts,
      dailyRevenue,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.analytics.aggregate({
        where: {
          date: { gte: startDate },
        },
        _sum: {
          visitors: true,
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            createdAt: { gte: startDate },
          },
        },
        _sum: {
          quantity: true,
        },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            createdAt: { gte: startDate },
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate },
        },
        _sum: {
          total: true,
        },
      }),
    ])

    // Get previous period data for comparison
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - days)

    const [
      previousRevenue,
      previousOrders,
      previousVisitors,
      previousNewUsers,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      }),
      prisma.analytics.aggregate({
        where: {
          date: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
        _sum: {
          visitors: true,
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lt: startDate,
          },
        },
      }),
    ])

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) =>
      previous === 0 ? 100 : ((current - previous) / previous) * 100

    const revenue = currentRevenue._sum.total || 0
    const previousRevenueValue = previousRevenue._sum.total || 0
    const revenueChange = calculateChange(revenue, previousRevenueValue)

    const orders = currentOrders
    const ordersChange = calculateChange(orders, previousOrders)

    const visitors = currentVisitors._sum.visitors || 0
    const previousVisitorsValue = previousVisitors._sum.visitors || 0
    const visitorsChange = calculateChange(visitors, previousVisitorsValue)

    const newUsers = currentNewUsers
    const newUsersChange = calculateChange(newUsers, previousNewUsers)

    // Format sales by category
    const salesByCategoryFormatted = salesByCategory.reduce(
      (acc: Record<string, number>, { productId, _sum }: GroupedData) => ({
        ...acc,
        [productId]: _sum.quantity || 0,
      }),
      {}
    )

    // Format top products
    const topProductsFormatted = await Promise.all(
      topProducts.map(async ({ productId, _sum }: GroupedData) => {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })
        return {
          name: product?.name || 'Unknown',
          sales: _sum.quantity || 0,
        }
      })
    )

    // Format daily revenue
    const dailyRevenueFormatted = dailyRevenue.map(
      ({ createdAt, _sum }: DailyData) => ({
        date: createdAt.toISOString().split('T')[0],
        revenue: _sum.total || 0,
      })
    )

    return NextResponse.json({
      revenue,
      orders,
      visitors,
      newUsers,
      revenueChange,
      ordersChange,
      visitorsChange,
      newUsersChange,
      salesByCategory: salesByCategoryFormatted,
      topProducts: topProductsFormatted,
      dailyRevenue: dailyRevenueFormatted,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return new NextResponse('Error fetching analytics', { status: 500 })
  }
} 