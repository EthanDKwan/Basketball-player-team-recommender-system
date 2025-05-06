# -*- coding: utf-8 -*-
"""
Created on Thu May  1 12:56:29 2025

@author: edkwa
"""

from sqlalchemy import text, create_engine, inspect
import pandas as pd
engine = create_engine('postgresql://postgres:4049@localhost:5432/NBA Player stats')

# My 3 Tables in SQL Database
pd.read_sql("SELECT COUNT(*) FROM players",engine)
pd.read_sql("SELECT COUNT(*) FROM counting_stats",engine)
pd.read_sql("SELECT COUNT(*) FROM advanced_stats",engine)

pd.read_sql("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'counting_stats'",engine)


#Verify no extra id's were added in counting_stats or advanced_stats
pd.read_sql("""
SELECT * FROM counting_stats WHERE player_id NOT IN (SELECT player_id FROM players)
            """, engine)

#Use JOIN to query player name, pts, and per from 3 tables
pd.read_sql("""
SELECT p.player_name, c.pts, a.per FROM players p
JOIN counting_stats c ON p.player_id = c.player_id
JOIN advanced_stats a ON p.player_id=a.player_id
            """,engine)
    
#Use JOIN to query player, team, pts from 2 tables, ORDERed by pts
pd.read_sql("""
SELECT p.player_name, p.team, c.pts FROM players p
JOIN counting_stats c ON p.player_id = c.player_id
ORDER BY c.pts DESC LIMIT 15
            """,engine)
            
#Use JOIN to query team averages
pd.read_sql("""
            SELECT p.team, AVG(c.pts)
            FROM players p JOIN counting_stats c ON p.player_id=c.player_id
            GROUP BY p.team ORDER by AVG(c.pts)
            """, engine)
            
pd.read_sql("""
            SELECT p.player_name, c.pts
            FROM players p JOIN counting_stats c ON p.player_id=c.player_id
            WHERE c.pts > 20 AND c.mp >1000
            ORDER by c.pts DESC
            """,engine)
            
            
            
            
pd.read_sql("""
            SELECT 
    p.team,
    COUNT(*) as player_count,
    AVG(c.pts_per_36) as avg_pts
FROM players p
JOIN counting_stats c ON p.player_id = c.player_id
WHERE p.pos = 'PG'
GROUP BY p.team
HAVING AVG(c.pts_per_36) > 15
ORDER BY avg_pts DESC
LIMIT 5;
            """,engine)
            
            
pd.read_sql("""
            SELECT t.team,c.*
            FROM teams t JOIN team_counting_stats c ON t.team_id=c.team_id
            WHERE c.pts <100
            ORDER by c.pts DESC
            """,engine)
            
pd.read_sql("""
            SELECT t.team, c.pts, a.pw, a.w
            FROM teams t JOIN team_counting_stats c ON t.team_id = c.team_id
            JOIN team_advanced_stats a on t.team_id = a.team_id
            WHERE c.pts <100
            ORDER BY a.w DESC
            """,engine)
            
pd.read_sql("""
            SELECT t.team, a.pw, a.w
            FROM teams t JOIN team_counting_stats c on t.team_id = c.team_id
            JOIN team_advanced_stats a on t.team_id = a.team_id
            WHERE a.w > 50
            ORDER BY a.w DESC
            """,engine)