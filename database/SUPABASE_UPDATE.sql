-- ============================================================
-- SUPABASE DATABASE UPDATE FOR FASTAPI INTEGRATION
-- Execute this in Supabase SQL Editor
-- ============================================================

-- This script updates your Supabase database to work with the FastAPI backend
-- The app now uses: Mobile → FastAPI → Supabase (instead of Mobile → Supabase directly)

-- ============================================================
-- 1. DROP OLD POLICIES AND CREATE NEW ONES FOR FASTAPI
-- ============================================================

-- Teams Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Teams viewable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can update" ON public.teams;
DROP POLICY IF EXISTS "Users can delete own teams" ON public.teams;

CREATE POLICY "Teams viewable by authenticated users"
  ON public.teams FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team owners can update"
  ON public.teams FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Team owners can delete"
  ON public.teams FOR DELETE
  USING (auth.uid() = created_by);

-- Tournaments Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Tournaments viewable by everyone" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Users can update own tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Users can delete own tournaments" ON public.tournaments;

CREATE POLICY "Tournaments viewable by authenticated users"
  ON public.tournaments FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Tournament organizers can update"
  ON public.tournaments FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Tournament organizers can delete"
  ON public.tournaments FOR DELETE
  USING (auth.uid() = created_by);

-- Matches Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Matches viewable by everyone" ON public.matches;
DROP POLICY IF EXISTS "Authenticated users can create matches" ON public.matches;
DROP POLICY IF EXISTS "Match creators can update" ON public.matches;
DROP POLICY IF EXISTS "Users can delete own matches" ON public.matches;

CREATE POLICY "Matches viewable by authenticated users"
  ON public.matches FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Match creators can update"
  ON public.matches FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Match creators can delete"
  ON public.matches FOR DELETE
  USING (auth.uid() = created_by);

-- Team Members Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Team members viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON public.team_members;

CREATE POLICY "Team members viewable by authenticated users"
  ON public.team_members FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can join teams"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON public.team_members FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Team owners can manage members"
  ON public.team_members FOR UPDATE
  USING (auth.uid() IN (SELECT created_by FROM public.teams WHERE id = team_id));

-- Grounds Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Grounds viewable by everyone" ON public.grounds;
DROP POLICY IF EXISTS "Authenticated users can create grounds" ON public.grounds;
DROP POLICY IF EXISTS "Ground creators can update" ON public.grounds;

CREATE POLICY "Grounds viewable by authenticated users"
  ON public.grounds FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can create grounds"
  ON public.grounds FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Ground creators can update"
  ON public.grounds FOR UPDATE
  USING (auth.uid() = created_by);

-- Match Innings Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Match innings viewable by everyone" ON public.match_innings;
DROP POLICY IF EXISTS "Authenticated users can create innings" ON public.match_innings;

CREATE POLICY "Match innings viewable by authenticated users"
  ON public.match_innings FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can create innings"
  ON public.match_innings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can update innings"
  ON public.match_innings FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Player Stats Policies - Updated for FastAPI
DROP POLICY IF EXISTS "Player stats viewable by everyone" ON public.player_stats;
DROP POLICY IF EXISTS "Authenticated users can create stats" ON public.player_stats;

CREATE POLICY "Player stats viewable by authenticated users"
  ON public.player_stats FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can create stats"
  ON public.player_stats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Users can update stats"
  ON public.player_stats FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 2. GRANT PERMISSIONS TO SERVICE ROLE (CRITICAL FOR FASTAPI)
-- ============================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- ============================================================
-- 3. VERIFY ALL INDEXES EXIST (Already in your schema)
-- ============================================================

-- These indexes already exist in your schema, verifying they're still there
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('teams', 'tournaments', 'matches', 'team_members', 'posts', 'player_stats')
ORDER BY tablename, indexname;

-- ============================================================
-- 4. CREATE TOURNAMENT_TEAMS TABLE IF MISSING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tournament_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- Tournament Teams Policies
DROP POLICY IF EXISTS "Tournament teams viewable by authenticated users" ON public.tournament_teams;
CREATE POLICY "Tournament teams viewable by authenticated users"
  ON public.tournament_teams FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can register teams" ON public.tournament_teams;
CREATE POLICY "Users can register teams"
  ON public.tournament_teams FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can unregister teams" ON public.tournament_teams;
CREATE POLICY "Users can unregister teams"
  ON public.tournament_teams FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Enable RLS
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;

-- Index for tournament teams
CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament_id ON public.tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_team_id ON public.tournament_teams(team_id);

-- ============================================================
-- 5. CREATE FOLLOWS TABLE IF MISSING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Follows Policies
DROP POLICY IF EXISTS "Follows viewable by everyone" ON public.follows;
CREATE POLICY "Follows viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Index for follows
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- ============================================================
-- 6. VERIFY ALL TABLES HAVE RLS ENABLED
-- ============================================================

SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'teams', 'team_members', 'tournaments', 'tournament_teams', 'matches', 'match_innings', 'grounds', 'player_stats', 'posts', 'post_likes', 'post_comments', 'follows')
ORDER BY tablename;

-- ============================================================
-- 7. VERIFY ALL POLICIES ARE CREATED
-- ============================================================

SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================
-- 8. TEST SERVICE ROLE ACCESS
-- ============================================================

-- This should return success if service role has access
SELECT 
  'service_role has access to teams' as status,
  EXISTS (
    SELECT 1 FROM information_schema.table_privileges 
    WHERE grantee = 'service_role' 
      AND table_name = 'teams'
      AND privilege_type = 'SELECT'
  ) as has_access;

-- ============================================================
-- DONE! Your Supabase database is now optimized for FastAPI
-- ============================================================

SELECT 
  'Database update completed successfully!' as status,
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as total_policies,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as total_indexes;
