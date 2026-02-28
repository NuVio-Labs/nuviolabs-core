import { requireUser } from "@/server/guards"
import prisma from "@/server/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "@/auth"

export default async function TenantSwitchPage() {
    const user = await requireUser()

    // @ts-expect-error custom user type
    const isPlatformAdmin = user.isPlatformAdmin

    let tenants = []

    if (isPlatformAdmin) {
        tenants = await prisma.tenant.findMany({
            orderBy: { name: 'asc' }
        })
    } else {
        // Note: TypeScript strict mode won't allow this without asserting user.id is string
        // In auth callback we set session.user.id
        const memberships = await prisma.membership.findMany({
            where: { userId: user.id as string },
            include: { tenant: true }
        })
        tenants = memberships.map(m => m.tenant)
    }

    return (
        <div className="w-full max-w-4xl mt-12 mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-slate-900">Platform Home</h1>
                    <p className="text-slate-500 mt-2">Wählen Sie einen Tenant aus</p>
                </div>

                <div className="flex items-center gap-4">
                    {isPlatformAdmin && (
                        <Link href="/admin/tenants">
                            <Button variant="outline" className="border-slate-300/60 bg-white/50 text-slate-700 hover:bg-white/80 transition-all rounded-xl h-10 px-6">
                                Platform Admin
                            </Button>
                        </Link>
                    )}
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <Button type="submit" variant="ghost" className="text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 rounded-xl h-10 px-4">
                            Logout
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenants.map(tenant => (
                    <Link href={`/t/${tenant.slug}`} key={tenant.id} className="block group">
                        <Card className="border-white/40 shadow-xl bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/80 hover:shadow-2xl transition-all duration-300 h-full border-t-white/80">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                                    {tenant.name}
                                </CardTitle>
                                <CardDescription className="text-slate-500">
                                    {tenant.status === 'active' ? 'Aktiv' : 'Gesperrt'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-100/50 rounded-xl px-4 py-3 flex items-center justify-between mt-2">
                                    <span className="text-sm font-mono text-slate-600 truncate">{tenant.slug}</span>
                                    <span className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/Dom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {tenants.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100/50 text-slate-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 14v1"></path><path d="M9 19v2"></path><path d="M9 3v2"></path><path d="M9 9v1"></path></svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Keine Tenants gefunden</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Sie sind aktuell keinem Tenant zugeordnet. Bitte kontaktieren Sie einen Administrator.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
