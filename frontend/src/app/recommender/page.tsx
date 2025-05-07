'use client'
import { useState, useEffect, useRef } from 'react'
import { TrophyIcon, UserIcon, SparklesIcon, SearchIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'

type PlayerRecommendation = {
  player_name: string;
  score: number;
  position: string;
  points: number;
  current_team: string;
  reb: number;
  ast: number;
}

type TeamRecommendation = {
  team_name: string;
  score: number;
  age: number;
  pace: number;
  ortg: number;
  drtg: number;
}

type Recommendation = PlayerRecommendation | TeamRecommendation

export default function Recommender() {
  const [mode, setMode] = useState<'team' | 'player'>('team')
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length < 2) {
        setSuggestions([])
        return
      }

      setSuggestionsLoading(true)
      try {
        const endpoint = mode === 'team'
          ? `/api/autocomplete-teams/${encodeURIComponent(input)}`
          : `/api/autocomplete-players/${encodeURIComponent(input)}`
        
        const res = await fetch(`http://localhost:8000${endpoint}`)
        if (!res.ok) throw new Error('Failed to fetch suggestions')
        
        const data = await res.json()
        setSuggestions(data.suggestions || [])
      } catch (err) {
        console.error('Failed to fetch suggestions', err)
        setSuggestions([])
      } finally {
        setSuggestionsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [input, mode])

  const fetchRecommendations = async () => {
    if (!input) return
    
    setShowSuggestions(false)
    setLoading(true)
    setError(null)
    try {
      const endpoint = mode === 'team'
        ? `/api/recommend-players/${encodeURIComponent(input)}`
        : `/api/recommend-teams/${encodeURIComponent(input)}`
      
      const res = await fetch(`http://localhost:8000${endpoint}`)
      if (!res.ok) throw new Error(res.status === 404 ? 'Not found' : 'Network error')
      
      const data = await res.json()
      setResults(data.recommendations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (input.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleModeChange = (newMode: 'team' | 'player') => {
    setMode(newMode)
    setInput('')
    setResults([])
    setError(null)
    setSuggestions([])
  }

  // Helper to check if recommendation is a player
  const isPlayerRecommendation = (item: Recommendation): item is PlayerRecommendation => {
    return 'player_name' in item
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-amber-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
  <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-2 flex items-center justify-center gap-2">
    <SparklesIcon className="text-amber-400" /> NBA Player-Team Synergy Recommender System
  </h1>
  <p className="text-amber-200">
    Discover optimal player-team matches with ML-driven recommendations
  </p>
  <div className="flex justify-center gap-4 mt-4">
    <Link href="/about" className="text-amber-400 hover:text-amber-300 text-sm">
      About
    </Link>
    <Link href="/examples" className="text-amber-400 hover:text-amber-300 text-sm">
      Examples
    </Link>
  </div>


        </header>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800 shadow-sm rounded-lg p-1 border border-amber-800">
            <button
              onClick={() => handleModeChange('team')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                mode === 'team'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-100 hover:bg-gray-700'
              }`}
            >
              <TrophyIcon className="w-5 h-5 mr-2" />
              Team → Players
            </button>
            <button
              onClick={() => handleModeChange('player')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                mode === 'player'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-100 hover:bg-gray-700'
              }`}
            >
              <UserIcon className="w-5 h-5 mr-2" />
              Player → Teams
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-xl mx-auto mb-10 bg-gray-800 p-6 rounded-xl shadow-sm border border-amber-800">
          <div className="relative">
            <label className="block text-sm font-medium text-amber-100 mb-2">
              {mode === 'team' ? 'Search Teams' : 'Search Players'}
            </label>
            <div className="relative">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    if (e.target.value.length >= 2) {
                      setShowSuggestions(true)
                    } else {
                      setShowSuggestions(false)
                    }
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={
                    mode === 'team' 
                      ? 'e.g. LAL, GSW, BOS...' 
                      : 'e.g. LeBron James, Stephen Curry...'
                  }
                  className="flex-1 px-4 py-3 bg-gray-700 text-amber-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-amber-200"
                  onKeyDown={(e) => e.key === 'Enter' && fetchRecommendations()}
                />
                <button
                  onClick={fetchRecommendations}
                  disabled={!input || loading}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 rounded-lg disabled:opacity-50 flex items-center transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <SearchIcon className="w-5 h-5" />
                  )}
                  <span className="ml-2 hidden sm:inline">Search</span>
                </button>
              </div>
              
              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full bg-gray-700 rounded-lg shadow-lg border border-gray-600 max-h-60 overflow-auto">
                  {suggestionsLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-amber-100"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : input.length >= 2 && (
                    <div className="px-4 py-2 text-amber-300 text-sm">
                      No {mode === 'team' ? 'teams' : 'players'} found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-900 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item, index) => (
              <div 
                key={isPlayerRecommendation(item) ? item.player_name : item.team_name} 
                className={`bg-gray-800 p-5 rounded-xl shadow-sm border transition-all hover:shadow-md ${
                  index < 3 ? 'border-amber-400 bg-gray-700' : 'border-amber-800'
                } ${
                  isPlayerRecommendation(item) ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-amber-100">
                      {isPlayerRecommendation(item) ? item.player_name : item.team_name}
                      {isPlayerRecommendation(item) && (
                        <span className="ml-2 text-sm font-normal text-amber-300">
                          ({item.current_team})
                        </span>
                      )}
                    </h3>
                    <div className="mt-2 space-y-1">
                      {isPlayerRecommendation(item) ? (
                        <>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">Position:</span> {item.position}
                          </p>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">Pts/36m:</span> {item.points.toFixed(1)}
                          </p>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">REB/36m:</span> {item.reb.toFixed(1)}
                          </p>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">AST/36m:</span> {item.ast.toFixed(1)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">Age:</span> {item.age} years
                          </p>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">Pace:</span> {item.pace}
                          </p>
			  <p className="text-sm text-amber-200">
                            <span className="font-medium">ORtg:</span> {item.ortg}
                          </p>
                          <p className="text-sm text-amber-200">
                            <span className="font-medium">DRtg:</span> {item.drtg}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 text-white font-bold">
                      {item.score.toFixed(2)}
                    </span>
                    {index < 3 && (
                      <span className="block mt-1 text-xs font-medium text-amber-400">
                        {index === 0 ? 'Best Match' : 'Top Pick'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-amber-800">
                <SearchIcon className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-amber-100 mb-1">
                {mode === 'team' ? 'Find Players for a Team' : 'Find Teams for a Player'}
              </h3>
              <p className="text-amber-200">
                {mode === 'team' 
                  ? 'Enter a team name to see recommended players'
                  : 'Enter a player name to see recommended teams'}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}