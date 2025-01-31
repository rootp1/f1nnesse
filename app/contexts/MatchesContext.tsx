"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

export interface Match {
  id: number
  sport: string
  team1: string
  team2: string
  date: string
  time: string
  venue: string
}

interface MatchesContextType {
  matches: Match[]
  addMatch: (match: Omit<Match, "id">) => void
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined)

export const useMatches = () => {
  const context = useContext(MatchesContext)
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider")
  }
  return context
}

export const MatchesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([])

  const addMatch = (match: Omit<Match, "id">) => {
    setMatches((prevMatches) => [...prevMatches, { ...match, id: Date.now() }])
  }

  return <MatchesContext.Provider value={{ matches, addMatch }}>{children}</MatchesContext.Provider>
}

