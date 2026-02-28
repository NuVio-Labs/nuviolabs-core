import { auth } from "@/auth"
import prisma from "@/server/prisma"
import { redirect } from "next/navigation"

export async function requireUser() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }
    return session.user
}

export async function requirePlatformAdmin() {
    const user = await requireUser()
    // @ts-expect-error custom user type
    if (!user.isPlatformAdmin) {
        redirect("/t")
    }
    return user
}

export async function requireTenantRole(tenantSlug: string, requiredRoles: string[] = []) {
    const user = await requireUser()

    const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug }
    })

    if (!tenant) {
        redirect("/t")
    }

    // @ts-expect-error custom user type
    if (user.isPlatformAdmin) {
        return { user, tenant, role: "platform_admin" }
    }

    const membership = await prisma.membership.findUnique({
        where: {
            userId_tenantId: {
                userId: user.id!,
                tenantId: tenant.id
            }
        }
    })

    if (!membership || (requiredRoles.length > 0 && !requiredRoles.includes(membership.role))) {
        redirect("/t")
    }

    return { user, tenant, role: membership.role, membership }
}
