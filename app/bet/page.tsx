"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccessControl from "../components/AccessControl";
import { useMatches } from "../contexts/MatchesContext";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";

const CONTRACT_ADDRESS = "0x5270eed49Ee424FCf1b13c1de651F7424661E471";
const CONTRACT_ABI = [
  "function placeBet(string memory team) external payable",
  "function declareWinner(string memory winningTeam) external",
  "event BetPlaced(address indexed user, uint256 amount, string team)",
  "event MatchResultDeclared(string winningTeam)",
  "event Payout(address indexed user, uint256 amount)",
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

export default function Display() {
  const { matches } = useMatches();

  return (
    <AccessControl allowedUserTypes={["user", "admin"]}>
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Upcoming Matches</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </main>
    </AccessControl>
  );
}

function MatchCard({ match }: { match: Match }) {
  const [betAmount, setBetAmount] = useState(0.0001);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    async function init() {
      if (typeof window.ethereum !== "undefined") {
        const web3Provider = new BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        const signer = await web3Provider.getSigner();
        const bettingContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(bettingContract);
      }
    }
    init();
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet.");
    }
  };

  const placeBet = async (team: string) => {
    if (!contract || !account) return alert("Please connect your wallet first.");
    
    const formattedTeam = team === match.team1 ? match.team1 : match.team2;

    try {
      console.log(`Placing bet of ${betAmount} ETH on team ${formattedTeam}`);
      const tx = await contract.placeBet(formattedTeam, { value: parseEther(betAmount.toString()) });
      console.log("Transaction sent:", tx);
      await tx.wait();
      alert("Bet placed successfully!");
      fetchBets();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error placing bet:", error.message);
        alert(`Error placing bet: ${error.message}`);
      } else {
        console.error("Unknown error placing bet:", error);
        alert("An unknown error occurred while placing the bet.");
      }
    }
  };

  const fetchBets = async () => {
    if (!contract) return;
  
    try {
      const events = await contract.queryFilter("BetPlaced");
  
      // Filter bets only for the current match
      const formattedBets = events
        .map((event) => {
          const parsedLog = contract.interface.parseLog(event);
          if (parsedLog) {
            const teamIdentifier = parsedLog.args[2]; // "team1" or "team2"
            return {
              user: parsedLog.args[0],
              amount: formatEther(parsedLog.args[1]),
              team: teamIdentifier === match.team1 ? match.team1 : match.team2, // Convert to actual team names
            };
          }
          return null;
        })
        .filter((bet) => bet !== null) as Bet[];
  
      setBets(formattedBets);
    } catch (error) {
      console.error("Error fetching bets:", error);
    }
  };
  

  useEffect(() => {
    if (contract) fetchBets();
  }, [contract]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{match.sport}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-white">
          {match.team1} vs {match.team2}
        </p>
        <p className="text-gray-300">Date: {match.date} | Time: {match.time}</p>
        <p className="text-gray-300">Venue: {match.venue}</p>

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={() => placeBet(match.team1)} className="text-black">
            Bet on {match.team1}
          </Button>
          <Button onClick={() => placeBet(match.team2)} className="text-black">
            Bet on {match.team2}
          </Button>
        </div>

        {account ? (
          <p className="mt-4 text-green-500">Connected: {account}</p>
        ) : (
          <Button onClick={connectWallet} className="mt-4 w-full">
            Connect Wallet
          </Button>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Placed Bets</h3>
          {bets.length > 0 ? (
            <ul className="space-y-2">
              {bets.map((bet, index) => (
                <li key={index} className="text-gray-400">
                  {bet.user.slice(0, 6)}... bet {bet.amount} ETH on {bet.team}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bets placed yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
