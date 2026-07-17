import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WebsiteBuilderProvider } from '@/context/WebsiteBuilderContext'
import { VisualEditorToolbar } from '@/components/admin/VisualEditorToolbar'
import GlobalEditorButton from '@/components/admin/GlobalEditorButton'
import { getProfile } from '@/utils/supabase/getProfile'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aquaman Plumbing & General Contracting",
  description: "Expert plumbing, water heater installations, drain cleaning, and general contracting remodeling.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch real profile server-side safely
  const profile = await getProfile()
  const isGlobalAdmin = profile?.role === 'global_admin' && profile?.is_active === true

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 pt-14">
        <WebsiteBuilderProvider>
          {isGlobalAdmin && <VisualEditorToolbar />}
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
          {isGlobalAdmin && <GlobalEditorButton />}
        </WebsiteBuilderProvider>
      </body>
    </html>
  );
}
