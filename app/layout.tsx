import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StoreProvider from "@/lib/store-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Product Management System",
  description: "Modern product management dashboard",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
