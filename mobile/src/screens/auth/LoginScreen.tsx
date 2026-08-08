import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';

const loginDesignImage = require('../../../assets/startup/login_welcome.jpeg');

export default function LoginScreen({ navigation }: any) {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert(
        'Google Sign In Failed',
        error?.message ||
          'Google sign-in failed. Use a Dev Build and verify Google auth is enabled in Supabase.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Coming Soon', 'Forgot password flow is not connected yet.');
  };

  return (
    <View style={styles.container}>
      <Image source={loginDesignImage} style={styles.backgroundImage} blurRadius={10} />
      <View style={styles.backgroundOverlay} />
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />
      <View style={[styles.curve, styles.curveLeft]} />
      <View style={[styles.curve, styles.curveRight]} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to continue your sports journey.</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Email or Username</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={18} color="#9FE98B" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or username"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color="#9FE98B" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#07110A" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={[styles.secondaryButton, googleLoading && styles.disabledButton]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
              activeOpacity={0.85}
            >
              <View style={styles.googleBadge}>
                <Text style={styles.googleBadgeText}>G</Text>
              </View>
              {googleLoading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.secondaryButtonText}>Continue with Google</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05080B',
  },
  flex: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.24,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 9, 13, 0.88)',
  },
  glow: {
    position: 'absolute',
    borderRadius: 220,
    backgroundColor: 'rgba(71, 227, 107, 0.10)',
  },
  glowTop: {
    width: 260,
    height: 260,
    top: -90,
    left: -40,
  },
  glowBottom: {
    width: 280,
    height: 280,
    bottom: -120,
    right: -70,
  },
  curve: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(120, 228, 139, 0.12)',
  },
  curveLeft: {
    top: -190,
    left: -120,
  },
  curveRight: {
    bottom: -180,
    right: -110,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: 'rgba(130, 236, 146, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(18, 35, 23, 0.45)',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#A8F593',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#A1ACB8',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: 'rgba(8, 13, 17, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(86, 101, 118, 0.22)',
  },
  inputSection: {
    marginBottom: 18,
  },
  label: {
    color: '#F6F8FA',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(10, 14, 18, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(85, 98, 112, 0.45)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: '#9FE98B',
    fontWeight: '500',
  },
  primaryButton: {
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32D15F',
    marginBottom: 22,
    shadowColor: '#32D15F',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#08120A',
  },
  disabledButton: {
    opacity: 0.7,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(130, 145, 160, 0.28)',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 14,
    color: '#98A4AF',
  },
  secondaryButton: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 121, 136, 0.42)',
    backgroundColor: 'rgba(10, 14, 18, 0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  googleBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DB4437',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: '#A1ACB8',
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8DE97B',
  },
});
