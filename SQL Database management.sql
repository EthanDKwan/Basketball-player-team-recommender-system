-- Database: NBA Player stats

-- DROP DATABASE IF EXISTS "NBA Player stats";

CREATE DATABASE "NBA Player stats"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en-US'
    LC_CTYPE = 'en-US'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE "NBA Player stats"
    IS 'from bballref, stats for the 2025 regular season';


-- Player metadata
create table players (
player_id serial primary key,
player_name TEXT NOT NULL,
team TEXT,
pos TEXT,
age INTEGER
);

drop table if exists counting_stats;
drop table if exists advanced_stats;

--Player counting stats
create table counting_stats(
player_id integer references players(player_id),
MP REAL,
PTS REAL,
AST REAL,
TRB REAL,
STL REAL,
BLK REAL,
FG_PCT REAL,
"3p_pct" REAL,
FT_PCT REAL,
TOV REAL
);

create table advanced_stats(
player_id integer references players(player_id),
per REAl,
bpm real,
vorp real,
usg real,
ws real
);

select * from players;
select * from counting_stats;
select * from advanced_stats;

drop table if exists teams;
drop table if exists team_counting_stats;
drop table if exists team_advanced_stats;

create table teams(
team_id serial primary key,
team TEXT not null,
full_team_name TEXT
);
create table team_counting_stats(
team_id INTEGER REFERENCES teams(team_id),
g real,
mp real,
fg real,
fga real,
fg_pct real,
"3p" real,
"3pa" real,
"3p_pct" real,
"2p" real,
"2pa" real,
"2p_pct" real,
ft real,
fta real,
ft_pct real,
orb real,
drb real,
trb real,
ast real,
stl real,
blk real,
tov real,
pf real,
pts real
);
create table team_advanced_stats(
team_id integer references teams(team_id),
age real,
w real,
l real,
pw real,
pl real,
mov real,
sos real,
srs real,
ortg real,
drtg real,
nrtg real,
pace real,
ftr real,
"3par" real,
ts_pct real
);

SELECT * from teams;
SELECT * from team_counting_stats;
SELECT * from team_advanced_stats;