/**
 * MOLDIN - Cricket Sports Platform
 * Master Architecture Entry Point with AuthContext
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null; errorInfo: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ errorInfo });
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#04090F' }}>
          <ScrollView contentContainerStyle={styles.errorContainer}>
            <Text style={styles.errorEmoji}>💥</Text>
            <Text style={styles.errorTitle}>App Crashed</Text>
            <Text style={styles.errorMessage}>{this.state.error?.message || 'Unknown error'}</Text>
            <Text style={styles.errorStack}>{this.state.error?.stack?.slice(0, 800) || 'No stack trace'}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => this.setState({ hasError: false, error: null, errorInfo: null })}>
              <Text style={styles.retryBtnText}>Reload</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#04090F' },
  errorEmoji: { fontSize: 64, marginBottom: 16 },
  errorTitle: { fontSize: 24, fontWeight: '800', color: '#FF3B4A', marginBottom: 12 },
  errorMessage: { fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 16, lineHeight: 24 },
  errorStack: { fontSize: 11, color: '#5A6878', textAlign: 'center', marginBottom: 28, fontFamily: 'monospace', lineHeight: 16 },
  retryBtn: { backgroundColor: '#00FF66', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  retryBtnText: { fontSize: 16, fontWeight: '700', color: '#08120A' },
});