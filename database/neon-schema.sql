-- Sports Platform - PostgreSQL Schema for Neon (no Supabase auth)
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (replaces Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    cricket_role TEXT,
    batting_style TEXT,
    bowling_style TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT,
    logo_url TEXT,
    home_ground TEXT,
    founded_year INTEGER,
    description TEXT,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'player',
    jersey_number INTEGER,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    tournament_type TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'upcoming',
    prize_pool DECIMAL(10, 2),
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grounds Table
CREATE TABLE IF NOT EXISTS public.grounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    city TEXT,
    capacity INTEGER,
    pitch_type TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
    team1_id UUID REFERENCES public.teams(id) NOT NULL,
    team2_id UUID REFERENCES public.teams(id) NOT NULL,
    ground_id UUID REFERENCES public.grounds(id),
    match_date TIMESTAMP WITH TIME ZONE,
    match_type TEXT NOT NULL,
    overs INTEGER,
    status TEXT DEFAULT 'scheduled',
    toss_winner_id UUID REFERENCES public.teams(id),
    toss_decision TEXT,
    winner_id UUID REFERENCES public.teams(id),
    result_summary TEXT,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match Innings Table
CREATE TABLE IF NOT EXISTS public.match_innings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    batting_team_id UUID REFERENCES public.teams(id) NOT NULL,
    bowling_team_id UUID REFERENCES public.teams(id) NOT NULL,
    innings_number INTEGER NOT NULL,
    total_runs INTEGER DEFAULT 0,
    total_wickets INTEGER DEFAULT 0,
    total_overs DECIMAL(4, 1) DEFAULT 0.0,
    extras INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, innings_number)
);

-- Player Stats Table
CREATE TABLE IF NOT EXISTS public.player_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    innings_id UUID REFERENCES public.match_innings(id) ON DELETE CASCADE,
    runs_scored INTEGER DEFAULT 0,
    balls_faced INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    is_out BOOLEAN DEFAULT FALSE,
    dismissal_type TEXT,
    overs_bowled DECIMAL(4, 1) DEFAULT 0.0,
    runs_conceded INTEGER DEFAULT 0,
    wickets_taken INTEGER DEFAULT 0,
    maidens INTEGER DEFAULT 0,
    catches INTEGER DEFAULT 0,
    stumpings INTEGER DEFAULT 0,
    run_outs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, match_id, innings_id)
);

-- Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Likes Table
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Post Comments Table
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON public.teams(created_by);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON public.matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_stats_user_id ON public.player_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_match_id ON public.player_stats(match_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample test data
INSERT INTO public.users (id, email, full_name, cricket_role, batting_style, bowling_style) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'virat@sports.com', 'Virat Kohli', 'Batsman', 'Right-hand', NULL),
    ('550e8400-e29b-41d4-a716-446655440001', 'jasprit@sports.com', 'Jasprit Bumrah', 'Bowler', NULL, 'Right-arm'),
    ('550e8400-e29b-41d4-a716-446655440002', 'ms@sports.com', 'MS Dhoni', 'Wicket-keeper', 'Right-hand', NULL),
    ('550e8400-e29b-41d4-a716-446655440003', 'steve@sports.com', 'Steve Smith', 'Batsman', 'Right-hand', 'Right-arm'),
    ('550e8400-e29b-41d4-a716-446655440004', 'kane@sports.com', 'Kane Williamson', 'Batsman', 'Right-hand', 'Right-arm');

INSERT INTO public.grounds (id, name, location, city, capacity, pitch_type, created_by) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', 'Arun Jaitley Stadium', 'New Delhi', 'Delhi', 41820, 'Batting', '550e8400-e29b-41d4-a716-446655440000'),
    ('650e8400-e29b-41d4-a716-446655440001', 'M. A. Chidambaram Stadium', 'Chennai', 'Chennai', 38862, 'Batting', '550e8400-e29b-41d4-a716-446655440000'),
    ('650e8400-e29b-41d4-a716-446655440002', 'Wankhede Stadium', 'Mumbai', 'Mumbai', 33108, 'Batting', '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO public.teams (id, name, short_name, home_ground, founded_year, created_by) VALUES
    ('750e8400-e29b-41d4-a716-446655440000', 'India Cricket Team', 'IND', 'Arun Jaitley Stadium', 1932, '550e8400-e29b-41d4-a716-446655440000'),
    ('750e8400-e29b-41d4-a716-446655440001', 'Australia Cricket Team', 'AUS', 'MCG', 1905, '550e8400-e29b-41d4-a716-446655440000'),
    ('750e8400-e29b-41d4-a716-446655440002', 'England Cricket Team', 'ENG', 'Lord''s', 1877, '550e8400-e29b-41d4-a716-446655440000'),
    ('750e8400-e29b-41d4-a716-446655440003', 'New Zealand Cricket Team', 'NZ', 'Basin Reserve', 1930, '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO public.team_members (team_id, user_id, role, jersey_number) VALUES
    ('750e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'captain', 18),
    ('750e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'player', 93),
    ('750e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'captain', 7),
    ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'captain', 49),
    ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'captain', 22);

INSERT INTO public.matches (id, team1_id, team2_id, ground_id, match_date, match_type, status, created_by) VALUES
    ('850e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440000', '2024-09-15 14:00:00', 'ODI', 'scheduled', '550e8400-e29b-41d4-a716-446655440000'),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '2024-09-18 14:00:00', 'Test', 'scheduled', '550e8400-e29b-41d4-a716-446655440000'),
    ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '2024-09-20 19:00:00', 'T20', 'scheduled', '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO public.posts (id, user_id, content, likes_count, comments_count) VALUES
    ('950e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Excited for the upcoming match! Let''s bring home the trophy.', 42, 5),
    ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Working hard in the nets to prepare for the big game.', 38, 3),
    ('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Great practice session today with the team!', 51, 8);

SELECT 'Neon PostgreSQL schema created successfully with sample data! 11 tables and indexes ready.' as message;
