// components/DisplayMatches.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccessControl from "../components/AccessControl";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Match {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  date: string;
  time?: string;
  venue?: string;
  winner?: string;
  resultUpdated?: boolean;
}

export default function DisplayMatches() {
  const [matches, setMatches] = useState<Match[]>([]);

  // Real-time listener for matches
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "matches"), (snapshot) => {
      const matchesData: Match[] = [];
      snapshot.forEach((docSnap) => {
        matchesData.push({ id: docSnap.id, ...docSnap.data() } as Match);
      });
      setMatches(matchesData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AccessControl allowedUserTypes={["user", "admin"]}>
      <main className="min-h-screen pt-16 bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Upcoming Matches</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <Card key={match.id}>
                {/* 
                  The wrapping div now includes:
                  - p-4 for padding,
                  - transition-colors and duration-500 for background animation,
                  - a conditional background color based on the match result.
                */}
                <div
                  className={`p-4 transition-colors duration-500 ${
                    match.resultUpdated ? "bg-black" : "bg-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle
                      className={match.resultUpdated ? "text-white" : "text-black"}
                    >
                      {match.sport}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`font-semibold ${
                        match.resultUpdated ? "text-white" : "text-black"
                      }`}
                    >
                      {match.team1} vs {match.team2}
                    </p>
                    <p className={match.resultUpdated ? "text-gray-300" : "text-gray-600"}>
                      Date: {match.date}
                    </p>
                    {match.time && (
                      <p className={match.resultUpdated ? "text-gray-300" : "text-gray-600"}>
                        Time: {match.time}
                      </p>
                    )}
                    {match.venue && (
                      <p className={match.resultUpdated ? "text-gray-300" : "text-gray-600"}>
                        Venue: {match.venue}
                      </p>
                    )}
                    {match.resultUpdated && match.winner && (
                      <p className="mt-2 text-green-400">Winner: {match.winner}</p>
                    )}
                    <Link
                      href={`/edit-match/${match.id}`}
                      className={
                        match.resultUpdated
                          ? "text-blue-300 mt-4 inline-block"
                          : "text-blue-500 mt-4 inline-block"
                      }
                    >
                      Edit
                    </Link>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </AccessControl>
  );
}
