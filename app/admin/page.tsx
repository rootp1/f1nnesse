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
import { BrowserProvider, Contract } from "ethers";
import bettingAbi from "@/lib/bettingAbi.json";

const CONTRACT_ADDRESS = "0xad4b8a16c8786641aa7c17ecac953ecd2ffb1170";

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
      if (!window.ethereum) throw new Error("MetaMask not detected!");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, bettingAbi, signer);

      // Step 1: Declare winner with actual team name
      const declareTx = await contract.declareWinner(winner);
      await declareTx.wait();

      // Step 2: Reset contract for new matches
      const resetTx = await contract.resetMatch();
      await resetTx.wait();

      // Update Firestore
      const matchRef = doc(db, "matches", selectedMatchId);
      await updateDoc(matchRef, { 
        result: winner, 
        updated: true,
        contractReset: true 
      });

      alert("Match result processed successfully!");
      setSelectedMatchId(null);
      setSelectedMatch(null);
      setWinner("");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.reason || error.message || "Error processing result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccessControl allowedUserTypes={["admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-primary mb-8 text-white">Match Administration</h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-secondary ">Match Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Select onValueChange={setSelectedMatchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select match" className="text-muted-foreground" />
                  </SelectTrigger>
                  <SelectContent>
                    {matches.map((match) => (
                      <SelectItem key={match.id} value={match.id} className="text-primary">
                        {match.sport}: {match.team1} vs {match.team2}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMatch && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <p className="text-lg font-semibold text-primary">
                      {selectedMatch.team1} vs {selectedMatch.team2}
                    </p>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={winner === selectedMatch.team1 ? "default" : "secondary"}
                        onClick={() => setWinner(selectedMatch.team1)}
                        className={winner === selectedMatch.team1 ? "text-background" : "text-primary"}
                      >
                        {selectedMatch.team1} Wins
                      </Button>
                      <Button
                        type="button"
                        variant={winner === selectedMatch.team2 ? "default" : "secondary"}
                        onClick={() => setWinner(selectedMatch.team2)}
                        className={winner === selectedMatch.team2 ? "text-background" : "text-primary"}
                      >
                        {selectedMatch.team2} Wins
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!winner || loading}
                  className="w-full text-background bg-primary hover:bg-primary-dark"
                >
                  {loading ? "Processing..." : "Finalize Match"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessControl>
  );
}
