"use client"
import AccessControl from "../components/AccessControl"
import { useState, useEffect } from "react"
import { Card, CardContent, Input, Button } from "@/app/components/ui"
export default function YourBets() {
  const [matches, setMatches] = useState([])
  const [bets, setBets] = useState({})

  useEffect(() => {
    // Fetch match data from API
    const fetchMatches = async () => {
      const res = await fetch("/api/matches")
      const data = await res.json()
      setMatches(data)
    }

    fetchMatches()
  }, [])

  const handleBetChange = (matchId, value) => {
    setBets((prevBets) => ({ ...prevBets, [matchId]: value }))
  }

  const handlePlaceBet = async (matchId) => {
    // Send bet data to API
    const res = await fetch("/api/bets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchId, amount: bets[matchId] }),
    })

    if (res.ok) {
      // Update bets state
      setBets((prevBets) => ({ ...prevBets, [matchId]: "" }))
    } else {
      console.error("Failed to place bet")
    }
  }

  return (
    <AccessControl allowedUserTypes={["user"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Your Bets</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <Card key={match.id}>
                <CardContent>
                  <p className="font-semibold text-white">
                    {match.team1} vs {match.team2}
                  </p>
                  <p className="text-gray-300">Date: {match.date}</p>
                  <p className="text-gray-300">Time: {match.time}</p>
                  <p className="text-gray-300">Venue: {match.venue}</p>
                  <div className="mt-4 space-y-2">
                    <Input
                      type="number"
                      placeholder="Enter bet amount"
                      value={bets[match.id] || ""}
                      onChange={(e) => handleBetChange(match.id, e.target.value)}
                      className="bg-gray-700 text-white"
                    />
                    <Button onClick={() => handlePlaceBet(match.id)} className="w-full" disabled={!bets[match.id]}>
                      Place Bet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </AccessControl>
  )
}

