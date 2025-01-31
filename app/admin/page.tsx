"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AccessControl from "../components/AccessControl"

// Mock data for completed matches
const completedMatches = [
  {
    id: 1,
    sport: "Football",
    team1: "Team A",
    team2: "Team B",
    date: "2023-06-10",
  },
  {
    id: 2,
    sport: "Basketball",
    team1: "Team C",
    team2: "Team D",
    date: "2023-06-11",
  },
  // Add more mock data as needed
]

export default function Admin() {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMatch !== null) {
      // Implement result upload logic here
      console.log(`Uploaded result for match ${selectedMatch}: ${score1} - ${score2}`)
      // Reset form
      setSelectedMatch(null)
      setScore1("")
      setScore2("")
    }
  }

  return (
    <AccessControl allowedUserTypes={["admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Admin: Upload Match Results</h1>
          <Card>
            <CardHeader>
              <CardTitle>Upload Result</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select onValueChange={(value) => setSelectedMatch(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedMatches.map((match) => (
                      <SelectItem key={match.id} value={match.id.toString()}>
                        {match.sport}: {match.team1} vs {match.team2} ({match.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Team 1 Score"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Team 2 Score"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={selectedMatch === null}>
                  Upload Result
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessControl>
  )
}

