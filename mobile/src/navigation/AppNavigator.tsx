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
import { useAuth } from '../context/AuthContext';

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

// Match Screens
import CreateMatchScreen from '../screens/matches/CreateMatchScreen';

// Tournament Screens
import { TournamentsListScreen } from '../screens/tournaments/TournamentsListScreen';
import { CreateTournamentScreen } from '../screens/tournaments/CreateTournamentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 5-Tab Bottom Navigation - Core Architecture
function MainTabNavigator() {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarActiveTintColor: '#00FF00',
        tabBarInactiveTintColor: '#5A6270',
        tabBarStyle: {
          backgroundColor: '#0A0E13',
          borderTopColor: '#2A3440',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        headerShown: false,
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
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🏠' : '🏠'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen}
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🏏' : '🏏'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#00FF00',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -20,
            }}>
              <Text style={{ fontSize: 28, color: '#000000', fontWeight: '300' }}>+</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🔍' : '🔍'}</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: focused ? '#00FF00' : '#2A3440',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: focused ? '#000000' : '#FFFFFF' }}>U</Text>
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
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
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
            {/* Match Screens */}
            <Stack.Screen name="CreateMatch" component={CreateMatchScreen} options={{ headerShown: false }} />
            {/* Tournament Screens */}
            <Stack.Screen name="TournamentsList" component={TournamentsListScreen} options={{ title: 'Tournaments' }} />
            <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} options={{ title: 'Create Tournament' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
