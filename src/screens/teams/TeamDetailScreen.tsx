/**
 * Team Detail Screen — Premium Dark UI
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors } from '../../theme';
import { teamsService } from '../../services/teams.service';

export function TeamDetailScreen() {
  const route = useRoute();
  const { teamId } = route.params as { teamId: string };
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => { loadTeamDetails(); }, [teamId]);

  const loadTeamDetails = async () => {
    try {
      const data = await teamsService.getTeamById(teamId);
      setTeam(data);
      const myTeams = await teamsService.getMyTeams();
      setIsMember(myTeams.some((t: any) => t.id === teamId));
    } catch (error: any) { Alert.alert('Error', error.message); }
    finally { setLoading(false); }
  };

  const handleJoinTeam = async () => {
    Alert.alert('Join Team', `Do you want to join ${team.name}?`, [{ text:'Cancel',style:'cancel' },{ text:'Join',onPress:async()=>{ try{ setJoining(true); await teamsService.joinTeam(teamId); Alert.alert('Success','You have joined the team!'); loadTeamDetails(); }catch(error:any){Alert.alert('Error',error.message);}finally{setJoining(false);}}}]);
  };

  const handleLeaveTeam = async () => {
    Alert.alert('Leave Team', `Are you sure you want to leave ${team.name}?`, [{ text:'Cancel',style:'cancel' },{ text:'Leave',style:'destructive',onPress:async()=>{ try{ setJoining(true); await teamsService.leaveTeam(teamId); Alert.alert('Success','You have left the team'); loadTeamDetails(); }catch(error:any){Alert.alert('Error',error.message);}finally{setJoining(false);}}}]);
  };

  if (loading) return (<View style={styles.container}><View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.loadingText}>Loading team...</Text></View></View>);
  if (!team) return (<View style={styles.container}><View style={styles.emptyContainer}><Feather name="alert-circle" size={40} color={colors.textMuted} /><Text style={styles.emptyText}>Team not found</Text></View></View>);

  return (<View style={styles.container}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><View style={styles.headerCard}><View style={styles.teamIcon}><Text style={styles.teamInitial}>{team.short_name?.[0] || team.name[0]}</Text></View><Text style={styles.teamName}>{team.name}</Text>{team.short_name && <Text style={styles.teamShortName}>{team.short_name}</Text>}{team.description && <Text style={styles.description}>{team.description}</Text>}</View><View style={styles.infoCard}><Text style={styles.sectionTitle}>Team Information</Text>{team.home_ground && (<View style={styles.infoRow}><View style={styles.infoIconWrap}><Feather name="map-pin" size={18} color={colors.primary} /></View><View style={styles.infoContent}><Text style={styles.infoLabel}>Home Ground</Text><Text style={styles.infoValue}>{team.home_ground}</Text></View></View>)}{team.founded_year && (<View style={styles.infoRow}><View style={styles.infoIconWrap}><Feather name="calendar" size={18} color={colors.primary} /></View><View style={styles.infoContent}><Text style={styles.infoLabel}>Founded</Text><Text style={styles.infoValue}>{team.founded_year}</Text></View></View>)}<View style={styles.infoRow}><View style={styles.infoIconWrap}><Feather name="users" size={18} color={colors.primary} /></View><View style={styles.infoContent}><Text style={styles.infoLabel}>Members</Text><Text style={styles.infoValue}>{team.team_members?.length || 0} players</Text></View></View></View>{team.team_members && team.team_members.length>0 && (<View style={styles.membersCard}><Text style={styles.sectionTitle}>Team Members</Text>{team.team_members.map((member:any,index:number)=>(<View key={member.id} style={[styles.memberRow,index===team.team_members.length-1&&styles.memberRowLast]}><View style={styles.memberAvatar}><Text style={styles.memberInitial}>{member.profiles?.full_name?.[0]||'?'}</Text></View><View style={styles.memberInfo}><Text style={styles.memberName}>{member.profiles?.full_name||'Unknown'}</Text><Text style={styles.memberRole}>{member.role}</Text></View>{member.jersey_number&&(<View style={styles.jerseyBadge}><Text style={styles.jerseyNumber}>#{member.jersey_number}</Text></View>)}</View>))}</View>)}<View style={styles.actionContainer}>{isMember?(<TouchableOpacity style={styles.leaveButton} onPress={handleLeaveTeam} disabled={joining}><Feather name="log-out" size={18} color={colors.error}/><Text style={styles.leaveButtonText}>Leave Team</Text></TouchableOpacity>):(<PrimaryButton label="Join Team" onPress={handleJoinTeam} loading={joining} disabled={joining} size="lg"/>)}</View></ScrollView></View>);
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},scrollContent:{paddingBottom:40},loadingContainer:{flex:1,justifyContent:'center',alignItems:'center'},loadingText:{marginTop:14,fontSize:15,color:colors.textSecondary},emptyContainer:{flex:1,justifyContent:'center',alignItems:'center',gap:12},emptyText:{fontSize:16,color:colors.textSecondary},headerCard:{paddingVertical:32,paddingHorizontal:24,alignItems:'center',borderBottomWidth:1,borderBottomColor:colors.divider},teamIcon:{width:88,height:88,borderRadius:28,backgroundColor:colors.primaryMuted,justifyContent:'center',alignItems:'center',marginBottom:18,borderWidth:2,borderColor:'rgba(0,255,102,0.2)'},teamInitial:{fontSize:36,fontWeight:'800',color:colors.primary},teamName:{fontSize:26,fontWeight:'800',color:colors.textPrimary,marginBottom:4},teamShortName:{fontSize:16,fontWeight:'600',color:colors.primary,marginBottom:12},description:{fontSize:14,color:colors.textSecondary,textAlign:'center',lineHeight:21,maxWidth:300},infoCard:{paddingHorizontal:20,paddingVertical:20},sectionTitle:{fontSize:16,fontWeight:'700',color:colors.textPrimary,marginBottom:14},infoRow:{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.divider},infoIconWrap:{width:36,height:36,borderRadius:12,backgroundColor:colors.primaryMuted,justifyContent:'center',alignItems:'center'},infoContent:{marginLeft:14,flex:1},infoLabel:{fontSize:11,color:colors.textMuted,marginBottom:2,textTransform:'uppercase',letterSpacing:0.4},infoValue:{fontSize:15,fontWeight:'600',color:colors.textPrimary},membersCard:{paddingHorizontal:20,paddingVertical:20},memberRow:{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.divider},memberRowLast:{borderBottomWidth:0},memberAvatar:{width:42,height:42,borderRadius:21,backgroundColor:colors.primaryMuted,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'rgba(0,255,102,0.15)'},memberInitial:{fontSize:16,fontWeight:'700',color:colors.primary},memberInfo:{flex:1,marginLeft:12},memberName:{fontSize:15,fontWeight:'600',color:colors.textPrimary},memberRole:{fontSize:12,color:colors.textSecondary,textTransform:'capitalize',marginTop:2},jerseyBadge:{backgroundColor:colors.primaryMuted,paddingHorizontal:12,paddingVertical:5,borderRadius:10,borderWidth:1,borderColor:colors.border},jerseyNumber:{fontSize:13,fontWeight:'700',color:colors.primary},actionContainer:{paddingHorizontal:20,paddingTop:12},leaveButton:{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:15,borderRadius:16,borderWidth:1,borderColor:'rgba(255,59,74,0.25)',backgroundColor:'rgba(255,59,74,0.08)',gap:8},leaveButtonText:{fontSize:16,fontWeight:'700',color:colors.error}});