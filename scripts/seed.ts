import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: {
      email: 'owner1@example.com',
      name: 'John Property Owner',
      password: hashedPassword,
      role: 'OWNER',
    },
  })

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: {
      email: 'owner2@example.com',
      name: 'Sarah Real Estate',
      password: hashedPassword,
      role: 'OWNER',
    },
  })

  const tenant1 = await prisma.user.upsert({
    where: { email: 'tenant1@example.com' },
    update: {},
    create: {
      email: 'tenant1@example.com',
      name: 'Mike Renter',
      password: hashedPassword,
      role: 'TENANT',
    },
  })

  const tenant2 = await prisma.user.upsert({
    where: { email: 'tenant2@example.com' },
    update: {},
    create: {
      email: 'tenant2@example.com',
      name: 'Lisa Apartment Hunter',
      password: hashedPassword,
      role: 'TENANT',
    },
  })

  // Create sample properties
  const property1 = await prisma.property.upsert({
    where: { id: 'sample-property-1' },
    update: {},
    create: {
      id: 'sample-property-1',
      title: 'Modern Downtown Apartment',
      description: 'Beautiful 2-bedroom apartment in the heart of downtown. Recently renovated with modern amenities.',
      location: '123 Main Street',
      city: 'New York',
      rentAmount: 2500,
      propertyType: 'RESIDENTIAL',
      leaseType: 'MONTHLY',
      ownerId: owner1.id,
    },
  })

  const property2 = await prisma.property.upsert({
    where: { id: 'sample-property-2' },
    update: {},
    create: {
      id: 'sample-property-2',
      title: 'Cozy Coworking Space',
      description: 'Professional coworking space with high-speed internet, meeting rooms, and coffee bar.',
      location: '456 Business Ave',
      city: 'San Francisco',
      rentAmount: 800,
      propertyType: 'COWORKING',
      leaseType: 'FLEXIBLE',
      ownerId: owner2.id,
    },
  })

  const property3 = await prisma.property.upsert({
    where: { id: 'sample-property-3' },
    update: {},
    create: {
      id: 'sample-property-3',
      title: 'Luxury Short-term Rental',
      description: 'Stunning vacation rental with ocean views. Perfect for weekend getaways.',
      location: '789 Beach Blvd',
      city: 'Miami',
      rentAmount: 300,
      propertyType: 'SHORT_TERM',
      leaseType: 'FLEXIBLE',
      ownerId: owner1.id,
    },
  })

  // Create sample applications
  await prisma.application.upsert({
    where: { id: 'sample-application-1' },
    update: {},
    create: {
      id: 'sample-application-1',
      propertyId: property1.id,
      tenantId: tenant1.id,
      status: 'PENDING',
      riskScore: 75,
    },
  })

  await prisma.application.upsert({
    where: { id: 'sample-application-2' },
    update: {},
    create: {
      id: 'sample-application-2',
      propertyId: property2.id,
      tenantId: tenant2.id,
      status: 'APPROVED',
      riskScore: 85,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Sample Users:')
  console.log('Owner 1:', owner1.email, '(password: password123)')
  console.log('Owner 2:', owner2.email, '(password: password123)')
  console.log('Tenant 1:', tenant1.email, '(password: password123)')
  console.log('Tenant 2:', tenant2.email, '(password: password123)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 