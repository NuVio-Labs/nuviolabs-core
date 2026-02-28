import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NuVioLabs Core",
  description: "Kundenportal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 antialiased selection:bg-slate-200`}>
        {children}
      </body>
    </html>
  );
}
