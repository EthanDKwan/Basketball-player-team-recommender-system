'use client'
import { SparklesIcon, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AboutPage() {
  useEffect(() => {
    fetch('https://nbarecommender.onrender.com/health')
      .catch(err => console.debug('Backend health check failed:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900 p-8">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          href="/recommender"
          className="inline-flex items-center text-amber-400 hover:text-amber-200 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Return to Recommender
        </Link>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-amber-800">
        <h1 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-2">
          <SparklesIcon className="text-amber-400" /> About our NBA Recommender System
        </h1>
        
        <div className="space-y-6 text-amber-200">
          <h2 className="text-xl font-semibold text-amber-100">Why this exists</h2>
          <p>
            Have you ever watched a player and thought: &quot;they would be a great fit on x team. What if they could play with y player.&quot; As an NBA fan, I&apos;ve had endless conversations about the latest trades, free-agent signings, etc. In the emergent era of sports analytics, performance metrics are abundant. From an NBA front-office perspective, there is great potential for data tools to improve performance, but only if the outputs are clear, trustworthy, and integrated into existing workflows.<br/>
          </p>
          
          <p>
            NBA front-offices or fans shouldn&apos;t need to understand PCA and cosine-similarity values; they want insights about their favorite players and teams. This dashboard demonstrates how a recommender system fed by current and robust player statistics can integrate into a simple, interpretable tool for assisting decision-making processes. <br/>
          </p>
          
          <h2 className="text-xl font-semibold text-amber-100">About</h2>
          <p>
            This recommender system uses machine learning and a heuristic-based recommender derived from vectorized counting and advanced statistics for the 2024-2025 NBA season (BBallRef) to identify player-team matches based on performance data and playing styles.
          </p>
          
          <h2 className="text-xl font-semibold text-amber-100">Model</h2>
          <p>
            <strong>The model</strong> accounts for 68 raw metrics (37 team statistics and 31 individual player statistics) including shooting percentages, counting stats, defensive impact, and pace compatibility along with 10 engineered features. Each recommendation receives a score from 0 (least compatible) to 1 (most compatible) indicating the predicted synergy level.
          </p>
          
          <h2 className="text-xl font-semibold text-amber-100">Data Sources</h2>
          <ul className="list-disc pl-6 space-y-2">
            <p>Basketball Reference, data accessed May 2nd 2025</p>
            <li>NBA Advanced Stats (2024-2025)</li>
            <li>Team performance metrics (2024-2025)</li>
          </ul>

          <p>Contact: Ethan Kwan, EthanDKwan@gmail.com</p>
        </div>
      </div>
    </div>
  )
}