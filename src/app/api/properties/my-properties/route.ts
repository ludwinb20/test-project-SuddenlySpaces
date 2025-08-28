import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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
        { message: 'Only property owners can access this endpoint' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    // Get total count for pagination
    const totalCount = await prisma.property.count({
      where: {
        ownerId: session.user.id
      }
    })
    const totalPages = Math.ceil(totalCount / limit)

    // Get paginated properties
    const properties = await prisma.property.findMany({
      where: {
        ownerId: session.user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        applications: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
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
    console.error('Get my properties error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 