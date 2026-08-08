import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  View, 
  ViewProps,
  StyleSheet 
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
}

export function ScreenContainer({ 
  children, 
  scrollable = false, 
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  ...props 
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.flex}>{children}</View>
  );

  return (
    <SafeAreaView 
      edges={edges} 
      style={[styles.container, style]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        {...props}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  flex: {
    flex: 1,
  },
});