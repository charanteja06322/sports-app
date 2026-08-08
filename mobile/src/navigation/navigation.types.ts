/**
 * Navigation Type Definitions
 */

export type RootStackParamList = {
  // Auth Screens
  Login: undefined;
  SignUp: undefined;
  
  // Main App Screens
  Home: undefined;
  
  // Team Screens
  Teams: undefined;
  TeamDetail: { teamId: number };
  CreateTeam: undefined;
  TeamMembers: { teamId: number };
  
  // Tournament Screens
  Tournaments: undefined;
  TournamentDetail: { tournamentId: number };
  CreateTournament: undefined;
  RegisterTeam: { tournamentId: number };
  
  // Profile Screens
  Profile: undefined;
};
