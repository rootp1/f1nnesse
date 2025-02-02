"use client";

import { useState, type ChangeEvent, type FormEvent } from "react"; // Import types
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AccessControl from "../components/AccessControl";
import { useMatches } from "../contexts/MatchesContext";

export default function Listing() {
  const { addMatch } = useMatches();
  const [matchData, setMatchData] = useState({
    team1: "",
    team2: "",
    date: "",
    time: "",
    venue: "",
    sport: "",
  });

  // Explicitly type the event parameter
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMatchData((prev) => ({ ...prev, [name]: value }));
  };

  // Explicitly type the value parameter (string)
  const handleSportChange = (value: string) => {
    setMatchData((prev) => ({ ...prev, sport: value }));
  };

  // Explicitly type the form submission event
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare the match data (excluding `id`)
    const newMatch = {
      sport: matchData.sport,
      team1: matchData.team1,
      team2: matchData.team2,
      date: matchData.date,
      time: matchData.time,
      venue: matchData.venue,
    };

    // Add the match to Firestore
    await addMatch(newMatch);

    // Reset the form
    setMatchData({
      team1: "",
      team2: "",
      date: "",
      time: "",
      venue: "",
      sport: "",
    });
  };

  return (
    <AccessControl allowedUserTypes={["admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Add New Match</h1>
          <Card>
            <CardHeader>
              <CardTitle>Match Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Align Team 1 and Team 2 in a row */}
                <div className="flex gap-4">
                  <Input
                    name="team1"
                    value={matchData.team1}
                    onChange={handleInputChange}
                    placeholder="Team 1"
                    required
                    className="bg-gray-700 text-white flex-1"
                  />
                  <Input
                    name="team2"
                    value={matchData.team2}
                    onChange={handleInputChange}
                    placeholder="Team 2"
                    required
                    className="bg-gray-700 text-white flex-1"
                  />
                </div>

                <Input
                  name="date"
                  value={matchData.date}
                  onChange={handleInputChange}
                  type="date"
                  required
                  className="bg-gray-700 text-white"
                />
                <Input
                  name="time"
                  value={matchData.time}
                  onChange={handleInputChange}
                  type="time"
                  required
                  className="bg-gray-700 text-white"
                />
                <Input
                  name="venue"
                  value={matchData.venue}
                  onChange={handleInputChange}
                  placeholder="Venue + Match Details"
                  required
                  className="bg-gray-700 text-white"
                />
                <Select onValueChange={handleSportChange} value={matchData.sport}>
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue placeholder="Select sport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="volleyball">Volleyball</SelectItem>
                    <SelectItem value="hockey">Hockey</SelectItem>
                    <SelectItem value="foosball">Foosball</SelectItem>
                    <SelectItem value="table-tennis">Table Tennis</SelectItem>
                    <SelectItem value="chess">Chess</SelectItem>
                    <SelectItem value="carrom">Carrom</SelectItem>
                    <SelectItem value="squash">Squash</SelectItem>
                    <SelectItem value="boxing">Boxing</SelectItem>
                    <SelectItem value="taekwondo">Taekwondo</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full">
                  Add Match
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessControl>
  );
}
