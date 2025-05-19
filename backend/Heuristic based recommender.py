# -*- coding: utf-8 -*-
"""
Created on Thu May  1 15:08:29 2025

@author: edkwa
"""
import os
os.environ["OMP_NUM_THREADS"] = "2"

from sqlalchemy import create_engine, MetaData
import pandas as pd
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt
import numpy as np

from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/NBA Player stats"
engine = create_engine(DATABASE_URL)

q = """
SELECT p.age, c.*, a.*
FROM players p 
JOIN counting_stats c USING (player_id) 
JOIN advanced_stats a USING (player_id)
WHERE c.mp>500 AND c."3p_pct" IS NOT NULL AND c.fg_pct IS NOT NULL AND c.ft_pct IS NOT NULL
ORDER BY p.player_id
"""
player_stats= pd.read_sql(q,engine).drop(columns=['player_id']) ##THIS IS THE LIST OF PLAYERS USED

q_meta = """
SELECT p.player_id,p.player_name,p.pos,p.team
FROM players p
JOIN counting_stats c USING(player_id)
WHERE c.mp>500 AND c."3p_pct" IS NOT NULL AND c.fg_pct IS NOT NULL AND c.ft_pct IS NOT NULL
ORDER BY p.player_id
"""
player_metadata = pd.read_sql(q_meta,engine)


player_scaled = StandardScaler().fit_transform(player_stats)
pca = PCA()
player_data_reduced = pca.fit_transform(player_scaled)
#Calculate eigenvalues and cumulative eigenvalues
eigenvalues = pca.explained_variance_
total_eigenvalues = np.sum(eigenvalues)
cumulative_eigenvalues = np.cumsum(eigenvalues)
normalized_cumulative_eigenvalues = cumulative_eigenvalues/total_eigenvalues

#plot cumulative eigenvalues for each component
plt.plot(range(1,len(cumulative_eigenvalues)+1), normalized_cumulative_eigenvalues, 'bo-')
plt.xlabel('Number of Components')
plt.ylabel('Cumulative Eigenvalues')
plt.title('PCA results: eigen cumsum for all player data')
plt.show()

#Visualize PCs
plt.figure()
plt.scatter(player_data_reduced[:,0],player_data_reduced[:,1],alpha=0.5)
#Annotate PC plot
sample_size = 15
for i in range(sample_size):
    plt.text(player_data_reduced[i,0],player_data_reduced[i,1],player_metadata.iloc[i]['player_name'],fontsize=8,alpha=0.7)    
    
#Annotate specific players
stars = ['LeBron James','Stephen Curry','Giannis Antetokounmpo']
for i, name in enumerate(player_metadata.player_name):
    if name in stars:
        plt.text(player_data_reduced[i,0],player_data_reduced[i,1],name,fontsize=10,weight='bold',color='red')

plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
plt.title('Players along PC1-2')
plt.grid(alpha=0.2)
plt.show()

player_pca = PCA(n_components = 5)
player_vectors = player_pca.fit_transform(player_scaled)
player_names = player_metadata['player_name'].values
player_vectors_df = pd.DataFrame(player_vectors,columns=[f"player_pc{i}" for i in range(1,6)],index = player_names)

players_pca = player_vectors_df[['player_pc1','player_pc2']].copy()
players_pca = players_pca.reset_index()
players_pca = players_pca.rename(columns = {
    'index':'player_name',
    'player_pc1':'pc1',
    'player_pc2':'pc2'}) #THIS IS WHAT I PUT INTO THE .CSV


players_db = pd.read_sql("SELECT p.player_name, p.player_id, p.team, p.pos, c.mp FROM players p JOIN counting_stats c ON p.player_id=c.player_id", engine)
players_pca_merged = players_pca.merge(players_db, on=['player_name'])
players_pca_final = players_pca_merged[['player_id','pc1','pc2']]
#players_pca_final.to_sql('players_engineered',engine,if_exists='append',index=False)

neonconnection=os.getenv('neonconnectionstring')
neon_engine = create_engine(neonconnection)

print(f"Transferring 'players_engineered'...")
df = pd.read_sql(f"SELECT * FROM players_engineered", engine)
#df.to_sql('players_engineered', neon_engine, if_exists='replace', index=False)
print(f"✅  playeres_engineered row copied")

print("All tables transferred!")

"""
TEAM STATS--------------------------------------------------------------------
"""
tq = """
SELECT t.team, c.*, a.*
FROM teams t 
JOIN team_counting_stats c USING (team_id) 
JOIN team_advanced_stats a USING (team_id)
ORDER BY t.team_id
"""
team_stats= pd.read_sql(tq,engine).drop(columns=['team_id','team'])

q_meta = """
SELECT t.team_id,t.full_team_name,t.team
FROM teams t
ORDER BY t.team_id
"""
team_metadata = pd.read_sql(q_meta,engine)

team_scaled = StandardScaler().fit_transform(team_stats)
pca = PCA()
team_data_reduced = pca.fit_transform(team_scaled)
#Calculate eigenvalues and cumulative eigenvalues
team_eigenvalues = pca.explained_variance_
total_team_eigenvalues = np.sum(team_eigenvalues)
cumulative_team_eigenvalues = np.cumsum(team_eigenvalues)
normalized_team_cumulative_eigenvalues = cumulative_team_eigenvalues/total_team_eigenvalues

#plot cumulative eigenvalues for each component
plt.plot(range(1,len(cumulative_team_eigenvalues)+1), normalized_team_cumulative_eigenvalues, 'bo-')
plt.xlabel('Number of Components')
plt.ylabel('Cumulative Eigenvalues')
plt.title('PCA results: eigen cumsum for all team data')
plt.show()

#Visualize PCs
plt.figure()
plt.scatter(team_data_reduced[:,0],team_data_reduced[:,1],alpha=0.5)
#Annotate PC plot
sample_size = 8
for i in range(sample_size):
    plt.text(team_data_reduced[i,0],team_data_reduced[i,1],team_metadata.iloc[i]['team'],fontsize=8,alpha=0.7)
    
#Annotate specific players
champs = ['BOS','DEN','GSW']
for i, name in enumerate(team_metadata.team):
    if name in champs:
        plt.text(team_data_reduced[i,0],team_data_reduced[i,1],name,fontsize=10,weight='bold',color='red')

plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
plt.title('Teams along PC1-2')
plt.grid(alpha=0.2)
plt.show()
   
team_pca = PCA(n_components = 5)
team_vectors = team_pca.fit_transform(team_scaled)
team_names = team_metadata['team'].values
team_vectors_df = pd.DataFrame(team_vectors,columns=[f"team_pc{i}" for i in range(1,6)],index = team_names)


"""
HEURISTIC
"""
team_vectors_norm = normalize(team_vectors_df)
player_vectors_norm = normalize(player_vectors_df)
fit_scores = cosine_similarity(player_vectors_norm,team_vectors_norm)
fit_df = pd.DataFrame(fit_scores,index=player_names, columns = team_names)
fit_df.to_pickle('heuristic_recommender_core.pkl')
#Recommendations
LAL_fits = fit_df["LAL"].sort_values(ascending=False).head(5)
Giannis_fits = fit_df.loc["Giannis Antetokounmpo"].sort_values(ascending=False).head(3)
print("Lakers fits: ", LAL_fits)
print("Giannis fits: ", Giannis_fits)
 

