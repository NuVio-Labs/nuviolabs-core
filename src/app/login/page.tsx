"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    return (
        <div className="w-full max-w-md mt-12 mx-auto">
            <Card className="border-white/40 shadow-2xl bg-white/60 backdrop-blur-2xl rounded-2xl overflow-hidden">
                <CardHeader className="text-center space-y-2 pb-6 pt-8">
                    <CardTitle className="text-3xl font-medium tracking-tight text-slate-900">NuVioLabs Core</CardTitle>
                    <CardDescription className="text-slate-500 text-base">Kundenportal</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <form action={formAction} className="space-y-5">
                        {state?.error && (
                            <Alert variant="destructive" className="bg-red-50/80 text-red-900 border-red-200/50 backdrop-blur-md">
                                <AlertDescription>{state.error}</AlertDescription>
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Passwort</Label>
                                <Link href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-300">
                                    Passwort vergessen
                                </Link>
                            </div>
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
                            disabled={isPending}
                        >
                            {isPending ? "Lädt..." : "Einloggen"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
