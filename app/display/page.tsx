"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AccessControl from "../components/AccessControl"
import { useMatches } from "../contexts/MatchesContext"

export default function Display() {
  const { matches } = useMatches()

  return (
    <AccessControl allowedUserTypes={["user", "admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Upcoming Matches</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <Card key={match.id}>
                <CardHeader>
                  <CardTitle>{match.sport}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-white">
                    {match.team1} vs {match.team2}
                  </p>
                  <p className="text-gray-300">Date: {match.date}</p>
                  <p className="text-gray-300">Time: {match.time}</p>
                  <p className="text-gray-300">Venue: {match.venue}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </AccessControl>
  )
}

