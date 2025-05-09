# -*- coding: utf-8 -*-
"""
Created on Tue May  6 15:25:34 2025

@author: edkwa
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os


app = FastAPI(title="2025 NBA Recommender API")

# Allow CORS for your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For local development
        "https://nbarecommender.vercel.app",  # production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=['*']
)


load_dotenv()
neonconnection=os.getenv('neonconnectionstring')
engine = create_engine(neonconnection)
q_meta = """
SELECT p.player_id,p.player_name,p.pos,p.team, c.pts, c.trb, c.ast
FROM players p
JOIN counting_stats c USING(player_id)
WHERE c.mp>500 AND c."3p_pct" IS NOT NULL AND c.fg_pct IS NOT NULL AND c.ft_pct IS NOT NULL
ORDER BY p.player_id
"""
player_metadata = pd.read_sql(q_meta,engine)
#player_metadata = player_metadata[~player_metadata.index.duplicated(keep='last')]
player_metadata = player_metadata.drop_duplicates(subset=['player_name'], keep='last')

team_q_meta = """
SELECT t.team, a.pace, a.age, a.drtg, a.ortg
FROM teams t
JOIN team_advanced_stats a USING (team_id)
"""
team_metadata = pd.read_sql(team_q_meta,engine)

# Load your recommender DataFrame
df = pd.read_pickle("heuristic_recommender_core.pkl")
df = df[~df.index.duplicated(keep='first')]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Recommender System API"}

@app.get("/api/teams")
async def get_teams():
    """Return list of available teams"""
    return {"teams": df.columns.tolist()}

@app.get("/api/teams/search")
async def team_search(query: str):
    teams = df.columns.tolist()
    return [t for t in teams if query.lower() in t.lower()]

@app.get("/api/players")
async def get_players():
    """Return list of all players"""
    return {"players": df.index.tolist()}

@app.get("/api/players/search")
async def player_search(query:str=""):
    players = df.index.tolist()
    return [p for p in players if query.lower() in p.lower()]

@app.get("/api/autocomplete-players/{query}")
async def autocomplete_players(query: str) -> dict:
    suggestions = [player for player in df.index.tolist() if query.lower() in player.lower()]
    return {"suggestions": suggestions[:10]}  # Limit to top 10 matches

@app.get("/api/autocomplete-teams/{query}")
async def autocomplete_teams(query: str) -> dict:
    suggestions = [team for team in df.columns.tolist() if query.lower() in team.lower()]
    return {"suggestions": suggestions[:10]}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/recommend-players/{team_name}")
async def recommend(team_name: str, top_n: int = 8):
    """Get top N player recommendations for a team"""
    if team_name not in df.columns:
        return {"error": "Team not found"}    
    recommendations = (
        df[team_name].sort_values(ascending=False).head(top_n).to_dict()
        )
    
    enriched_recommendations= []
    for player_name, score in recommendations.items():
        player_data = player_metadata.loc[player_metadata['player_name']==player_name,['pos','team','pts','trb','ast']].iloc[0]
        enriched_recommendations.append({
            "player_name": player_name,
            "score": score,
            "position": player_data['pos'],
            "points": (player_data['pts']),
            "current_team": player_data['team'],
            "reb": player_data['trb'],
            'ast': player_data['ast']
            })
        
    return {"team": team_name, "recommendations": enriched_recommendations}

@app.get("/api/recommend-teams/{player_name}")
async def recommend_teams(player_name: str, top_n: int = 5):
    """Get top N team recommendations for a player"""
    if player_name not in df.index:
        return {"error": "Player not found"}
    raw_recs = (df.loc[player_name].sort_values(ascending=False).head(top_n).to_dict())
    enriched_recommendations = []
    for team_name, score in raw_recs.items():    
        team_data = team_metadata.loc[team_metadata['team']==team_name,['age','pace','ortg','drtg']].iloc[0]
        enriched_recommendations.append({
            "team_name" : team_name,
            "score": score,
            "age": team_data['age'],
            "pace": team_data['pace'],
            "ortg": team_data['ortg'],
            "drtg": team_data['drtg']           
        })
    return {"player": player_name, "recommendations": enriched_recommendations}

@app.get("/api/all-data")
async def get_all_data():
        """Return entire dataframe for frontend processing"""
        return{
            "players": df.index.tolist(),
            "teams": df.columns.tolist(),
            "data":df.to_dict()
            }
