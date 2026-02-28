import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Database...')

    // 1. Create or ensure Demo Admin exists
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nuvio.local' },
        update: {
            isPlatformAdmin: true,
        },
        create: {
            email: 'admin@nuvio.local',
            name: 'NuVio Admin',
            isPlatformAdmin: true,
            password: 'admin123'
        }
    })

    console.log(`Verified Platform Admin: ${admin.email}`)

    // 2. Setup Demo Tenant if it doesn't exist
    const demoTenantSlug = 'demo-tenant'
    const demoTenant = await prisma.tenant.upsert({
        where: { slug: demoTenantSlug },
        update: {},
        create: {
            name: 'Demo Tenant Inc.',
            slug: demoTenantSlug,
            status: 'active'
        }
    })

    console.log(`Verified Demo Tenant: ${demoTenant.name}`)

    // 3. Ensure Membership exists
    const membership = await prisma.membership.upsert({
        where: {
            userId_tenantId: {
                userId: admin.id,
                tenantId: demoTenant.id
            }
        },
        update: {},
        create: {
            userId: admin.id,
            tenantId: demoTenant.id,
            role: 'owner'
        }
    })

    console.log(`Verified Admin Membership in ${demoTenant.name} as ${membership.role}`)

    // Log the seed event
    await prisma.auditLog.create({
        data: {
            action: 'database_seeded',
            userId: admin.id,
            details: JSON.stringify({ tenantSlug: demoTenantSlug })
        }
    })

    console.log('Database seeded successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
