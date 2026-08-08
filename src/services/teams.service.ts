import { apiService } from './api.service';
export interface Team { id: string; name: string; short_name?: string; logo_url?: string; home_ground?: string; founded_year?: number; description?: string; created_by: string; created_at: string; updated_at: string; }
export interface TeamMember { id: string; team_id: string; user_id: string; role: 'captain'|'vice-captain'|'player'; jersey_number?: number; joined_at: string; }
class TeamsService {
  async createTeam(d:Partial<Team>){try{const r=await apiService.createTeam(d);return r.team;}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to create team');}}
  async getAllTeams(){try{const r=await apiService.getTeams();return r.teams||[];}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to fetch teams');}}
  async getTeamById(id:string){try{const r=await apiService.getTeam(id);return r.team;}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to fetch team details');}}
  async getMyTeams(){try{const r=await apiService.getMyTeams();return r.teams||[];}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to fetch your teams');}}
  async joinTeam(id:string){try{const r=await apiService.joinTeam(id);return r;}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to join team');}}
  async leaveTeam(id:string){try{await apiService.leaveTeam(id);return true;}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to leave team');}}
  async updateTeam(id:string,u:Partial<Team>){try{const r=await apiService.updateTeam(id,u);return r.team;}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to update team');}}
  async deleteTeam(id:string){try{await apiService.deleteTeam(id);return true;}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to delete team');}}
  async getTeamMembers(id:string){try{const r=await apiService.getTeamMembers(id);return r.members||[];}catch(e:any){throw new Error(e.response?.data?.detail||e.message||'Failed to fetch team members');}}
}
export const teamsService = new TeamsService();