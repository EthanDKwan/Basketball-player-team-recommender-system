'use client' // Add this at the top if using interactivity
import { SparklesIcon, ArrowLeftIcon} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
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
          <SparklesIcon className="text-amber-400" /> About our NBA Recommender System</h1>
        
        <div className="space-y-6 text-amber-200">
	<h2 className="text-xl font-semibold text-amber-100">Why this exists</h2>
          <p>
            In the emergent era of sports analytics, teams are overloaded with counting stats. There is great potential for machine learning and data science techniques to improve performance outputs, but only if the outputs are clear, trustworthy, and integrated into existing workflows.<br/>
          </p>
          
          <p>
            NBA front-offices shouldn't need to understand PCA and cosine-similarity values - they need actionable insights. This dashboard demonstrates how a recommender system fed by current and robust player statistics can integrate into a simple, interpretable tool for assisting decision-making processes.<br/>
          </p>
          <h2 className="text-xl font-semibold text-amber-100">About</h2>
          <p>
            This recommender system uses machine learning and a heuristic-based recommender derived from counting and advanced statistics for the 2024-2025 NBA season (BBallRef) to identify player-team matches based on performance data and playing styles.
          </p>
          
          <h2 className="text-xl font-semibold text-amber-100">Model</h2>
          
          <p>
            <strong>The model</strong> accounts for 62 features (37 team statistics and 25 individual player statistics) including shooting percentages, counting stats, defensive impact, and pace compatibility. Each recommendation receives a score from 0 (least compatible) to 1 (most compatible) indicating the predicted synergy level.
          </p>
          
 
          
          <h2 className="text-xl font-semibold text-amber-100">Data Sources</h2>
          <ul className="list-disc pl-6 space-y-2">
	<p>
Basketball Reference, data accessed May 2nd 2025 </p>
            <li>NBA Advanced Stats (2024-2025)</li>
            <li>Team performance metrics (2024-2025)</li>
          </ul>

        <p>            
            Contact: Ethan Kwan, EthanDKwan@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}