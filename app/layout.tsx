import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { StoreProvider } from "@/context/store-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: "ELUX — Modern Shopping Redefined",
  description:
    "ELUX is a premium online store for headphones, wearables, computing, home, and photography gear. Discover thoughtfully designed technology for modern living.",
  keywords: ["ELUX", "online store", "electronics", "headphones", "smartwatch", "premium tech"],
}

export const viewport = {
  themeColor: "#f7f2ea",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <StoreProvider>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
