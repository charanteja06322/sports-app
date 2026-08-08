/**
 * Teams Service
 * Handle all team-related operations via FastAPI Backend
 */
import { apiService } from './api.service';

export interface Team {
  id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
  home_ground?: string;
  founded_year?: number;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'captain' | 'vice-captain' | 'player';
  jersey_number?: number;
  joined_at: string;
}

class TeamsService {
  /**
   * Create a new team
   */
  async createTeam(teamData: Partial<Team>) {
    try {
      const response = await apiService.createTeam(teamData);
      return response.team;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to create team');
    }
  }

  /**
   * Get all teams
   */
  async getAllTeams() {
    try {
      const response = await apiService.getTeams();
      return response.teams || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch teams');
    }
  }

  /**
   * Get team by ID with members
   */
  async getTeamById(teamId: string) {
    try {
      const response = await apiService.getTeam(teamId);
      return response.team;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch team details');
    }
  }

  /**
   * Get user's teams
   */
  async getMyTeams() {
    try {
      const response = await apiService.getMyTeams();
      return response.teams || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch your teams');
    }
  }

  /**
   * Join a team
   */
  async joinTeam(teamId: string, role: string = 'player', jerseyNumber?: number) {
    try {
      const response = await apiService.joinTeam(teamId);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to join team');
    }
  }

  /**
   * Leave a team
   */
  async leaveTeam(teamId: string) {
    try {
      await apiService.leaveTeam(teamId);
      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to leave team');
    }
  }

  /**
   * Update team
   */
  async updateTeam(teamId: string, updates: Partial<Team>) {
    try {
      const response = await apiService.updateTeam(teamId, updates);
      return response.team;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to update team');
    }
  }

  /**
   * Delete team
   */
  async deleteTeam(teamId: string) {
    try {
      await apiService.deleteTeam(teamId);
      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to delete team');
    }
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string) {
    try {
      const response = await apiService.getTeamMembers(teamId);
      return response.members || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch team members');
    }
  }
}

export const teamsService = new TeamsService();
