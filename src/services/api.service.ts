/**
 * API Service — FastAPI Backend Integration
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, getHeaders } from '../config/api';
import { supabase } from '../config/supabase';

class APIService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 10000, headers: getHeaders() });
    this.axiosInstance.interceptors.request.use(async (config) => {
      try { const { data: { session } } = await supabase.auth.getSession(); if (session?.access_token) config.headers.Authorization = `Bearer ${session.access_token}`; } catch (error) { console.error('Error getting auth token:', error); }
      return config;
    }, (error) => Promise.reject(error));
    this.axiosInstance.interceptors.response.use((response) => response, (error) => {
      if (error.response) { const { status, data } = error.response; if (status === 401) console.error('Authentication error:', data); else if (status === 403) console.error('Permission denied:', data); else if (status === 404) console.error('Resource not found:', data); else if (status >= 500) console.error('Server error:', data); }
      else if (error.request) console.error('Network error:', error.message);
      else console.error('Error:', error.message);
      return Promise.reject(error);
    });
  }
  async get<T=any>(url:string,config?:AxiosRequestConfig):Promise<T>{const r=await this.axiosInstance.get<T>(url,config);return r.data;}
  async post<T=any>(url:string,data?:any,config?:AxiosRequestConfig):Promise<T>{const r=await this.axiosInstance.post<T>(url,data,config);return r.data;}
  async put<T=any>(url:string,data?:any,config?:AxiosRequestConfig):Promise<T>{const r=await this.axiosInstance.put<T>(url,data,config);return r.data;}
  async delete<T=any>(url:string,config?:AxiosRequestConfig):Promise<T>{const r=await this.axiosInstance.delete<T>(url,config);return r.data;}
  async getTeams(params?:any){return this.get('/teams',{params});}
  async getTeam(teamId:string){return this.get(`/teams/${teamId}`);}
  async createTeam(d:any){return this.post('/teams',d);}
  async updateTeam(id:string,d:any){return this.put(`/teams/${id}`,d);}
  async deleteTeam(id:string){return this.delete(`/teams/${id}`);}
  async joinTeam(id:string){return this.post(`/teams/${id}/join`);}
  async leaveTeam(id:string){return this.delete(`/teams/${id}/leave`);}
  async getTeamMembers(id:string){return this.get(`/teams/${id}/members`);}
  async getMyTeams(){return this.get('/teams/user/my-teams');}
  async getTournaments(params?:any){return this.get('/tournaments',{params});}
  async getTournament(id:string){return this.get(`/tournaments/${id}`);}
  async createTournament(d:any){return this.post('/tournaments',d);}
  async updateTournament(id:string,d:any){return this.put(`/tournaments/${id}`,d);}
  async deleteTournament(id:string){return this.delete(`/tournaments/${id}`);}
  async getTournamentTeams(id:string){return this.get(`/tournaments/${id}/teams`);}
  async addTeamToTournament(tId:string,teamId:string){return this.post(`/tournaments/${tId}/teams/${teamId}`);}
  async removeTeamFromTournament(tId:string,teamId:string){return this.delete(`/tournaments/${tId}/teams/${teamId}`);}
  async getMyTournaments(){return this.get('/tournaments/user/my-tournaments');}
  async getMatches(params?:any){return this.get('/matches',{params});}
  async getMatch(id:string){return this.get(`/matches/${id}`);}
  async getLiveMatches(){return this.get('/matches/live');}
  async getUpcomingMatches(limit?:number){return this.get('/matches/upcoming',{params:{limit}});}
  async getCompletedMatches(params?:any){return this.get('/matches/completed',{params});}
  async getTeamMatches(teamId:string,statusFilter?:string){return this.get(`/matches/team/${teamId}`,{params:{status_filter:statusFilter}});}
  async getTournamentMatches(tId:string,statusFilter?:string){return this.get(`/matches/tournament/${tId}`,{params:{status_filter:statusFilter}});}
  async createMatch(d:any){return this.post('/matches',d);}
}
export const apiService = new APIService();
export default apiService;