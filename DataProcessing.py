# -*- coding: utf-8 -*-
"""
Created on Wed Apr 30 15:29:28 2025

@author: edkwa
"""

from sqlalchemy import create_engine, inspect, text
import pandas as pd


"""
PLAYER STATS
"""
#Loading raw csv data
counting_data = pd.read_excel('BBallrefData.xlsx', sheet_name = 'Counting Stats')
advanced_data = pd.read_excel('BBallrefData.xlsx',sheet_name = 'Advanced Stats')

#Writing to PostgreSQL
engine = create_engine('postgresql://postgres:4049@localhost:5432/NBA Player stats')
#print(engine.table_names()) # Lets you see the names of the tables present in the database
#FULL RESET of tables
with engine.begin() as conn:
    conn.execute(text("TRUNCATE players, counting_stats, advanced_stats RESTART IDENTITY;"))


players = counting_data[['player_name','team','pos','age']]
players.to_sql("players", engine, if_exists="append", index=False)

#Fetch player_id mappings (to ensure stats are linked correctly)
players_db = pd.read_sql("SELECT player_name, player_id, team FROM players", engine)

counting_stats_needed = ['player_name','team','mp','pts','ast','trb','stl','blk','fg_pct','3p_pct','ft_pct','tov']
counting_stats = counting_data[counting_stats_needed]
counting_stats_merged = counting_stats.merge(players_db, on=['player_name','team'])
counting_stats_final = counting_stats_merged[['player_id','mp','pts','ast','trb','stl','blk','fg_pct','3p_pct','ft_pct','tov']]
counting_stats_final.to_sql('counting_stats',engine,if_exists='append',index=False)

advanced_stats_needed = ['player_name','team','per','bpm','vorp','usg','ws']
advanced_stats = advanced_data[advanced_stats_needed]
advanced_stats_merged = advanced_stats.merge(players_db, on = ['player_name','team'])
advanced_stats_final = advanced_stats_merged[['player_id','per','bpm','vorp','usg','ws']]
advanced_stats_final.to_sql('advanced_stats',engine,if_exists='append',index=False)

#validate outputs?
inspector = inspect(engine)
tables = inspector.get_table_names()
print(tables)

df = pd.read_sql('select * from players', engine)
print("players table: ", df.head())
df2 = pd.read_sql('SELECT * FROM counting_stats',engine)
print("counting stats : ", df2.head())
df3 = pd.read_sql('SELECT * FROM advanced_stats',engine)
print('advanced stats : ', df3.head())


"""
TEAM STATS
"""
#Loading raw csv data
team_counting_data = pd.read_excel('BBallrefteamstats.xlsx', sheet_name = 'Counting Stats')
team_advanced_data = pd.read_excel('BBallrefteamstats.xlsx',sheet_name = 'Advanced Stats')

with engine.begin() as conn:
    conn.execute(text("TRUNCATE teams, team_counting_stats, team_advanced_stats RESTART IDENTITY;"))

teams = team_counting_data[['full_team_name','team']]
teams.to_sql('teams',engine,if_exists='append',index=False)

dft = pd.read_sql('select * from teams',engine)
print("teams table: ", dft.head())


teams_db = pd.read_sql("SELECT team, team_id FROM teams", engine)

team_counting_stats_needed = ['team','g','mp','fg','fga','fg_pct','3p','3pa','3p_pct','2p','2p_pct','ft','fta','ft_pct','orb','drb','trb','ast','stl','blk','tov','pf','pts']
team_counting_stats = team_counting_data[team_counting_stats_needed]
team_counting_stats_merged = team_counting_stats.merge(teams_db, on = ['team'])
team_counting_stats_final = team_counting_stats_merged[['team_id','g','mp','fg','fga','fg_pct','3p','3pa','3p_pct','2p','2p_pct','ft','fta','ft_pct','orb','drb','trb','ast','stl','blk','tov','pf','pts']]
team_counting_stats_final.to_sql('team_counting_stats',engine,if_exists='append',index=False)

dft2 = pd.read_sql("SELECT * FROM team_counting_stats", engine)
print("team_counting_stats table: ", dft2.head())

team_advanced_stats_needed = ['team','age','w','l','pw','pl','mov','sos','srs','ortg','drtg','nrtg','pace','ftr','3par','ts_pct']
team_advanced_stats = team_advanced_data[team_advanced_stats_needed]
team_advanced_stats_merged = team_advanced_stats.merge(teams_db, on=['team'])
team_advanced_stats_final = team_advanced_stats_merged[['team_id','age','w','l','pw','pl','mov','sos','srs','ortg','drtg','nrtg','pace','ftr','3par','ts_pct']]
team_advanced_stats_final.to_sql('team_advanced_stats',engine,if_exists='append',index=False)

dft3 = pd.read_sql("SELECT * FROM team_advanced_stats", engine)
print("team_advanced_stats: ", dft3.head())



players.to_sql("players", engine, if_exists="append", index=False)