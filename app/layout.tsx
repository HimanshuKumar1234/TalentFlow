import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TalentHub Pro - Premium Job Management Platform",
  description: "Industry-leading recruitment and candidate management platform with advanced features",
  generator: "v0.app",
  keywords: ["recruitment", "job management", "candidate tracking", "assessment builder", "HR platform"],
  authors: [{ name: "TalentHub Pro" }],
  creator: "TalentHub Pro",
  publisher: "TalentHub Pro",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talenthub-pro.vercel.app",
    title: "TalentHub Pro - Premium Job Management Platform",
    description: "Industry-leading recruitment and candidate management platform",
    siteName: "TalentHub Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentHub Pro - Premium Job Management Platform",
    description: "Industry-leading recruitment and candidate management platform",
    creator: "@talenthubpro",
  },
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading TalentHub Pro...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
