import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors } from '../../theme/colors';

export default function CreateScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>P</Text>
        <Text style={styles.headerTitle}>Create</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Build, organize, and play.</Text>

        {/* Create Match */}
        <TouchableOpacity style={styles.createCard} onPress={() => navigation.navigate('CreateMatch')}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconEmoji}>🏏</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Create Match</Text>
            <Text style={styles.cardDescription}>Set up a cricket match</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Create Team */}
        <TouchableOpacity style={styles.createCard} onPress={() => navigation.navigate('CreateTeam')}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconEmoji}>👥</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Create Team</Text>
            <Text style={styles.cardDescription}>Build your own team</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Create Tournament */}
        <TouchableOpacity style={styles.createCard} onPress={() => navigation.navigate('CreateTournament')}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconEmoji}>🏆</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Create Tournament</Text>
            <Text style={styles.cardDescription}>Organize a tournament</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Create Event */}
        <TouchableOpacity style={styles.createCard} onPress={() => Alert.alert('Create Event', 'Event creation coming soon.')}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconEmoji}>📅</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Create Event</Text>
            <Text style={styles.cardDescription}>Plan an event</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Create Post */}
        <TouchableOpacity style={styles.createCard} onPress={() => Alert.alert('Create Post', 'Post creation coming soon.')}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconEmoji}>📝</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Create Post</Text>
            <Text style={styles.cardDescription}>Share moments with community</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Play Now */}
        <TouchableOpacity style={[styles.createCard, styles.playNowCard]} onPress={() => navigation.navigate('Matches')}>
          <View style={styles.cardIcon}>
            <Text style={styles.iconEmoji}>⚡</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Play Now</Text>
            <Text style={styles.cardDescription}>Find or join a game quickly</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 32,
  },
  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  playNowCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardArrow: {
    fontSize: 28,
    color: colors.textMuted,
  },
});
