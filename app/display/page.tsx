"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccessControl from "../components/AccessControl";
import { useMatches } from "../contexts/MatchesContext";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

const CONTRACT_ADDRESS = "0xad4b8a16c8786641aa7c17ecac953ecd2ffb1170";
const CONTRACT_ABI = [
  "function placeBet(string memory team) external payable",
  "function declareWinner(string memory winningTeam) external",
  "function getAllBets() view returns (tuple(address user, uint256 amount, string team)[])",
  "event BetPlaced(address indexed user, uint256 amount, string team)",
];

interface Match {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

interface Bet {
  user: string;
  amount: string;
  team: string;
}

export default function BetPage() {
  const { matches } = useMatches();
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Wallet connection logic
  useEffect(() => {
    const initWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        const handleAccountsChanged = (accounts: string[]) => {
          setAccount(accounts[0] || null);
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Wallet initialization error:", error);
        }

        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
      }
    };

    initWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet");
    }
  };

  return (
    <AccessControl allowedUserTypes={["user", "admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Upcoming Matches</h1>
            {!account && (
              <Button onClick={connectWallet} size="lg">
                Connect Wallet
              </Button>
            )}
          </div>

          {account && (
            <p className="text-green-500 mb-6">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {matches.map((match) => (
              <MatchCard 
                key={match.id}
                match={match}
                contract={contract}
                account={account}
              />
            ))}
          </div>
        </div>
      </main>
    </AccessControl>
  );
}

function MatchCard({ match, contract, account }: { 
  match: Match;
  contract: Contract | null;
  account: string | null;
}) {
  const [bets, setBets] = useState<Bet[]>([]);

  // ... keep the existing state and functions ...

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-xl">{match.sport}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg font-semibold">
            {match.team1} vs {match.team2}
          </p>
          <p className="text-sm text-muted-foreground">
            {match.date} • {match.time}
          </p>
          <p className="text-sm text-muted-foreground">{match.venue}</p>
        </div>

        {/* Removed the betting buttons section */}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Current Bets</h3>
          {bets.length > 0 ? (
            <ul className="space-y-2">
              {bets.map((bet, index) => (
                <li 
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="font-mono">
                    {bet.user.slice(0, 6)}...{bet.user.slice(-4)}
                  </span>
                  {" "}bet {bet.amount}ETH on{" "}
                  <span className={
                    bet.team === match.team1 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-blue-600 dark:text-blue-400"
                  }>
                    {bet.team}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No bets placed yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
