import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { fontSans, fontUrban } from '@/config/fonts'
import { EdgeStoreProvider } from '@/lib/edgestore'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Prisma",
    "PlanetScale",
    "Auth.js",
    "shadcn ui",
    "Resend",
    "React Email",
    "Stripe"
  ],
  authors: [
    {
      name: "tejas",
    },
  ],
  creator: "tejas",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@miickasmt",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontUrban.variable,
        // fontHeading.variable
      )}>
        <SessionProvider session={session}>
          <Toaster />
          <EdgeStoreProvider>
            <div className='flex min-h-screen flex-col'>
              {children}
            </div>
          </EdgeStoreProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
