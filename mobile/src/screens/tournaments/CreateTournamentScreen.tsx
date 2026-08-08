/**
 * Create Tournament Screen
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { AppTextInput } from '../../components/AppTextInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors } from '../../theme';
import { tournamentsService } from '../../services/tournaments.service';
import { Picker } from '@react-native-picker/picker';

export function CreateTournamentScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'league' | 'knockout' | 'round-robin'>('league');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter tournament name');
      return;
    }

    try {
      setLoading(true);
      const tournament = await tournamentsService.createTournament({
        name: name.trim(),
        description: description.trim() || undefined,
        tournament_type: type,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        prize_pool: prizePool ? Number(prizePool) : undefined,
      });

      Alert.alert('Success!', 'Tournament created', [
        { text: 'OK', onPress: () => {
          navigation.goBack();
          navigation.navigate('TournamentDetail', { tournamentId: tournament.id });
        }}
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Tournament</Text>
        
        <AppTextInput
          label="Tournament Name *"
          placeholder="Champions League"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Tournament Type *</Text>
          <Picker
            selectedValue={type}
            onValueChange={setType}
            style={styles.picker}
          >
            <Picker.Item label="League" value="league" />
            <Picker.Item label="Knockout" value="knockout" />
            <Picker.Item label="Round Robin" value="round-robin" />
          </Picker>
        </View>

        <AppTextInput
          label="Start Date"
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />

        <AppTextInput
          label="End Date"
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
        />

        <AppTextInput
          label="Prize Pool (USD)"
          placeholder="10000"
          value={prizePool}
          onChangeText={setPrizePool}
          keyboardType="number-pad"
        />

        <AppTextInput
          label="Description"
          placeholder="Tournament details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <PrimaryButton
          label="Create Tournament"
          onPress={handleCreate}
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
    color: colors.neutral.text,
    marginBottom: 24,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral.text,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: colors.neutral.surface,
    color: colors.neutral.text,
  },
  button: {
    marginTop: 24,
  },
});
