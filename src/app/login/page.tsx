import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams;
    const errorMsg = params?.error === "CredentialsSignin" ? "Ungültige E Mail oder Passwort." : params?.error;

    return (
        <div className="w-full max-w-md mt-12 mx-auto">
            <Card className="border-white/40 shadow-2xl bg-white/60 backdrop-blur-2xl rounded-2xl overflow-hidden">
                <CardHeader className="text-center space-y-2 pb-6 pt-8">
                    <CardTitle className="text-3xl font-medium tracking-tight text-slate-900">NuVioLabs Core</CardTitle>
                    <CardDescription className="text-slate-500 text-base">Platform Login</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <form
                        action={async (formData) => {
                            "use server"
                            try {
                                await signIn("credentials", formData)
                            } catch (error) {
                                if (error instanceof AuthError) {
                                    switch (error.type) {
                                        case "CredentialsSignin":
                                            // Next.js form actions don't expect a return value if we throw redirect later
                                            // The Auth.js redirect will be caught. 
                                            // If we really need to pass error state, we should use useFormState
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                throw error
                            }
                        }}
                        className="space-y-5"
                    >
                        {errorMsg && (
                            <Alert variant="destructive" className="bg-red-50/80 text-red-900 border-red-200/50 backdrop-blur-md">
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">E Mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@nuvio.local"
                                required
                                className="bg-white/50 border-slate-200/60 focus-visible:ring-slate-400 focus-visible:border-slate-400 transition-all duration-300 h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-medium">Passwort</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-white/50 border-slate-200/60 focus-visible:ring-slate-400 focus-visible:border-slate-400 transition-all duration-300 h-11"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 h-11 shadow-md shadow-slate-900/10 rounded-xl mt-2"
                        >
                            Einloggen
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
