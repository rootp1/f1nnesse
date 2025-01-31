"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AccessControl from "../components/AccessControl"

const leaderboardData = [
  { id: 1, username: "user1", winnings: 1000 },
  { id: 2, username: "user2", winnings: 850 },
  { id: 3, username: "user3", winnings: 750 },
  // Add more mock data as needed
]

export default function Leaderboard() {
  return (
    <AccessControl allowedUserTypes={["user", "admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
          <div className="space-y-4">
            {leaderboardData.map((user, index) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>
                    #{index + 1} {user.username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Total Winnings: ${user.winnings}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </AccessControl>
  )
}

