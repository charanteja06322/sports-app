/**
 * Create Team Screen
 * Form to create a new team
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppTextInput } from '../../components/AppTextInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors } from '../../theme';
import { teamsService } from '../../services/teams.service';

export function CreateTeamScreen() {
  const navigation = useNavigation();
  
  const [teamName, setTeamName] = useState('');
  const [shortName, setShortName] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async () => {
    // Validation
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter team name');
      return;
    }

    if (foundedYear && (isNaN(Number(foundedYear)) || Number(foundedYear) < 1800 || Number(foundedYear) > new Date().getFullYear())) {
      Alert.alert('Error', 'Please enter a valid year');
      return;
    }

    try {
      setLoading(true);
      
      const teamData = {
        name: teamName.trim(),
        short_name: shortName.trim() || undefined,
        home_ground: homeGround.trim() || undefined,
        founded_year: foundedYear ? Number(foundedYear) : undefined,
        description: description.trim() || undefined,
      };

      const newTeam = await teamsService.createTeam(teamData);
      
      Alert.alert(
        'Success!',
        'Team created successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              // Navigate to team detail
              (navigation as any).navigate('TeamDetail', { teamId: newTeam.id });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Team</Text>
        <Text style={styles.subtitle}>
          Fill in the details to create your cricket team
        </Text>

        <AppTextInput
          label="Team Name *"
          placeholder="Royal Challengers"
          value={teamName}
          onChangeText={setTeamName}
          autoCapitalize="words"
        />

        <AppTextInput
          label="Short Name"
          placeholder="RCB"
          value={shortName}
          onChangeText={setShortName}
          autoCapitalize="characters"
          maxLength={5}
        />

        <AppTextInput
          label="Home Ground"
          placeholder="M. Chinnaswamy Stadium"
          value={homeGround}
          onChangeText={setHomeGround}
          autoCapitalize="words"
        />

        <AppTextInput
          label="Founded Year"
          placeholder="2008"
          value={foundedYear}
          onChangeText={setFoundedYear}
          keyboardType="number-pad"
          maxLength={4}
        />

        <AppTextInput
          label="Description"
          placeholder="Tell us about your team..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <PrimaryButton
          label="Create Team"
          onPress={handleCreateTeam}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.secondary[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary[500],
    marginBottom: 32,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 24,
  },
});
