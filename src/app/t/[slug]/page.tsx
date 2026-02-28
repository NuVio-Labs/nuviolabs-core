import { requireTenantRole } from "@/server/guards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function TenantHomePage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // requireTenantRole checks access and throws redirect if not allowed
    const { tenant, role, user } = await requireTenantRole(slug)

    // @ts-expect-error custom user type
    const isPlatformAdmin = user.isPlatformAdmin

    return (
        <div className="w-full max-w-5xl mt-12 mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/t" className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"></path></svg>
                        Zurück zur Übersicht
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-medium tracking-tight text-slate-900">{tenant.name}</h1>
                        <span className="px-2.5 py-1 rounded-full bg-white/40 border border-white/60 text-xs font-medium text-slate-600 shadow-sm">
                            {role === 'platform_admin' ? 'Platform Admin' : role}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {(role === 'owner' || role === 'admin' || isPlatformAdmin) && (
                        <Button variant="outline" className="border-slate-300/60 bg-white/50 text-slate-700 hover:bg-white/80 transition-all rounded-xl h-10">
                            Einstellungen
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-white/40 shadow-xl bg-white/60 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-medium text-slate-800">Übersicht</CardTitle>
                            <CardDescription className="text-slate-500">Willkommen im Tenant Portal</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white/40 rounded-xl p-6 border border-white/50 shadow-sm min-h-64 flex items-center justify-center text-slate-400">
                                Inhalte für {tenant.name} werden hier geladen...
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {isPlatformAdmin && (
                        <Card className="border-indigo-200/60 shadow-xl bg-indigo-50/40 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                            </div>
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-lg font-medium text-indigo-900">Admin Info</CardTitle>
                                <CardDescription className="text-indigo-700/70">Sie betrachten diesen Tenant als Platform Admin</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-3">
                                <div className="text-sm text-indigo-800/80">
                                    <span className="block font-medium mb-1">Tenant ID</span>
                                    <span className="font-mono bg-white/50 px-2 py-1 rounded block">{tenant.id}</span>
                                </div>
                                <div className="text-sm text-indigo-800/80">
                                    <span className="block font-medium mb-1">Status</span>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/50">
                                        <span className={`w-2 h-2 rounded-full ${tenant.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {tenant.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-white/40 shadow-xl bg-white/60 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium text-slate-800">Zuletzt Aktiv</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-500 italic text-center py-8">
                                Keine rezenten Aktivitäten gefunden
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
