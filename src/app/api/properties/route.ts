import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  city: z.string().min(1, 'City is required'),
  rentAmount: z.number().positive('Rent amount must be positive'),
  propertyType: z.enum(['COWORKING', 'RESIDENTIAL', 'SHORT_TERM']),
  leaseType: z.enum(['MONTHLY', 'YEARLY', 'FLEXIBLE'])
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const propertyType = searchParams.get('propertyType')
    const leaseType = searchParams.get('leaseType')
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const skip = (page - 1) * limit

    const where: any = {
      isAvailable: true
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (minPrice || maxPrice) {
      where.rentAmount = {}
      if (minPrice) where.rentAmount.gte = parseFloat(minPrice)
      if (maxPrice) where.rentAmount.lte = parseFloat(maxPrice)
    }

    if (propertyType) {
      where.propertyType = propertyType
    }

    if (leaseType) {
      where.leaseType = leaseType
    }

    // Get total count for pagination
    const totalCount = await prisma.property.count({ where })
    const totalPages = Math.ceil(totalCount / limit)

    // Get paginated properties
    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: skip
    })

    return NextResponse.json({
      properties,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'OWNER') {
      return NextResponse.json(
        { message: 'Only property owners can create properties' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const propertyData = propertySchema.parse(body)

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        ownerId: session.user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Create property error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 