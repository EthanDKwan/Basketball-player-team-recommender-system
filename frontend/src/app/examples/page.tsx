// app/examples/page.tsx
'use client';
import { BarChart, BasketballIcon } from 'lucide-react'; // Or use custom icons

export default function ExamplesPage() {
  const featuredMatches = [
    {
      player: "Fred VanVleet",
      team: "Houston Rockets",
      score: 0.99,
      insight: "Elite 3PT shooting, scoring, and veteran leadership complements a young defensive minded team"
    },
    {
      player: "Jusuf Nurkic",
      team: "Los Angeles Lakers",
      score: 0.80,
      insight: "Pick and roll big to complement an offense with two primary ball handlers and offering rim protection at a veteran's discount"
    }
  ];
{
      player: "Micah Potter",
      team: "Utah Jazz",
      score: 0.96,
      insight: "Floor spacing big primarily playing in G league showing year over year growth in Utah system"
    }


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
        <BasketballIcon className="text-orange-500" /> 
        Recommended Player-Team Matches
      </h1>

      {/* Featured Matches Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {featuredMatches.map((match) => (
          <MatchCard key={`${match.player}-${match.team}`} {...match} />
        ))}
      </div>

      {/* Embedded Visualization */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Top 10 Synergy Scores</h2>
        <div className="h-96">
          <iframe 
            src="/top_matches.html" // Or embedded Tableau/PowerBI
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}

// Reusable component
function MatchCard({ player, team, score, insight }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold">{player} → {team}</h3>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Score: {score.toFixed(2)}
        </span>
      </div>
      <p className="text-gray-600">{insight}</p>
      <div className="mt-4 h-8 bg-gray-100 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full" 
          style={{ width: `${score * 100}%` }}
        />
      </div>
    </div>
  );
}