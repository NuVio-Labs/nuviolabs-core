import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function TestPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("nuvio_session");

    if (session?.value !== "ok") {
        redirect("/login");
    }

    return (
        <div className="w-full max-w-2xl mt-12 mx-auto">
            <Card className="border-white/40 shadow-2xl bg-white/60 backdrop-blur-2xl rounded-2xl overflow-hidden">
                <CardHeader className="pt-8 px-8 pb-4">
                    <CardTitle className="text-3xl font-medium tracking-tight text-slate-900">Test Bereich</CardTitle>
                    <CardDescription className="text-slate-500 text-base">Erfolgreich eingeloggt.</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-8">
                    <div className="bg-white/40 rounded-xl p-6 border border-white/50 shadow-sm">
                        <p className="text-slate-700 leading-relaxed">
                            Dies ist eine geschützte Seite. Sie können diese nur sehen, da das Cookie <span className="font-mono text-sm bg-slate-100 px-1 py-0.5 rounded text-slate-800">nuvio_session</span> gesetzt ist.
                        </p>
                    </div>
                    <form action={logoutAction}>
                        <Button type="submit" variant="outline" className="border-slate-300/60 bg-white/50 text-slate-700 hover:bg-white/80 hover:text-slate-900 transition-all duration-300 h-11 px-8 rounded-xl shadow-sm">
                            Logout
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
