/**
 * SettingsScreen — Premium Dark UI
 * Clean grouped settings menu with proper logout flow.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

interface SettingItem { id: string; icon: keyof typeof Feather.glyphMap; label: string; value?: string; danger?: boolean; action?: () => void; }

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        try { setLoggingOut(true); await logout(); }
        catch (error: any) { Alert.alert('Error', error?.message || 'Failed to logout'); }
        finally { setLoggingOut(false); }
      }},
    ]);
  };

  const showComingSoon = (f: string) => Alert.alert('Coming Soon', `${f} will be available soon.`);

  const sections: { title: string; items: SettingItem[] }[] = [
    { title: 'Account', items: [
      { id: 'profile', icon: 'user', label: 'Edit Profile', action: () => navigation.navigate('Profile' as never) },
      { id: 'password', icon: 'lock', label: 'Change Password', action: () => showComingSoon('Change Password') },
      { id: 'notifications', icon: 'bell', label: 'Notifications', action: () => showComingSoon('Notifications') },
      { id: 'privacy', icon: 'shield', label: 'Privacy', action: () => showComingSoon('Privacy') },
    ]},
    { title: 'Preferences', items: [
      { id: 'theme', icon: 'moon', label: 'Dark Mode', value: 'On' },
      { id: 'language', icon: 'globe', label: 'Language', value: 'English', action: () => showComingSoon('Language') },
      { id: 'units', icon: 'bar-chart-2', label: 'Units', value: 'Metric', action: () => showComingSoon('Units') },
    ]},
    { title: 'Support', items: [
      { id: 'help', icon: 'help-circle', label: 'Help Center', action: () => showComingSoon('Help Center') },
      { id: 'contact', icon: 'mail', label: 'Contact Us', action: () => showComingSoon('Contact Us') },
      { id: 'rate', icon: 'star', label: 'Rate App', action: () => showComingSoon('Rate App') },
      { id: 'terms', icon: 'file-text', label: 'Terms & Conditions', action: () => showComingSoon('Terms') },
      { id: 'privacy-policy', icon: 'eye-off', label: 'Privacy Policy', action: () => showComingSoon('Privacy Policy') },
    ]},
    { title: 'About', items: [
      { id: 'version', icon: 'info', label: 'App Version', value: '1.0.0' },
      { id: 'email', icon: 'at-sign', label: 'Account', value: user?.email || 'N/A' },
    ]},
  ];

  return (<View style={styles.container}><View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Feather name="arrow-left" size={20} color={colors.textPrimary} /></TouchableOpacity><Text style={styles.headerTitle}>Settings</Text><View style={styles.headerSpacer} /></View><ScrollView style={styles.content} showsVerticalScrollIndicator={false}>{sections.map((section) => (<View key={section.title} style={styles.section}><Text style={styles.sectionTitle}>{section.title}</Text><View style={styles.sectionBody}>{section.items.map((item, idx) => (<TouchableOpacity key={item.id} style={[styles.settingRow, idx === section.items.length - 1 && styles.settingRowLast]} onPress={item.action} activeOpacity={item.action ? 0.6 : 1} disabled={!item.action}><Feather name={item.icon} size={18} color={item.danger ? colors.error : colors.textSecondary} style={styles.settingIcon} /><Text style={[styles.settingLabel, item.danger && styles.settingLabelDanger]}>{item.label}</Text>{item.value && <Text style={styles.settingValue}>{item.value}</Text>}{item.action && <Feather name="chevron-right" size={16} color={colors.textMuted} />}</TouchableOpacity>))}</View></View>))}<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8} disabled={loggingOut}>{loggingOut ? (<ActivityIndicator color={colors.error} size="small" />) : (<Feather name="log-out" size={18} color={colors.error} />)}<Text style={styles.logoutText}>{loggingOut ? 'Logging out...' : 'Logout'}</Text></TouchableOpacity><View style={styles.footer}><Text style={styles.footerText}>MOLDIN © 2026</Text></View></ScrollView></View>);
}