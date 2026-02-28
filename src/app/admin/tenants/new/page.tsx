import { requirePlatformAdmin } from "@/server/guards"
import prisma from "@/server/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function NewTenantPage() {
    await requirePlatformAdmin()

    async function createTenant(formData: FormData) {
        "use server"

        // In a real app we would use Zod to validate the string properly
        const name = formData.get("name") as string
        const slugRaw = formData.get("slug") as string

        if (!name || !slugRaw) return

        const slug = slugRaw.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 32)

        // Auth guard again inside action
        const actionUser = await requirePlatformAdmin()

        try {
            await prisma.$transaction(async (tx) => {
                const tenant = await tx.tenant.create({
                    data: {
                        name,
                        slug,
                        status: "active"
                    }
                })

                await tx.membership.create({
                    data: {
                        userId: actionUser.id as string,
                        tenantId: tenant.id,
                        role: "owner"
                    }
                })

                await tx.auditLog.create({
                    data: {
                        action: "tenant_created",
                        tenantId: tenant.id,
                        userId: actionUser.id as string,
                        details: JSON.stringify({ name, slug })
                    }
                })
            })
        } catch (error) {
            console.error("Failed to create tenant:", error)
            redirect("/admin/tenants?error=creation_failed")
        }

        redirect("/admin/tenants")
    }

    return (
        <div className="w-full max-w-2xl mt-12 mx-auto">
            <div className="mb-8">
                <Link href="/admin/tenants" className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"></path></svg>
                    Zurück zur Liste
                </Link>
                <h1 className="text-3xl font-medium tracking-tight text-slate-900">Neuen Tenant anlegen</h1>
            </div>

            <Card className="border-white/40 shadow-2xl bg-white/60 backdrop-blur-2xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 pt-8 px-8 border-b border-white/20">
                    <CardTitle className="text-xl font-medium text-slate-800">Tenant Details</CardTitle>
                    <CardDescription className="text-slate-500">Geben Sie die Basisdaten des neuen Tenants ein.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <form action={createTenant} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium">Tenant Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="z.B. Acme Corp"
                                required
                                className="bg-white/50 border-slate-200/60 focus-visible:ring-slate-400 focus-visible:border-slate-400 transition-all duration-300 h-11 text-base placeholder:text-slate-400"
                            />
                            <p className="text-xs text-slate-500">Der Anzeigename des Tenants im System.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-slate-700 font-medium">URL Slug</Label>
                            <div className="flex rounded-xl overflow-hidden border border-slate-200/60 bg-white/50 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all duration-300">
                                <span className="flex items-center px-4 bg-slate-50/80 text-slate-500 text-sm border-r border-slate-200/60 select-none">
                                    core.nuviolabs.de/t/
                                </span>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="acme-corp"
                                    pattern="[a-zA-Z0-9-]+"
                                    required
                                    className="border-0 focus-visible:ring-0 bg-transparent h-11 text-base placeholder:text-slate-400 w-full rounded-none"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Einzigartiger Identifier für URLs. Wird automatisch vereinfacht (keine Sonderzeichen).</p>
                        </div>

                        <div className="pt-4 border-t border-slate-200/50 flex justify-end gap-3 mt-8">
                            <Link href="/admin/tenants">
                                <Button type="button" variant="outline" className="border-slate-300/60 bg-white/50 text-slate-700 hover:bg-white/80 rounded-xl h-11 px-6 shadow-sm">
                                    Abbrechen
                                </Button>
                            </Link>
                            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-8 shadow-md shadow-slate-900/10">
                                Tenant erstellen
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
