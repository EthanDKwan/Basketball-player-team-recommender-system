// app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import TableauScriptLoader from "./components/TableauScriptLoader"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "NBA recommender system",
  description: "Get player-team recommendations!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://public.tableau.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
        <Analytics />
        <TableauScriptLoader />
      </body>
    </html>
  )
}