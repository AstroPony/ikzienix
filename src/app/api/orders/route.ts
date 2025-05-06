import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const ordersRef = db.collection('orders')
    let query = ordersRef.orderBy('createdAt', 'desc')

    // If not admin, only show user's orders
    if (session.user.role !== 'admin') {
      query = query.where('userId', '==', session.user.id)
    }

    const snapshot = await query.get()
    const orders = await Promise.all(snapshot.docs.map(async doc => {
      const orderData = doc.data()
      
      // Get product data for each item
      const itemsWithProducts = await Promise.all(orderData.items.map(async (item: any) => {
        const productDoc = await db.collection('products').doc(item.productId).get()
        return {
          ...item,
          product: {
            id: productDoc.id,
            ...productDoc.data()
          }
        }
      }))

      // Get user data if admin
      let userData = null
      if (session.user.role === 'admin') {
        const userDoc = await db.collection('users').doc(orderData.userId).get()
        userData = userDoc.data()
      }

      return {
        id: doc.id,
        ...orderData,
        items: itemsWithProducts,
        user: userData ? {
          name: userData.name,
          email: userData.email
        } : undefined
      }
    }))

    return NextResponse.json(orders)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
    const orderRef = await db.collection('orders').add({
      userId: session.user.id,
      total,
      status: 'pending',
      paymentIntentId,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Get the created order with all its data
    const orderDoc = await orderRef.get()
    const orderData = orderDoc.data()
    
    if (!orderData) {
      throw new Error('Failed to create order')
    }

    // Get product data for each item
    const itemsWithProducts = await Promise.all(orderData.items.map(async (item: any) => {
      const productDoc = await db.collection('products').doc(item.productId).get()
      return {
        ...item,
        product: {
          id: productDoc.id,
          ...productDoc.data()
        }
      }
    }))

    const order = {
      id: orderDoc.id,
      ...orderData,
      items: itemsWithProducts
    }

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
} 