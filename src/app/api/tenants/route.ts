import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper function to generate fictional data for tenants
const generateFictionalData = (userId: string) => {
  const phoneNumbers = [
    '+1 (555) 123-4567',
    '+1 (555) 234-5678',
    '+1 (555) 345-6789',
    '+1 (555) 456-7890',
    '+1 (555) 567-8901',
    '+1 (555) 678-9012',
    '+1 (555) 789-0123',
    '+1 (555) 890-1234',
    '+1 (555) 901-2345',
    '+1 (555) 012-3456'
  ]
  
  const lastActivities = [
    '2024-01-15',
    '2024-01-20',
    '2024-01-18',
    '2024-01-10',
    '2024-01-22',
    '2024-01-19',
    '2024-01-21',
    '2024-01-05',
    '2024-01-23',
    '2024-01-17'
  ]

  // Generate consistent fictional data based on userId
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const phoneIndex = Math.abs(hash) % phoneNumbers.length
  const activityIndex = Math.abs(hash) % lastActivities.length
  const propertiesViewed = Math.abs(hash) % 30 + 1 // 1-30 properties
  const applicationsSubmitted = Math.abs(hash) % 10 // 0-9 applications
  const status = Math.abs(hash) % 5 === 0 ? 'INACTIVE' : 'ACTIVE' // 20% chance of being inactive

  return {
    phone: phoneNumbers[phoneIndex],
    lastActivity: lastActivities[activityIndex],
    propertiesViewed,
    applicationsSubmitted,
    status
  }
}

export async function GET() {
  try {
    // Get real tenants from database
    const realTenants = await prisma.user.findMany({
      where: {
        role: 'TENANT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Combine real data with fictional data
    const tenantsWithFictionalData = realTenants.map((tenant, index) => {
      const fictionalData = generateFictionalData(tenant.id)
      
      return {
        id: tenant.id,
        name: tenant.name || `Tenant ${index + 1}`,
        email: tenant.email,
        ...fictionalData
      }
    })

    return NextResponse.json({
      success: true,
      data: tenantsWithFictionalData
    })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
