// app/examples/page.tsx
'use client';
import { BarChart, ShoppingBasket } from 'lucide-react'; // Or use custom icons

export default function ExamplesPage() {
  const featuredMatches = [
    {
      player: "Zach LaVine",
      team: "Denver Nuggets",
      score: 0.99,
      insight: "Elite 3PT shooting, off-ball scoring and wing length to complement a heliocentric offense built on cutting and spacing"
    },
    {
      player: "Scottie Barnes",
      team: "Oklahoma City Thunder",
      score: 0.98,
      insight: "All star wing whose post scoring and athleticism complements an elite defense"
    },
	{
      player: "Landry Shamet",
      team: "New Orleans Pelicans",
      score: 0.98,
      insight: "Elite 3PT shooting role player who has fallen out of the lineup in NYK, a title contender stacked with guard talent"
    },
{
      player: "Day'ron Sharpe",
      team: "Boston Celtics",
      score: 0.98,
      insight: "Bruising young forward who has improved FT shooting over his young career"
    }
];


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
        <ShoppingBasket className="text-orange-500" /> 
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