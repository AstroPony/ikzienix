import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // TODO: Add authentication and get user ID from session
    const orders = await prisma.order.findMany({
      where: {
        // userId: session.user.id, // Uncomment when auth is implemented
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items, paymentIntentId } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'No payment intent ID provided' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        // userId: session.user.id, // Uncomment when auth is implemented
        total,
        status: 'pending',
        paymentIntentId,
        items: {
          create: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
} 