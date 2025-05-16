// app/examples/page.tsx
'use client';

import Link from 'next/link';

interface MatchCardProps {
  player: string;
  team: string;
  score: number;
  insight: string;
}

function MatchCard({ player, team, score, insight }: MatchCardProps) {
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

export default function ExamplesPage() {
  const featuredMatches: MatchCardProps[] = [
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2 flex items-center justify-center gap-2">
            Top player-team matches
          </h1>
          <p className="text-amber-200">
            Explore these top player-team recommendations on the explore page
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/recommender" className="text-amber-400 hover:text-amber-300 text-sm">
              Recommender
            </Link>
            <Link href="/explore" className="text-amber-400 hover:text-amber-300 text-sm">
              Explore
            </Link>
            <Link href="/about" className="text-amber-400 hover:text-amber-300 text-sm">
              About
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-8">
            Recommended Player-Team Matches
          </h1>

          {/* Featured Matches Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {featuredMatches.map((match) => (
              <MatchCard key={`${match.player}-${match.team}`} {...match} />
            ))}
          </div>

          {/* Placeholder for embedded visualization */}
          
        </div>
      </div>
    </div>
  );
}
