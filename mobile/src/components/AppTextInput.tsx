import React from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme';

interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
}

export function AppTextInput({ 
  label, 
  error, 
  rightIcon, 
  onRightIconPress, 
  style,
  ...props 
}: AppTextInputProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#4E5755"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
            <Feather name={rightIcon} size={20} color="#8B9390" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B9390',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E2826',
    borderRadius: 12,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    height: 54,
  },
  inputError: {
    borderColor: '#FF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    height: '100%',
  },
  iconButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
});