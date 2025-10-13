import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';

// Window Types
const WINDOW_TYPES = [
  'Double Hung',
  'Casement',
  'Slider',
  'Awning',
  'Bay',
  'Bow',
  'Picture',
  'Garden',
  'Hopper',
];

// Door Types
const DOOR_TYPES = [
  'Entry Door',
  'Patio Door',
  'French Door',
  'Sliding Glass Door',
  'Bi-Fold Door',
  'Storm Door',
];

const PricingConfigScreen = ({ navigation }: any) => {
  // Window Pricing Method
  const [windowPricingMethod, setWindowPricingMethod] = useState<'per_window' | 'united_inch'>('per_window');

  // Window Per-Window Pricing (base prices)
  const [windowBasePrices, setWindowBasePrices] = useState<Record<string, string>>({
    'Double Hung': '900',
    'Casement': '850',
    'Slider': '800',
    'Awning': '750',
    'Bay': '2500',
    'Bow': '3000',
    'Picture': '600',
    'Garden': '1200',
    'Hopper': '700',
  });

  // Window United Inch Pricing
  const [windowUnitedInchPrices, setWindowUnitedInchPrices] = useState<Record<string, string>>({
    'Double Hung': '10',
    'Casement': '9.5',
    'Slider': '9',
    'Awning': '8.5',
    'Bay': '15',
    'Bow': '16',
    'Picture': '8',
    'Garden': '12',
    'Hopper': '8',
  });

  // Window Add-ons
  const [windowInstallCost, setWindowInstallCost] = useState('150');
  const [windowTemperedCost, setWindowTemperedCost] = useState('400');
  const [windowGridCost, setWindowGridCost] = useState('50');
  const [windowLaminateCost, setWindowLaminateCost] = useState('100');
  const [windowTintedCost, setWindowTintedCost] = useState('75');

  // Door Base Pricing
  const [doorBasePrices, setDoorBasePrices] = useState<Record<string, string>>({
    'Entry Door': '1200',
    'Patio Door': '1800',
    'French Door': '2200',
    'Sliding Glass Door': '1500',
    'Bi-Fold Door': '2500',
    'Storm Door': '400',
  });

  // Door Add-ons
  const [doorInstallCost, setDoorInstallCost] = useState('200');
  const [doorTemperedCost, setDoorTemperedCost] = useState('500');
  const [doorGridCost, setDoorGridCost] = useState('50');
  const [doorLaminateCost, setDoorLaminateCost] = useState('150');
  const [doorTintedCost, setDoorTintedCost] = useState('100');

  // Door Sidelight Pricing
  const [sidelightFullGlass, setSidelightFullGlass] = useState('350');
  const [sidelightHalfGlass, setSidelightHalfGlass] = useState('250');
  const [sidelightNoGlass, setSidelightNoGlass] = useState('150');

  // Glass Pane Base Pricing (per square foot)
  const [glassSinglePane, setGlassSinglePane] = useState('15');
  const [glassDoublePane, setGlassDoublePane] = useState('25');
  const [glassTriplePane, setGlassTriplePane] = useState('35');

  // Glass Strength Pricing (per square foot add-on)
  const [glassSingleStrength, setGlassSingleStrength] = useState('0');
  const [glassDoubleStrength, setGlassDoubleStrength] = useState('5');
  const [glassTripleStrength, setGlassTripleStrength] = useState('10');

  // Glass Add-ons (per square foot)
  const [glassLaminateCost, setGlassLaminateCost] = useState('8');
  const [glassTemperedCost, setGlassTemperedCost] = useState('12');
  const [glassTintedCost, setGlassTintedCost] = useState('6');
  const [glassGridCost, setGlassGridCost] = useState('10');

  const handleSave = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // TODO: Backend developer - Save pricing configuration to Supabase
      // const { error } = await supabase
      //   .from('pricing_config')
      //   .upsert({
      //     user_id: userId,
      //     window_pricing_method: windowPricingMethod,
      //     window_base_prices: windowBasePrices,
      //     window_united_inch_prices: windowUnitedInchPrices,
      //     window_addons: {
      //       install: windowInstallCost,
      //       tempered: windowTemperedCost,
      //       grid: windowGridCost,
      //       laminate: windowLaminateCost,
      //       tinted: windowTintedCost,
      //     },
      //     door_base_prices: doorBasePrices,
      //     door_addons: {
      //       install: doorInstallCost,
      //       tempered: doorTemperedCost,
      //       grid: doorGridCost,
      //       laminate: doorLaminateCost,
      //       tinted: doorTintedCost,
      //     },
      //     sidelight_prices: {
      //       full_glass: sidelightFullGlass,
      //       half_glass: sidelightHalfGlass,
      //       no_glass: sidelightNoGlass,
      //     },
      //     glass_pane_prices: {
      //       single: glassSinglePane,
      //       double: glassDoublePane,
      //       triple: glassTriplePane,
      //     },
      //     glass_strength_prices: {
      //       single: glassSingleStrength,
      //       double: glassDoubleStrength,
      //       triple: glassTripleStrength,
      //     },
      //     glass_addons: {
      //       laminate: glassLaminateCost,
      //       tempered: glassTemperedCost,
      //       tinted: glassTintedCost,
      //       grid: glassGridCost,
      //     },
      //   });
      //
      // if (error) throw error;

      Alert.alert('Success', 'Pricing configuration saved successfully!');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to save pricing configuration.');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
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
        <Text style={styles.headerTitle}>Pricing Configuration</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.container}>
          {/* WINDOWS PRICING */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🪟 Windows Pricing</Text>

            {/* Pricing Method Selection */}
            <View style={styles.methodSelector}>
              <Text style={styles.label}>Pricing Method</Text>
              <View style={styles.methodButtons}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    windowPricingMethod === 'per_window' && styles.methodButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setWindowPricingMethod('per_window');
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.methodButtonText,
                      windowPricingMethod === 'per_window' && styles.methodButtonTextActive,
                    ]}
                  >
                    Per Window
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    windowPricingMethod === 'united_inch' && styles.methodButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setWindowPricingMethod('united_inch');
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.methodButtonText,
                      windowPricingMethod === 'united_inch' && styles.methodButtonTextActive,
                    ]}
                  >
                    United Inch
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {windowPricingMethod === 'per_window'
                  ? '💡 Per Window: Base price per window (e.g., $900). User can override with custom price.'
                  : '💡 United Inch: (Width + Height) × Price per UI. Example: 30" + 40" = 70 UI × $10 = $700'}
              </Text>
            </View>

            {/* Window Type Pricing */}
            <Text style={styles.subsectionTitle}>
              {windowPricingMethod === 'per_window' ? 'Base Price per Window Type' : 'Price per United Inch by Type'}
            </Text>
            {WINDOW_TYPES.map((type) => (
              <View key={type} style={styles.priceRow}>
                <Text style={styles.priceLabel}>{type}</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={
                      windowPricingMethod === 'per_window'
                        ? windowBasePrices[type]
                        : windowUnitedInchPrices[type]
                    }
                    onChangeText={(value) => {
                      if (windowPricingMethod === 'per_window') {
                        setWindowBasePrices({ ...windowBasePrices, [type]: value });
                      } else {
                        setWindowUnitedInchPrices({ ...windowUnitedInchPrices, [type]: value });
                      }
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                  {windowPricingMethod === 'united_inch' && (
                    <Text style={styles.unitText}>/UI</Text>
                  )}
                </View>
              </View>
            ))}

            {/* Window Add-ons */}
            <Text style={styles.subsectionTitle}>Window Add-on Costs</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Installation</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={windowInstallCost}
                  onChangeText={setWindowInstallCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tempered Glass</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={windowTemperedCost}
                  onChangeText={setWindowTemperedCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Grids</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={windowGridCost}
                  onChangeText={setWindowGridCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Laminate</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={windowLaminateCost}
                  onChangeText={setWindowLaminateCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tinted</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={windowTintedCost}
                  onChangeText={setWindowTintedCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
          </View>

          {/* DOORS PRICING */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚪 Doors Pricing</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Doors are priced per unit with custom pricing. Size, glass type, and options affect final price.
              </Text>
            </View>

            {/* Door Type Pricing */}
            <Text style={styles.subsectionTitle}>Base Price per Door Type</Text>
            {DOOR_TYPES.map((type) => (
              <View key={type} style={styles.priceRow}>
                <Text style={styles.priceLabel}>{type}</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={doorBasePrices[type]}
                    onChangeText={(value) => {
                      setDoorBasePrices({ ...doorBasePrices, [type]: value });
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                </View>
              </View>
            ))}

            {/* Door Add-ons */}
            <Text style={styles.subsectionTitle}>Door Add-on Costs</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Installation</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={doorInstallCost}
                  onChangeText={setDoorInstallCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tempered Glass</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={doorTemperedCost}
                  onChangeText={setDoorTemperedCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Grids</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={doorGridCost}
                  onChangeText={setDoorGridCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Laminate</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={doorLaminateCost}
                  onChangeText={setDoorLaminateCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tinted</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={doorTintedCost}
                  onChangeText={setDoorTintedCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>

            {/* Sidelight Pricing */}
            <Text style={styles.subsectionTitle}>Sidelight Pricing (Per Sidelight)</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Full Glass</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={sidelightFullGlass}
                  onChangeText={setSidelightFullGlass}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Half Glass</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={sidelightHalfGlass}
                  onChangeText={setSidelightHalfGlass}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>No Glass</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={sidelightNoGlass}
                  onChangeText={setSidelightNoGlass}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>
            </View>
          </View>

          {/* GLASS PRICING */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔷 Glass Pricing (Per Square Foot)</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 Glass is priced per square foot. Base price varies by pane count, with add-ons for strength and options.
              </Text>
            </View>

            {/* Glass Pane Pricing */}
            <Text style={styles.subsectionTitle}>Base Price per Pane Type</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Single Pane</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassSinglePane}
                  onChangeText={setGlassSinglePane}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Double Pane</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassDoublePane}
                  onChangeText={setGlassDoublePane}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Triple Pane</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassTriplePane}
                  onChangeText={setGlassTriplePane}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>

            {/* Glass Strength Pricing */}
            <Text style={styles.subsectionTitle}>Glass Strength Add-on (Per Sq Ft)</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Single Strength</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassSingleStrength}
                  onChangeText={setGlassSingleStrength}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Double Strength</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassDoubleStrength}
                  onChangeText={setGlassDoubleStrength}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Triple Strength</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassTripleStrength}
                  onChangeText={setGlassTripleStrength}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>

            {/* Glass Add-ons */}
            <Text style={styles.subsectionTitle}>Glass Options Add-on (Per Sq Ft)</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Laminate</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassLaminateCost}
                  onChangeText={setGlassLaminateCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tempered</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassTemperedCost}
                  onChangeText={setGlassTemperedCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tinted</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassTintedCost}
                  onChangeText={setGlassTintedCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Grids</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={glassGridCost}
                  onChangeText={setGlassGridCost}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
                <Text style={styles.unitText}>/sq ft</Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>💾 Save Pricing Configuration</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
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
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: Colors.backgroundGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  methodSelector: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  methodButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  methodButtonTextActive: {
    color: Colors.primary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
  },
  currencySymbol: {
    fontSize: 16,
    color: Colors.text,
    marginRight: 4,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
    minWidth: 60,
  },
  unitText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default PricingConfigScreen;
