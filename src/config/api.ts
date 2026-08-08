/**
 * FastAPI Backend Configuration
 */
declare const __DEV__: boolean | undefined;

export const API_BASE_URL = (typeof __DEV__ !== 'undefined' && __DEV__) ? 'http://192.168.0.105:8000/api/v1' : 'https://your-production-api.com/api/v1';

export const API_ENDPOINTS = {
  AUTH: { ME:'/auth/me', PUBLIC:'/auth/public' },
  TEAMS: { LIST:'/teams', CREATE:'/teams', DETAIL:(id:string)=>`/teams/${id}`, UPDATE:(id:string)=>`/teams/${id}`, DELETE:(id:string)=>`/teams/${id}`, JOIN:(id:string)=>`/teams/${id}/join`, LEAVE:(id:string)=>`/teams/${id}/leave`, MEMBERS:(id:string)=>`/teams/${id}/members`, MY_TEAMS:'/teams/user/my-teams' },
  TOURNAMENTS: { LIST:'/tournaments', CREATE:'/tournaments', DETAIL:(id:string)=>`/tournaments/${id}`, UPDATE:(id:string)=>`/tournaments/${id}`, DELETE:(id:string)=>`/tournaments/${id}`, TEAMS:(id:string)=>`/tournaments/${id}/teams`, ADD_TEAM:(tId:string,teamId:string)=>`/tournaments/${tId}/teams/${teamId}`, REMOVE_TEAM:(tId:string,teamId:string)=>`/tournaments/${tId}/teams/${teamId}`, MY_TOURNAMENTS:'/tournaments/user/my-tournaments' },
  MATCHES: { LIST:'/matches', CREATE:'/matches', DETAIL:(id:string)=>`/matches/${id}`, LIVE:'/matches/live', UPCOMING:'/matches/upcoming', COMPLETED:'/matches/completed', BY_TEAM:(teamId:string)=>`/matches/team/${teamId}`, BY_TOURNAMENT:(tId:string)=>`/matches/tournament/${tId}` },
};
export const getAuthHeaders = (token:string) => ({'Content-Type':'application/json','Authorization':`Bearer ${token}`});
export const getHeaders = () => ({'Content-Type':'application/json'});