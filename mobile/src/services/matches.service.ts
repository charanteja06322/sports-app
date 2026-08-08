/**
 * Matches Service
 * Handle all match-related operations via FastAPI Backend
 */
import { apiService } from './api.service';
import { supabase } from '../config/supabase';

export interface Match {
  id: string;
  tournament_id?: string;
  team1_id: string;
  team2_id: string;
  ground_id?: string;
  match_date?: string;
  match_type: 'T20' | 'ODI' | 'Test' | 'Practice';
  overs?: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  toss_winner_id?: string;
  toss_decision?: 'bat' | 'bowl';
  winner_id?: string;
  result_summary?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MatchInnings {
  id: string;
  match_id: string;
  batting_team_id: string;
  bowling_team_id: string;
  innings_number: number;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  extras: number;
  is_completed: boolean;
  created_at: string;
}

class MatchesService {
  /**
   * Create a new match
   */
  async createMatch(matchData: Partial<Match>) {
    try {
      const response = await apiService.createMatch(matchData);
      return response.match;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to create match');
    }
  }

  /**
   * Get all matches
   */
  async getAllMatches(status?: string) {
    try {
      const params = status ? { status_filter: status } : {};
      const response = await apiService.getMatches(params);
      return response.matches || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch matches');
    }
  }

  /**
   * Get match by ID with full details
   */
  async getMatchById(matchId: string) {
    try {
      const response = await apiService.getMatch(matchId);
      return response.match;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch match details');
    }
  }

  /**
   * Update match - using Supabase directly for now (not in FastAPI yet)
   */
  async updateMatch(matchId: string, updates: Partial<Match>) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update match');
    }
  }

  /**
   * Get live matches
   */
  async getLiveMatches() {
    try {
      const response = await apiService.getLiveMatches();
      return response.matches || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch live matches');
    }
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches() {
    try {
      const response = await apiService.getUpcomingMatches();
      return response.matches || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch upcoming matches');
    }
  }

  /**
   * Get completed matches
   */
  async getCompletedMatches() {
    try {
      const response = await apiService.getCompletedMatches();
      return response.matches || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch completed matches');
    }
  }

  /**
   * Start match - using Supabase directly for now
   */
  async startMatch(matchId: string, tossWinnerId: string, tossDecision: 'bat' | 'bowl') {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({
          status: 'live',
          toss_winner_id: tossWinnerId,
          toss_decision: tossDecision,
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to start match');
    }
  }

  /**
   * Complete match - using Supabase directly for now
   */
  async completeMatch(matchId: string, winnerId: string, resultSummary: string) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update({
          status: 'completed',
          winner_id: winnerId,
          result_summary: resultSummary,
        })
        .eq('id', matchId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete match');
    }
  }

  /**
   * Create innings - using Supabase directly for now
   */
  async createInnings(inningsData: Partial<MatchInnings>) {
    try {
      const { data, error } = await supabase
        .from('match_innings')
        .insert(inningsData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create innings');
    }
  }

  /**
   * Update innings - using Supabase directly for now
   */
  async updateInnings(inningsId: string, updates: Partial<MatchInnings>) {
    try {
      const { data, error } = await supabase
        .from('match_innings')
        .update(updates)
        .eq('id', inningsId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update innings');
    }
  }

  /**
   * Get match innings - using Supabase directly for now
   */
  async getMatchInnings(matchId: string) {
    try {
      const { data, error } = await supabase
        .from('match_innings')
        .select(`
          *,
          batting_team:batting_team_id (*),
          bowling_team:bowling_team_id (*)
        `)
        .eq('match_id', matchId)
        .order('innings_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch innings');
    }
  }
}

export const matchesService = new MatchesService();
