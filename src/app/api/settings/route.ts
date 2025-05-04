import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings || {
      storeName: '',
      storeEmail: '',
      currency: 'USD',
      taxRate: 0,
      shippingFee: 0,
      orderEmailNotifications: true,
      lowStockThreshold: 5,
      maintenanceMode: false,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return new NextResponse('Error fetching settings', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const {
      storeName,
      storeEmail,
      currency,
      taxRate,
      shippingFee,
      orderEmailNotifications,
      lowStockThreshold,
      maintenanceMode,
    } = data

    // Validate required fields
    if (!storeName || !storeEmail || !currency) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: {
        id: '1', // We only have one settings record
      },
      update: {
        storeName,
        storeEmail,
        currency,
        taxRate,
        shippingFee,
        orderEmailNotifications,
        lowStockThreshold,
        maintenanceMode,
      },
      create: {
        id: '1',
        storeName,
        storeEmail,
        currency,
        taxRate,
        shippingFee,
        orderEmailNotifications,
        lowStockThreshold,
        maintenanceMode,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return new NextResponse('Error updating settings', { status: 500 })
  }
} 