import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Backend developer - Implement Supabase password reset
      // const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      //   redirectTo: 'yourapp://reset-password',
      // });
      //
      // if (error) throw error;
      //
      // setEmailSent(true);

      // Temporary: Show success for testing
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setEmailSent(true);
      }, 1000);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrors({ general: error.message || 'Failed to send reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>📧</Text>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent password reset instructions to:
            </Text>
            <Text style={styles.successEmail}>{email}</Text>
            <Text style={styles.successNote}>
              If you don't see the email, check your spam folder.
            </Text>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Login');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setEmailSent(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>Didn't receive email? Send again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
          </View>

          {/* Reset Form */}
          <View style={styles.form}>
            <Text style={styles.icon}>🔐</Text>
            <Text style={styles.formTitle}>Forgot Your Password?</Text>
            <Text style={styles.formSubtitle}>
              No worries! Enter your email and we'll send you instructions to reset your password.
            </Text>

            {/* General Error */}
            {errors.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, loading && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backLinkContainer}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Login');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.backLinkText}>
                Remember your password?{' '}
                <Text style={styles.backLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  form: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: Colors.error + '15',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorBannerText: {
    color: Colors.error,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLinkContainer: {
    marginTop: 8,
  },
  backLinkText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  backLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
  // Success state
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  successNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  backToLoginButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  backToLoginText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    padding: 12,
  },
  resendText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
