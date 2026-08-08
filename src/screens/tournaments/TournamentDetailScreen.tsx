/**
 * TournamentDetailScreen — Premium Dark UI
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { colors } from '../../theme';

export function TournamentDetailScreen() {
  const route = useRoute();
  const { tournamentId } = route.params as { tournamentId: number };
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, [tournamentId]);
  if (loading) return (<View style={styles.container}><View style={styles.loadingWrap}><ActivityIndicator size="large" color={colors.primary} /></View></View>);
  return (<View style={styles.container}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><View style={styles.headerCard}><View style={styles.trophyIcon}><Feather name="award" size={36} color={colors.primary} /></View><Text style={styles.tournamentName}>Tournament #{tournamentId}</Text><Text style={styles.placeholder}>Tournament details, teams, and standings will appear here once the data is loaded.</Text></View></ScrollView></View>);
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:colors.background }, loadingWrap: { flex:1, justifyContent:'center', alignItems:'center' },
  scrollContent: { paddingBottom:40 }, headerCard: { paddingVertical:48, paddingHorizontal:24, alignItems:'center', borderBottomWidth:1, borderBottomColor:colors.divider },
  trophyIcon: { width:80, height:80, borderRadius:28, backgroundColor:colors.primaryMuted, justifyContent:'center', alignItems:'center', marginBottom:20, borderWidth:2, borderColor:'rgba(0,255,102,0.2)' },
  tournamentName: { fontSize:24, fontWeight:'800', color:colors.textPrimary, marginBottom:8 },
  placeholder: { fontSize:14, color:colors.textSecondary, textAlign:'center', lineHeight:21 },
});