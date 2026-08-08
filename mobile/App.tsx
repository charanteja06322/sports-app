/**
 * Cricket Sports Platform - Main App
 * 
 * Master Architecture Entry Point with AuthContext
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="light" backgroundColor="#1a1a2e" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}