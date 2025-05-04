import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const prismaClient = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const data = await request.json()
    const { name, email, role, password } = data

    // Validate required fields
    if (!name || !email || !role) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check if email is taken by another user
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email,
        NOT: {
          id: id,
        },
      },
    })

    if (existingUser) {
      return new NextResponse('Email already taken', { status: 400 })
    }

    // Update user
    const updateData: any = {
      name,
      email,
      role,
    }

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prismaClient.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update user' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: { id },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await prismaClient.user.count({
        where: { role: 'admin' },
      })

      if (adminCount <= 1) {
        return new NextResponse(
          'Cannot delete the last admin user',
          { status: 400 }
        )
      }
    }

    // Delete user
    await prismaClient.user.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete user' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 