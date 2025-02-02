export interface Match {
  id: string;
  contractMatchId: number;
  sport: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  result?: string;
}

export interface Bet {
  user: string;
  amount: string;
  team: string;
}