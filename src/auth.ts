import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/server/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // NuVioLabs Core Admin Credentials
                if (credentials.email === "admin@nuvio.local" && credentials.password === "admin123") {
                    let user = await prisma.user.findUnique({
                        where: { email: "admin@nuvio.local" }
                    })

                    if (!user) {
                        user = await prisma.user.create({
                            data: {
                                email: "admin@nuvio.local",
                                name: "NuVio Admin",
                                isPlatformAdmin: true,
                                password: "admin123" // In a real app this would be hashed
                            }
                        })
                    } else if (!user.isPlatformAdmin) {
                        user = await prisma.user.update({
                            where: { email: "admin@nuvio.local" },
                            data: { isPlatformAdmin: true }
                        })
                    }
                    return user
                }

                // Regular user login logic would go here
                return null
            }
        })
    ],
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                if (user) {
                    session.user.id = user.id as string;
                    // @ts-expect-error custom property 
                    session.user.isPlatformAdmin = user.isPlatformAdmin;
                } else if (token) {
                    session.user.id = token.sub as string;
                    // @ts-expect-error custom property
                    session.user.isPlatformAdmin = token.isPlatformAdmin;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-expect-error custom property
                token.isPlatformAdmin = user.isPlatformAdmin;
            }
            return token;
        }
    }
})
