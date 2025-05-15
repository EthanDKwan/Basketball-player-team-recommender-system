'use client'
import { SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import TableauEmbed from '../components/TableauEmbed'

export default function Explore() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2 flex items-center justify-center gap-2">
            <SparklesIcon className="text-amber-400" /> NBA Explore & Visualization
          </h1>
          <p className="text-amber-200">
            Use the interactive visualization below to explore player–team fits or try out your recommended fits.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/recommender" className="text-amber-400 hover:text-amber-300 text-sm">
              Recommender
            </Link>
            <Link href="/examples" className="text-amber-400 hover:text-amber-300 text-sm">
              Examples
            </Link>
            <Link href="/about" className="text-amber-400 hover:text-amber-300 text-sm">
              About
            </Link>
          </div>
        </header>

        {/* Tableau Visualization */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-amber-800">
          <h2 className="text-xl font-semibold text-amber-100 mb-4">
            NBA Players: Offensive vs Defensive Impact (2024-2025 Season)
          </h2>
          <div className="w-full h-full min-h-[600px]">
            <TableauEmbed 
              vizUrl="NBAPlayersasPCAScatterplot2024-2025regularseason/Sheet1"
            />
          </div>
          <p className="text-amber-300 text-sm mt-2">
            Explore how NBA players compare in offensive and defensive impact (engineered metrics).
          </p>
        </div>
      </div>
    </div>
  )
}
