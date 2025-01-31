import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import AnimatedBackground from "./components/AnimatedBackground"
import Navbar from "./components/Navbar"
import { MatchesProvider } from "./contexts/MatchesContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SportsBet - Futuristic Sports Betting Platform",
  description: "Experience the thrill of sports betting with our modern, sleek, and user-friendly platform.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <div className="min-h-screen overflow-hidden">
          <AnimatedBackground />
          <MatchesProvider>
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
          </MatchesProvider>
        </div>
      </body>
    </html>
  )
}



import './globals.css'