import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  label?: string;
}

export function GoogleSignInButton({ onPress, loading = false, label = 'Continue with Google' }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <>
          <Text style={styles.icon}>G</Text>
          <Text style={styles.text}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  } as ViewStyle,
  icon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
});