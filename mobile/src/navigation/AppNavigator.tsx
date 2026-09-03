/**
 * Cricket Sports Platform - Master Navigation
 * 5-Tab Bottom Navigation Architecture
 * 
 * ┌───────────────────────────────────────────────┐
 * │                  APP CONTENT                  │
 * ├───────────────────────────────────────────────┤
 * │  🏠       🏏       ＋       🔍       👤       │
 * │ Home    Matches   Create  Discover  Profile   │
 * └───────────────────────────────────────────────┘
 */
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';

// Main Tab Screens
import HomeScreen from '../screens/home/HomeScreen';
import MatchesScreen from '../screens/matches/MatchesScreen';
import CreateScreen from '../screens/create/CreateScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

// Team Screens
import { TeamsListScreen } from '../screens/teams/TeamsListScreen';
import { TeamDetailScreen } from '../screens/teams/TeamDetailScreen';
import { CreateTeamScreen } from '../screens/teams/CreateTeamScreen';
import { MyTeamsScreen } from '../screens/teams/MyTeamsScreen';
import TeamsBrowseScreen from '../screens/teams/TeamsBrowseScreen';

// Match Screens
import CreateMatchScreen from '../screens/matches/CreateMatchScreen';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import PostCreationScreen from '../screens/create/PostCreationScreen';

// Tournament Screens
import { TournamentsListScreen } from '../screens/tournaments/TournamentsListScreen';
import { CreateTournamentScreen } from '../screens/tournaments/CreateTournamentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Instagram-Style Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          paddingBottom: 6,
          paddingTop: 6,
          height: 50,
        },
        headerShown: false,
        tabBarShowLabel: false, // Instagram doesn't show labels
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "cricket" : "cricket"} 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name="plus-square" 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Feather 
              name="search" 
              size={26} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: focused ? 2 : 0,
              borderColor: colors.textPrimary,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.backgroundGray,
            }}>
              <Ionicons 
                name="person" 
                size={16} 
                color={focused ? colors.textPrimary : colors.textSecondary} 
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: true,
        }}
      >
        {!isAuthenticated ? (
          // Authentication Stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Main Application Stack
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            {/* Profile Screens */}
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            {/* Team Screens */}
            <Stack.Screen name="TeamsList" component={TeamsListScreen} options={{ title: 'Teams' }} />
            <Stack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: 'Team Details' }} />
            <Stack.Screen name="CreateTeam" component={CreateTeamScreen} options={{ title: 'Create Team' }} />
            <Stack.Screen name="MyTeams" component={MyTeamsScreen} options={{ title: 'My Teams' }} />
            <Stack.Screen name="TeamsBrowse" component={TeamsBrowseScreen} options={{ headerShown: false }} />
            {/* Match Screens */}
            <Stack.Screen name="CreateMatch" component={CreateMatchScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreatePost" component={PostCreationScreen} options={{ headerShown: false }} />
            {/* Tournament Screens */}
            <Stack.Screen name="TournamentsList" component={TournamentsListScreen} options={{ title: 'Tournaments' }} />
            <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} options={{ title: 'Create Tournament' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
