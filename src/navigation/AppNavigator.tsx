/**
 * Cricket Sports Platform — Master Navigation
 * 5-Tab Bottom Navigation with polished dark theme.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import LoginScreen from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/home/HomeScreen';
import MatchesScreen from '../screens/matches/MatchesScreen';
import CreateScreen from '../screens/create/CreateScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import { TeamsListScreen } from '../screens/teams/TeamsListScreen';
import { TeamDetailScreen } from '../screens/teams/TeamDetailScreen';
import { CreateTeamScreen } from '../screens/teams/CreateTeamScreen';
import { MyTeamsScreen } from '../screens/teams/MyTeamsScreen';
import CreateMatchScreen from '../screens/matches/CreateMatchScreen';
import { TournamentsListScreen } from '../screens/tournaments/TournamentsListScreen';
import { CreateTournamentScreen } from '../screens/tournaments/CreateTournamentScreen';
import { TournamentDetailScreen } from '../screens/tournaments/TournamentDetailScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TAB_ICONS: Record<string, { active: keyof typeof Feather.glyphMap; inactive: keyof typeof Feather.glyphMap }> = { Home:{active:'home',inactive:'home'}, Matches:{active:'activity',inactive:'activity'}, Discover:{active:'compass',inactive:'compass'}, Profile:{active:'user',inactive:'user'} };
function MainTabNavigator(){return(<Tab.Navigator id="MainTabs" screenOptions={({route})=>({tabBarActiveTintColor:colors.primary,tabBarInactiveTintColor:colors.textMuted,tabBarStyle:styles.tabBar,headerShown:false,tabBarLabelStyle:styles.tabLabel,tabBarIcon:({color,focused}:{color:string;focused:boolean;size:number})=>{const icons=TAB_ICONS[route.name];if(!icons)return null;return(<View style={focused?styles.iconActiveWrap:undefined}><Feather name={focused?icons.active:icons.inactive} size={22} color={color}/>{focused&&<View style={styles.iconDot}/>}</View>);}})}><Tab.Screen name="Home" component={HomeScreen} options={{title:'Home'}}/><Tab.Screen name="Matches" component={MatchesScreen} options={{title:'Matches'}}/><Tab.Screen name="Create" component={CreateScreen} options={{tabBarLabel:()=>null,tabBarIcon:({focused})=>(<View style={[styles.createBtn,focused&&styles.createBtnFocused]}><Feather name="plus" size={26} color={colors.textInverse}/></View>)}}/><Tab.Screen name="Discover" component={DiscoverScreen} options={{title:'Discover'}}/><Tab.Screen name="Profile" component={ProfileScreen} options={{title:'Profile'}}/></Tab.Navigator>);}
export default function AppNavigator(){const{isAuthenticated,loading}=useAuth();if(loading)return null;return(<NavigationContainer><Stack.Navigator id="RootStack" screenOptions={{headerStyle:{backgroundColor:colors.background},headerTintColor:colors.textPrimary,headerTitleStyle:{fontWeight:'700'}}}>{!isAuthenticated?(<><Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/><Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/></>):(<><Stack.Screen name="MainTabs" component={MainTabNavigator} options={{headerShown:false}}/><Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown:false}}/><Stack.Screen name="TeamsList" component={TeamsListScreen} options={{title:'Teams'}}/><Stack.Screen name="TeamDetail" component={TeamDetailScreen} options={{title:'Team Details'}}/><Stack.Screen name="CreateTeam" component={CreateTeamScreen} options={{title:'Create Team',headerShown:false}}/><Stack.Screen name="MyTeams" component={MyTeamsScreen} options={{title:'My Teams'}}/><Stack.Screen name="CreateMatch" component={CreateMatchScreen} options={{headerShown:false}}/><Stack.Screen name="TournamentsList" component={TournamentsListScreen} options={{title:'Tournaments'}}/><Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} options={{title:'Tournament'}}/><Stack.Screen name="CreateTournament" component={CreateTournamentScreen} options={{title:'Create Tournament',headerShown:false}}/></>)}</Stack.Navigator></NavigationContainer>);}
const styles=StyleSheet.create({tabBar:{backgroundColor:colors.background,borderTopColor:colors.divider,borderTopWidth:1,paddingBottom:8,paddingTop:8,height:62,elevation:0,shadowOpacity:0},tabLabel:{fontSize:10,fontWeight:'600',marginTop:2},iconActiveWrap:{position:'relative',alignItems:'center'},iconDot:{width:4,height:4,borderRadius:2,backgroundColor:colors.primary,marginTop:4},createBtn:{width:52,height:52,borderRadius:26,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center',marginTop:-10,shadowColor:colors.primary,shadowOpacity:0.40,shadowRadius:14,shadowOffset:{width:0,height:6},elevation:10},createBtnFocused:{transform:[{scale:1.05}]}});