import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orderDoc = await db.collection('orders').doc(params.id).get()
    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const orderData = orderDoc.data()
    if (!orderData) {
      return NextResponse.json(
        { error: 'Order data not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to view this order
    if (orderData.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user data
    const userDoc = await db.collection('users').doc(orderData.userId).get()
    const userData = userDoc.data()

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
      items: itemsWithProducts,
      user: {
        name: userData?.name,
        email: userData?.email
      }
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { status } = await req.json()
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const orderRef = db.collection('orders').doc(params.id)
    const orderDoc = await orderRef.get()

    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    await orderRef.update({
      status,
      updatedAt: new Date()
    })

    const updatedOrderDoc = await orderRef.get()
    const orderData = updatedOrderDoc.data()
    if (!orderData) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    // Get user data
    const userDoc = await db.collection('users').doc(orderData.userId).get()
    const userData = userDoc.data()

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
      id: updatedOrderDoc.id,
      ...orderData,
      items: itemsWithProducts,
      user: {
        name: userData?.name,
        email: userData?.email
      }
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orderRef = db.collection('orders').doc(params.id)
    const orderDoc = await orderRef.get()

    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    await orderRef.delete()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    )
  }
} 