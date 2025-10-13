import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';

type SubscriptionTier = 'free_trial' | 'starter' | 'professional' | 'enterprise';

interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  limits: {
    jobs: number | 'unlimited';
    users: number | 'unlimited';
    storage: string;
  };
}

const SubscriptionScreen = ({ navigation }: any) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>('free_trial');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(7);
  const [loading, setLoading] = useState(false);

  // TODO: Backend developer - Fetch actual subscription status from Supabase
  // useEffect(() => {
  //   const fetchSubscription = async () => {
  //     const { data, error } = await supabase
  //       .from('subscriptions')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .single();
  //
  //     if (data) {
  //       setCurrentPlan(data.tier);
  //       setTrialDaysRemaining(data.trial_days_remaining);
  //     }
  //   };
  //   fetchSubscription();
  // }, []);

  const plans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingPeriod === 'monthly' ? 29 : 290,
      billingPeriod,
      features: [
        'Up to 50 jobs per month',
        'Basic PDF estimates',
        'Email & SMS notifications',
        'Mobile & web access',
        '5GB storage',
        'Email support',
      ],
      limits: {
        jobs: 50,
        users: 1,
        storage: '5GB',
      },
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingPeriod === 'monthly' ? 79 : 790,
      billingPeriod,
      popular: true,
      features: [
        'Unlimited jobs',
        'Advanced PDF customization',
        'Detailed & non-detailed pricing',
        'Multiple tax rates',
        'Up to 5 team members',
        'Bluetooth device integration',
        '50GB storage',
        'Priority email & chat support',
        'Custom branding',
      ],
      limits: {
        jobs: 'unlimited',
        users: 5,
        storage: '50GB',
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingPeriod === 'monthly' ? 199 : 1990,
      billingPeriod,
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Advanced analytics & reporting',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Unlimited storage',
        '24/7 phone support',
        'SLA guarantee',
        'White-label options',
      ],
      limits: {
        jobs: 'unlimited',
        users: 'unlimited',
        storage: 'Unlimited',
      },
    },
  ];

  const handleUpgrade = async (planId: SubscriptionTier) => {
    if (planId === currentPlan) {
      Alert.alert('Current Plan', 'You are already on this plan.');
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Backend developer - Implement Stripe/Paddle checkout
      // const { error } = await supabase.functions.invoke('create-checkout-session', {
      //   body: {
      //     plan_id: planId,
      //     billing_period: billingPeriod,
      //   },
      // });
      //
      // if (error) throw error;
      //
      // // Redirect to payment page
      // Linking.openURL(checkoutUrl);

      // Temporary: Show success for demo
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Upgrade Successful!',
          `You've been upgraded to ${plans.find((p) => p.id === planId)?.name}.\n\n(Demo mode - payment not processed)`,
          [{ text: 'OK' }]
        );
        setCurrentPlan(planId);
      }, 1000);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to process upgrade');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            // TODO: Backend developer - Implement subscription cancellation
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Subscription Cancelled', 'Your subscription will end on [date].');
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <Text style={styles.headerTitle}>Subscription & Billing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Trial Banner */}
        {currentPlan === 'free_trial' && (
          <View style={styles.trialBanner}>
            <Text style={styles.trialIcon}>⏰</Text>
            <View style={styles.trialInfo}>
              <Text style={styles.trialTitle}>Free Trial Active</Text>
              <Text style={styles.trialText}>
                {trialDaysRemaining} days remaining • Upgrade to unlock all features
              </Text>
            </View>
          </View>
        )}

        {/* Current Plan Card */}
        {currentPlan !== 'free_trial' && (
          <View style={styles.currentPlanCard}>
            <View style={styles.currentPlanHeader}>
              <View>
                <Text style={styles.currentPlanLabel}>Current Plan</Text>
                <Text style={styles.currentPlanName}>
                  {plans.find((p) => p.id === currentPlan)?.name || 'Starter'}
                </Text>
              </View>
              <View style={styles.currentPlanBadge}>
                <Text style={styles.currentPlanBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.currentPlanRenewal}>
              Renews on: January 15, 2025
            </Text>
            <TouchableOpacity
              style={styles.manageBillingButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Backend developer - Open Stripe/Paddle customer portal
                Alert.alert('Manage Billing', 'Opens Stripe customer portal (backend needed)');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.manageBillingText}>Manage Billing</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Billing Period Toggle */}
        <View style={styles.billingToggleContainer}>
          <TouchableOpacity
            style={[
              styles.billingToggleButton,
              billingPeriod === 'monthly' && styles.billingToggleButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setBillingPeriod('monthly');
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.billingToggleText,
                billingPeriod === 'monthly' && styles.billingToggleTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingToggleButton,
              billingPeriod === 'yearly' && styles.billingToggleButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setBillingPeriod('yearly');
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.billingToggleText,
                billingPeriod === 'yearly' && styles.billingToggleTextActive,
              ]}
            >
              Yearly
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save 17%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[styles.planCard, plan.popular && styles.planCardPopular]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
              )}

              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>{formatPrice(plan.price)}</Text>
                <Text style={styles.planPeriod}>
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </Text>
              </View>

              {billingPeriod === 'yearly' && (
                <Text style={styles.planYearlyNote}>
                  {formatPrice(plan.price / 12)}/month billed annually
                </Text>
              )}

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.planButton,
                  plan.popular && styles.planButtonPopular,
                  currentPlan === plan.id && styles.planButtonCurrent,
                ]}
                onPress={() => handleUpgrade(plan.id)}
                disabled={loading || currentPlan === plan.id}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.planButtonText,
                    plan.popular && styles.planButtonTextPopular,
                    currentPlan === plan.id && styles.planButtonTextCurrent,
                  ]}
                >
                  {currentPlan === plan.id
                    ? 'Current Plan'
                    : currentPlan === 'free_trial'
                    ? 'Start Trial'
                    : 'Upgrade'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Cancel Subscription */}
        {currentPlan !== 'free_trial' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Questions about plans or billing? Contact our support team.
          </Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Contact Support', 'Opens support chat (backend needed)');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  trialBanner: {
    backgroundColor: Colors.info + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trialIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  trialInfo: {
    flex: 1,
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  trialText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  currentPlanCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPlanLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  currentPlanBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentPlanBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  currentPlanRenewal: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  manageBillingButton: {
    backgroundColor: Colors.backgroundGray,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageBillingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  billingToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  billingToggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  billingToggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  billingToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  billingToggleTextActive: {
    color: Colors.background,
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.background,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  planCardPopular: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.background,
    letterSpacing: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.text,
  },
  planPeriod: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  planYearlyNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  planFeatures: {
    marginTop: 20,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 16,
    color: Colors.success,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  planButton: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  planButtonPopular: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  planButtonCurrent: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  planButtonTextPopular: {
    color: Colors.background,
  },
  planButtonTextCurrent: {
    color: Colors.success,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default SubscriptionScreen;
