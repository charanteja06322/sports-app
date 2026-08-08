-- FORCE DROP All Existing Tables (Clean Slate)
-- Run this FIRST in Supabase SQL Editor

-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams CASCADE;
DROP TRIGGER IF EXISTS update_tournaments_updated_at ON public.tournaments CASCADE;
DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches CASCADE;
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Force drop all tables with CASCADE
DROP TABLE IF EXISTS public.post_comments CASCADE;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.player_stats CASCADE;
DROP TABLE IF EXISTS public.match_innings CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.grounds CASCADE;
DROP TABLE IF EXISTS public.tournaments CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop any leftover policies
DROP POLICY IF EXISTS "Public profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Teams viewable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can update" ON public.teams;
DROP POLICY IF EXISTS "Matches viewable by everyone" ON public.matches;
DROP POLICY IF EXISTS "Authenticated users can create matches" ON public.matches;
DROP POLICY IF EXISTS "Match creators can update" ON public.matches;
DROP POLICY IF EXISTS "Posts viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
DROP POLICY IF EXISTS "Post likes viewable by everyone" ON public.post_likes;
DROP POLICY IF EXISTS "Authenticated users can like" ON public.post_likes;
DROP POLICY IF EXISTS "Users can unlike" ON public.post_likes;

SELECT 'All tables, triggers, functions, and policies dropped! Now run the main schema.' as message;
