/**
 * Tournaments Service
 * Handle all tournament-related operations via FastAPI Backend
 */
import { apiService } from './api.service';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  tournament_type: 'league' | 'knockout' | 'round-robin';
  start_date?: string;
  end_date?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  prize_pool?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

class TournamentsService {
  /**
   * Create a new tournament
   */
  async createTournament(tournamentData: Partial<Tournament>) {
    try {
      const response = await apiService.createTournament(tournamentData);
      return response.tournament;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to create tournament');
    }
  }

  /**
   * Get all tournaments
   */
  async getAllTournaments(status?: string) {
    try {
      const params = status ? { status_filter: status } : {};
      const response = await apiService.getTournaments(params);
      return response.tournaments || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch tournaments');
    }
  }

  /**
   * Get tournament by ID
   */
  async getTournamentById(tournamentId: string) {
    try {
      const response = await apiService.getTournament(tournamentId);
      return response.tournament;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch tournament details');
    }
  }

  /**
   * Update tournament
   */
  async updateTournament(tournamentId: string, updates: Partial<Tournament>) {
    try {
      const response = await apiService.updateTournament(tournamentId, updates);
      return response.tournament;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to update tournament');
    }
  }

  /**
   * Delete tournament
   */
  async deleteTournament(tournamentId: string) {
    try {
      await apiService.deleteTournament(tournamentId);
      return true;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to delete tournament');
    }
  }

  /**
   * Get upcoming tournaments
   */
  async getUpcomingTournaments() {
    return this.getAllTournaments('upcoming');
  }

  /**
   * Get ongoing tournaments
   */
  async getOngoingTournaments() {
    return this.getAllTournaments('ongoing');
  }

  /**
   * Get completed tournaments
   */
  async getCompletedTournaments() {
    return this.getAllTournaments('completed');
  }
}

export const tournamentsService = new TournamentsService();
