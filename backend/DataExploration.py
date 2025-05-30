# -*- coding: utf-8 -*-
"""
Created on Thu May  1 12:56:29 2025

@author: edkwa
"""

from sqlalchemy import text, create_engine, inspect
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/NBA Player stats"
neonconnection=os.getenv('neonconnectionstring')
neon_engine = create_engine(neonconnection)
engine = create_engine(DATABASE_URL)



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
            
q_meta = """
            SELECT p.player_id,p.player_name,p.pos,p.team
            FROM players p
            JOIN counting_stats c USING(player_id)
            WHERE c.mp>500 AND c."3p_pct" IS NOT NULL AND c.fg_pct IS NOT NULL AND c.ft_pct IS NOT NULL
            ORDER BY p.player_id
            """
            
pd.read_sql("""
            SELECT p.player_name, c.mp,p.pos
            FROM players p JOIN counting_stats c
            ON p.player_id = c.player_id
            WHERE c.mp >500 c."3p_pct" IS NOT NULL AND c.fg_pct IS NOT NULL AND c.ft_pct IS NOT NUL
            ORDER BY p.player_id DESC;
            """,neon_engine)
            
pd.read_sql("""
            SELECT t.team, a.pw, a.w
            FROM teams t JOIN team_counting_stats c on t.team_id = c.team_id
            JOIN team_advanced_stats a on t.team_id = a.team_id
            WHERE a.w > 50
            ORDER BY a.w DESC
            """,engine)