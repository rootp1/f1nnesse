"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccessControl from "../components/AccessControl";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { ethers } from "ethers";
import bettingAbi from "@/lib/bettingAbi.json";

const CONTRACT_ADDRESS = "0x5270eed49Ee424FCf1b13c1de651F7424661E471";

export default function Admin() {
  const [matches, setMatches] = useState<Array<any>>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [winner, setWinner] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "matches"), (snapshot) => {
      const fetchedMatches = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(fetchedMatches);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedMatchId) {
      const match = matches.find((m) => m.id === selectedMatchId);
      setSelectedMatch(match);
      setWinner("");
    }
  }, [selectedMatchId, matches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !winner) return alert("Please select a match and declare a winner.");

    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
      }

      // Convert team name to contract identifier ("A" or "B")
      const contractTeamIdentifier = winner === selectedMatch.team1 ? "A" : "B";

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, bettingAbi, signer);

      // Send the contract identifier to the smart contract
      const tx = await contract.declareWinner(contractTeamIdentifier);
      await tx.wait();

      // Update Firestore with original team name
      const matchRef = doc(db, "matches", selectedMatchId);
      await updateDoc(matchRef, { result: winner, updated: true });

      alert("Match result uploaded and payouts distributed!");
      
      setSelectedMatchId(null);
      setSelectedMatch(null);
      setWinner("");
    } catch (error) {
      console.error("Error uploading result:", error);
      alert("Error processing the result. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

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
                <Select onValueChange={(value) => setSelectedMatchId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                  <SelectContent>
                    {matches.map((match) => (
                      <SelectItem key={match.id} value={match.id}>
                        {match.sport}: {match.team1} vs {match.team2} ({match.date})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMatch && (
                  <div className="space-y-2">
                    <p className="text-lg">
                      {selectedMatch.team1} vs {selectedMatch.team2}
                    </p>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={winner === selectedMatch.team1 ? "default" : "outline"}
                        onClick={() => setWinner(selectedMatch.team1)}
                      >
                        {selectedMatch.team1} Wins
                      </Button>
                      <Button
                        type="button"
                        variant={winner === selectedMatch.team2 ? "default" : "outline"}
                        onClick={() => setWinner(selectedMatch.team2)}
                      >
                        {selectedMatch.team2} Wins
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedMatchId || !winner || loading}
                >
                  {loading ? "Uploading..." : "Upload Result"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessControl>
  );
}