import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  city: z.string().min(1, 'City is required'),
  rentAmount: z.number().positive('Rent amount must be positive'),
  propertyType: z.enum(['RESIDENTIAL', 'COWORKING', 'SHORT_TERM']),
  leaseType: z.enum(['MONTHLY', 'YEARLY', 'FLEXIBLE']),
  isAvailable: z.boolean().optional()
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const propertyId = params.id

    // Check if the property exists and belongs to the authenticated user
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true },
    })

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only delete your own properties' },
        { status: 403 }
      )
    }

    // Delete the property (this will also delete related applications due to cascade)
    await prisma.property.delete({
      where: { id: propertyId },
    })

    return NextResponse.json(
      { message: 'Property deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'OWNER') {
      return NextResponse.json(
        { message: 'Only property owners can edit properties' },
        { status: 403 }
      )
    }

    const propertyId = params.id
    const body = await request.json()

    // Validate input
    const validatedData = updatePropertySchema.parse(body)

    // Check if the property exists and belongs to the authenticated user
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true },
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    if (existingProperty.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only edit your own properties' },
        { status: 403 }
      )
    }

    // Update the property
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: validatedData,
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

    return NextResponse.json(updatedProperty, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Update property error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 