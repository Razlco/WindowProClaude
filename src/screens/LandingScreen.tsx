import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../constants';

const LandingScreen = ({ navigation }: any) => {
  const handleLogin = () => {
    // TODO: Implement actual authentication
    // For now, navigate directly to home
    navigation.replace('HomeMain');
  };

  const features = [
    {
      icon: '📏',
      title: 'Smart Measurements',
      description: 'Advanced measurement tools with automatic calculations and unit conversion',
      items: [
        'Photo documentation',
        'Bluetooth device support',
        'Room location tracking',
        'Instant calculations',
      ],
    },
    {
      icon: '📄',
      title: 'Professional PDFs',
      description: 'Generate beautiful, detailed quotes with company branding',
      items: [
        'Company branding',
        'Detailed measurements',
        'Photo integration',
        'Terms & conditions',
      ],
    },
    {
      icon: '📧',
      title: 'Email Integration',
      description: 'Automatically send professional quotes to customers',
      items: [
        'Instant delivery',
        'Professional templates',
        'PDF attachments',
        'Customer communication',
      ],
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Field-ready interface with offline mode',
      items: [
        'Offline measurements',
        'Auto-save functionality',
        'Sync when online',
        'Touch-friendly design',
      ],
    },
    {
      icon: '📍',
      title: 'GPS Location',
      description: 'Automatically capture job site locations',
      items: [
        'Real-time tracking',
        'Address lookup',
        'Location history',
        'Job site mapping',
      ],
    },
    {
      icon: '💰',
      title: 'Pricing Engine',
      description: 'Automated pricing calculations with markup options',
      items: [
        'Automatic calculations',
        'Material pricing',
        'Installation charges',
        'Tax calculations',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Window Pro</Text>
        <Text style={styles.heroSubtitle}>
          Professional window and glass measurement and quoting system.
          Create detailed estimates, generate PDF quotes, and manage projects from anywhere.
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In to Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            <View style={styles.featureItems}>
              {feature.items.map((item, i) => (
                <Text key={i} style={styles.featureItem}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to streamline your window business?</Text>
        <Text style={styles.ctaSubtitle}>
          Join professionals who trust Window Pro for their estimation needs.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleLogin}>
          <Text style={styles.ctaButtonText}>Get Started Today</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    maxWidth: 600,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  featureCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  featureItems: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default LandingScreen;
