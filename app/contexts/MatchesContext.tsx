"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { db } from "@/lib/firebase"; // Import Firestore instance
import { collection, addDoc, onSnapshot, query, doc, updateDoc } from "firebase/firestore"; // Import Firestore functions

export interface Match {
  id: string; // Firestore uses string IDs
  sport: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
}

interface MatchesContextType {
  matches: Match[];
  addMatch: (match: Omit<Match, "id">) => void; // Omit 'id' when adding a match
  updateMatch: (updatedMatch: Match) => void; // Update a match
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};

export const MatchesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);

  // Fetch matches from Firestore on component mount
  useEffect(() => {
    const q = query(collection(db, "matches"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const matchesData: Match[] = [];
      querySnapshot.forEach((doc) => {
        matchesData.push({ id: doc.id, ...doc.data() } as Match);
      });
      setMatches(matchesData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Add a new match to Firestore
  const addMatch = async (match: Omit<Match, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "matches"), match);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Update an existing match in Firestore
  const updateMatch = async (updatedMatch: Match) => {
    try {
      const matchRef = doc(db, "matches", updatedMatch.id);
      await updateDoc(matchRef, {
        sport: updatedMatch.sport,
        team1: updatedMatch.team1,
        team2: updatedMatch.team2,
        date: updatedMatch.date,
        time: updatedMatch.time,
        venue: updatedMatch.venue,
      });

      // Update local state after successful update
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === updatedMatch.id ? updatedMatch : match
        )
      );
      console.log("Match updated with ID: ", updatedMatch.id);
    } catch (error) {
      console.error("Error updating match: ", error);
    }
  };

  return (
    <MatchesContext.Provider value={{ matches, addMatch, updateMatch }}>
      {children}
    </MatchesContext.Provider>
  );
};
