"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "admin@nuvio.local" && password === "admin123") {
        const cookieStore = await cookies();
        cookieStore.set("nuvio_session", "ok", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
        });

        redirect("/test");
    }

    return {
        error: "Ungültige E Mail oder Passwort.",
    };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("nuvio_session");
    redirect("/login");
}
