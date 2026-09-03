import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'solid' | 'outline';
}

export function PrimaryButton({ 
  label, 
  loading = false, 
  variant = 'solid',
  disabled,
  style,
  ...props 
}: PrimaryButtonProps) {
  const isSolid = variant === 'solid';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        isSolid ? styles.solid : styles.outline,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.text, isSolid ? styles.solidText : styles.outlineText]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  solidText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
});