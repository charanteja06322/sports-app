/**
 * API Service - FastAPI Backend Integration
 * Centralized service for all backend API calls
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, getAuthHeaders, getHeaders } from '../config/api';
import { supabase } from '../config/supabase';

class APIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: getHeaders(),
    });

    // Add request interceptor to attach auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          // Try to get current session from Supabase
          // If Supabase is not available, allow anonymous access
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.access_token) {
              config.headers.Authorization = `Bearer ${session.access_token}`;
            }
          } catch (supabaseError) {
            // Supabase not available - allow anonymous access
            console.warn('Supabase auth unavailable, using anonymous access');
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error
          const { status, data } = error.response;
          
          if (status === 401) {
            // Unauthorized - token expired or invalid
            console.error('Authentication error:', data);
            // Could trigger logout here
          } else if (status === 403) {
            // Forbidden - no permission
            console.error('Permission denied:', data);
          } else if (status === 404) {
            // Not found
            console.error('Resource not found:', data);
          } else if (status >= 500) {
            // Server error
            console.error('Server error:', data);
          }
        } else if (error.request) {
          // Request made but no response
          console.error('Network error:', error.message);
        } else {
          // Something else happened
          console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // ============================================================================
  // TEAMS API
  // ============================================================================

  async getTeams(params?: { skip?: number; limit?: number; search?: string }) {
    return this.get('/teams', { params });
  }

  async getTeam(teamId: string) {
    return this.get(`/teams/${teamId}`);
  }

  async createTeam(teamData: any) {
    return this.post('/teams', teamData);
  }

  async updateTeam(teamId: string, teamData: any) {
    return this.put(`/teams/${teamId}`, teamData);
  }

  async deleteTeam(teamId: string) {
    return this.delete(`/teams/${teamId}`);
  }

  async joinTeam(teamId: string) {
    return this.post(`/teams/${teamId}/join`);
  }

  async leaveTeam(teamId: string) {
    return this.delete(`/teams/${teamId}/leave`);
  }

  async getTeamMembers(teamId: string) {
    return this.get(`/teams/${teamId}/members`);
  }

  async getMyTeams() {
    return this.get('/teams/user/my-teams');
  }

  // ============================================================================
  // TOURNAMENTS API
  // ============================================================================

  async getTournaments(params?: { 
    skip?: number; 
    limit?: number; 
    status_filter?: string;
    tournament_type?: string;
    search?: string;
  }) {
    return this.get('/tournaments', { params });
  }

  async getTournament(tournamentId: string) {
    return this.get(`/tournaments/${tournamentId}`);
  }

  async createTournament(tournamentData: any) {
    return this.post('/tournaments', tournamentData);
  }

  async updateTournament(tournamentId: string, tournamentData: any) {
    return this.put(`/tournaments/${tournamentId}`, tournamentData);
  }

  async deleteTournament(tournamentId: string) {
    return this.delete(`/tournaments/${tournamentId}`);
  }

  async getTournamentTeams(tournamentId: string) {
    return this.get(`/tournaments/${tournamentId}/teams`);
  }

  async addTeamToTournament(tournamentId: string, teamId: string) {
    return this.post(`/tournaments/${tournamentId}/teams/${teamId}`);
  }

  async removeTeamFromTournament(tournamentId: string, teamId: string) {
    return this.delete(`/tournaments/${tournamentId}/teams/${teamId}`);
  }

  async getMyTournaments() {
    return this.get('/tournaments/user/my-tournaments');
  }

  // ============================================================================
  // MATCHES API
  // ============================================================================

  async getMatches(params?: {
    skip?: number;
    limit?: number;
    status_filter?: string;
    tournament_id?: string;
    team_id?: string;
  }) {
    return this.get('/matches', { params });
  }

  async getMatch(matchId: string) {
    return this.get(`/matches/${matchId}`);
  }

  async getLiveMatches() {
    return this.get('/matches/live');
  }

  async getUpcomingMatches(limit?: number) {
    return this.get('/matches/upcoming', { params: { limit } });
  }

  async getCompletedMatches(params?: { skip?: number; limit?: number }) {
    return this.get('/matches/completed', { params });
  }

  async getTeamMatches(teamId: string, statusFilter?: string) {
    return this.get(`/matches/team/${teamId}`, { 
      params: { status_filter: statusFilter } 
    });
  }

  async getTournamentMatches(tournamentId: string, statusFilter?: string) {
    return this.get(`/matches/tournament/${tournamentId}`, {
      params: { status_filter: statusFilter }
    });
  }

  async createMatch(matchData: any) {
    return this.post('/matches', matchData);
  }

  // ============================================================================
  // POSTS API
  // ============================================================================

  async getPosts(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    return this.get('/posts', { params });
  }

  async getPost(postId: string) {
    return this.get(`/posts/${postId}`);
  }

  async createPost(postData: any) {
    return this.post('/posts', postData);
  }

  async updatePost(postId: string, postData: any) {
    return this.put(`/posts/${postId}`, postData);
  }

  async deletePost(postId: string) {
    return this.delete(`/posts/${postId}`);
  }

  async getMyPosts() {
    return this.get('/posts/user/my-posts');
  }

  async likePost(postId: string) {
    return this.post(`/posts/${postId}/like`);
  }

  async unlikePost(postId: string) {
    return this.delete(`/posts/${postId}/like`);
  }

  async commentOnPost(postId: string, content: string) {
    return this.post(`/posts/${postId}/comments`, { content });
  }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;
