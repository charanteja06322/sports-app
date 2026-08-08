import { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Home: undefined;
  Matches: undefined;
  Create: undefined;
  Discover: undefined;
  Profile: undefined;
  // Team Screens
  TeamsList: undefined;
  TeamDetail: { teamId: string };
  CreateTeam: undefined;
  MyTeams: undefined;
  // Tournament Screens
  TournamentsList: undefined;
  TournamentDetail: { tournamentId: string };
  CreateTournament: undefined;
  // Match Screens
  MatchDetail: { matchId: string };
  CreateMatch: undefined;
  // Profile Screens
  EditProfile: undefined;
  Settings: undefined;
};

export type AppNavigationProp = NavigationProp<RootStackParamList>;
