import { requirePlatformAdmin } from "@/server/guards"
import prisma from "@/server/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminTenantsPage() {
    await requirePlatformAdmin()

    const tenants = await prisma.tenant.findMany({
        include: {
            _count: {
                select: { memberships: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="w-full max-w-5xl mt-12 mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/t" className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"></path></svg>
                        Zurück zur Tenant Auswahl
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-medium tracking-tight text-slate-900">Platform Admin</h1>
                        <span className="px-2.5 py-1 rounded-full bg-slate-200/50 border border-slate-300/50 text-xs font-medium text-slate-700 shadow-sm">
                            Tenants
                        </span>
                    </div>
                </div>

                <Link href="/admin/tenants/new">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white transition-all rounded-xl h-10 px-6 shadow-md shadow-slate-900/10">
                        Neuen Tenant anlegen
                    </Button>
                </Link>
            </div>

            <Card className="border-white/40 shadow-xl bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-200/50">
                    <CardTitle className="text-xl font-medium text-slate-800">Alle Tenants</CardTitle>
                    <CardDescription className="text-slate-500">Verwaltung aller Kunden Tenants auf der Plattform.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {tenants.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Slug</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Mitglieder</th>
                                        <th className="px-6 py-4 font-medium">Erstellt am</th>
                                        <th className="px-6 py-4 text-right font-medium">Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                    {tenants.map(tenant => (
                                        <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{tenant.name}</td>
                                            <td className="px-6 py-4 font-mono text-slate-600">{tenant.slug}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tenant.status === 'active'
                                                    ? 'bg-green-100/50 text-green-700 border border-green-200/50'
                                                    : 'bg-red-100/50 text-red-700 border border-red-200/50'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-current ${tenant.status === 'active' ? 'animate-pulse' : ''}`}></span>
                                                    {tenant.status === 'active' ? 'Aktiv' : 'Gespeert'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {tenant._count.memberships}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(tenant.createdAt).toLocaleDateString('de-DE')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/t/${tenant.slug}`} className="text-indigo-600 hover:text-indigo-900 font-medium hover:underline underline-offset-4 transition-all">
                                                    Öffnen
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100/50 text-slate-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 mb-2">Keine Tenants vorhanden</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                Legen Sie den ersten Tenant auf der Plattform an.
                            </p>
                            <Link href="/admin/tenants/new">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">Tenant anlegen</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
