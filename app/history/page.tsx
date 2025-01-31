"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccessControl from "../components/AccessControl"

const currentBets = [
  { id: 1, match: "Team A vs Team B", amount: 100, odds: 1.5 },
  { id: 2, match: "Team C vs Team D", amount: 50, odds: 2.0 },
]

const betHistory = [
  { id: 1, match: "Team X vs Team Y", amount: 75, result: "Won", winnings: 112.5 },
  { id: 2, match: "Team Z vs Team W", amount: 60, result: "Lost", winnings: 0 },
]

export default function History() {
  return (
    <AccessControl allowedUserTypes={["user"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Bet History</h1>
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current Bets</TabsTrigger>
              <TabsTrigger value="history">Bet History</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <div className="space-y-4">
                {currentBets.map((bet) => (
                  <Card key={bet.id}>
                    <CardHeader>
                      <CardTitle>{bet.match}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Amount: ${bet.amount}</p>
                      <p>Odds: {bet.odds}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="space-y-4">
                {betHistory.map((bet) => (
                  <Card key={bet.id}>
                    <CardHeader>
                      <CardTitle>{bet.match}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Amount: ${bet.amount}</p>
                      <p>Result: {bet.result}</p>
                      <p>Winnings: ${bet.winnings}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AccessControl>
  )
}

