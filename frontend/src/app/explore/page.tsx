'use client'
import { useState, useEffect } from 'react'
import { SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import TableauEmbed from '../components/TableauEmbed'

export default function Explore() {
  const [playerName, setPlayerName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [playerSuggestions, setPlayerSuggestions] = useState<string[]>([])
  const [teamSuggestions, setTeamSuggestions] = useState<string[]>([])
  const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(null)
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | null>(null)
  const [showPlayerSuggestions, setShowPlayerSuggestions] = useState(false)
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false)
  const [submittedPlayerName, setSubmittedPlayerName] = useState('')
  const [submittedTeamName, setSubmittedTeamName] = useState('')
  const [resetTrigger, setResetTrigger] = useState(false)

  const handleSubmit = () => {
    setSubmittedPlayerName(playerName)
    setSubmittedTeamName(teamName)
    setResetTrigger(false) // Ensure visualization updates
    console.log('Submitted:', playerName, teamName)
  }

  const handleReset = () => {
    setPlayerName('')
    setTeamName('')
    setSubmittedPlayerName('')
    setSubmittedTeamName('')
    setResetTrigger(true)
  }

  // Fetch player name suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (playerName.trim().length === 0) {
        setPlayerSuggestions([])
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/autocomplete-players/${encodeURIComponent(playerName)}`)
        const data = await res.json()
        setPlayerSuggestions(data.suggestions || [])
      } catch (err) {
        console.error('Autocomplete fetch failed for player:', err)
      }
    }

    const delayDebounce = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(delayDebounce)
  }, [playerName])

  // Fetch team name suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (teamName.trim().length === 0) {
        setTeamSuggestions([])
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/autocomplete-teams/${encodeURIComponent(teamName)}`)
        const data = await res.json()
        setTeamSuggestions(data.suggestions || [])
      } catch (err) {
        console.error('Autocomplete fetch failed for team:', err)
      }
    }

    const delayDebounce = setTimeout(fetchSuggestions, 200)
    return () => clearTimeout(delayDebounce)
  }, [teamName])

  // Handle keyboard navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    suggestions: string[],
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>,
    isPlayer: boolean
  ) => {
    if (suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      setActiveIndex((prevIndex) => (prevIndex === null || prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1))
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prevIndex) => (prevIndex === null || prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1))
    } else if (e.key === 'Enter') {
      if (activePlayerIndex !== null && isPlayer) {
        setInput(suggestions[activePlayerIndex])
        setActiveIndex(null)
        setShowPlayerSuggestions(false)
      } else if (activeTeamIndex !== null && !isPlayer) {
        setInput(suggestions[activeTeamIndex])
        setActiveIndex(null)
        setShowTeamSuggestions(false)
      } else {
        handleSubmit()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setInput: React.Dispatch<React.SetStateAction<string>>, isPlayer: boolean) => {
    setInput(e.target.value)
    if (isPlayer) {
      setActivePlayerIndex(null)
      setShowPlayerSuggestions(true)
    } else {
      setActiveTeamIndex(null)
      setShowTeamSuggestions(true)
    }
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - keep this exactly the same */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2 flex items-center justify-center gap-2">
            <SparklesIcon className="text-amber-400" /> NBA Explore & Visualization
          </h1>
          <p className="text-amber-200">
            Input player and team names to begin exploring
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

        {/* Main Content Area - restructured to separate form and visualization */}
        <div className="space-y-6">
          {/* Input Form - moved into its own card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm border border-amber-800">
            {/* Player Input - keep exactly the same */}
            <div>
              <label className="block text-sm font-medium text-amber-100 mb-1">
                Player Name
              </label>
              <input
                value={playerName}
                onChange={(e) => handleInputChange(e, setPlayerName, true)}
                onKeyDown={(e) => handleKeyDown(e, playerSuggestions, setPlayerName, setActivePlayerIndex, true)}
                onBlur={() => setTimeout(() => setShowPlayerSuggestions(false), 150)}
                onFocus={() => setShowPlayerSuggestions(true)}
                placeholder="e.g. LeBron James"
                className="w-full px-4 py-3 bg-gray-700 text-amber-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder-amber-300"
              />
              {playerSuggestions.length > 0 && showPlayerSuggestions && (
                <ul className="bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto text-amber-100">
                  {playerSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion}
                      onClick={() => {
                        setPlayerName(suggestion)
                        setActivePlayerIndex(null)
                        setShowPlayerSuggestions(false)
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-amber-600 ${activePlayerIndex === index ? 'bg-amber-600' : ''}`}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Team Input - keep exactly the same */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-amber-100 mb-1">
                Team Name
              </label>
              <input
                value={teamName}
                onChange={(e) => handleInputChange(e, setTeamName, false)}
                onKeyDown={(e) => handleKeyDown(e, teamSuggestions, setTeamName, setActiveTeamIndex, false)}
                placeholder="e.g. Lakers"
                className="w-full px-4 py-3 bg-gray-700 text-amber-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 placeholder-amber-300"
              />
              {teamSuggestions.length > 0 && showTeamSuggestions && (
                <ul className="bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto text-amber-100">
                  {teamSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion}
                      onClick={() => {
                        setTeamName(suggestion)
                        setActiveTeamIndex(null)
                        setShowTeamSuggestions(false)
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-amber-600 ${activeTeamIndex === index ? 'bg-amber-600' : ''}`}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Submit
              </button>
            </div>

            {/* Show submitted values */}
            <div className="mt-4 text-amber-200 text-center">
              <p><strong>Player Name:</strong> {submittedPlayerName}</p>
              <p><strong>Team Name:</strong> {submittedTeamName}</p>
            </div>
          </div>

          {/* Tableau Visualization Card */}
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
              Explore how NBA players compare in offensive and defensive impact metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}