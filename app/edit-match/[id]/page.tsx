"use client";

import { useRouter } from "next/navigation";
import { useMatches } from "../../contexts/MatchesContext"; 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 

export default function EditMatchPage() {
  const router = useRouter();
  const { id } = useParams(); 
  const { matches, updateMatch } = useMatches();
  const [matchDetails, setMatchDetails] = useState<any>(null);

  useEffect(() => {
    if (id && matches.length > 0) {
      const matchToEdit = matches.find((match) => match.id === id);
      setMatchDetails(matchToEdit);
    }
  }, [id, matches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMatchDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchDetails) {
      updateMatch(matchDetails); 
      router.push("/"); 
    }
  };

  if (!matchDetails) return <p>Loading...</p>;

  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Edit Match</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Sport</label>
              <input
                type="text"
                name="sport"
                value={matchDetails.sport}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Team 1</label>
              <input
                type="text"
                name="team1"
                value={matchDetails.team1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Team 2</label>
              <input
                type="text"
                name="team2"
                value={matchDetails.team2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={matchDetails.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={matchDetails.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Venue</label>
              <input
                type="text"
                name="venue"
                value={matchDetails.venue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
