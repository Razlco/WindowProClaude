import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, DEFAULT_MEASUREMENT } from '../constants';
import {
  Measurement,
  ProductType,
  GlassType,
  FrameType,
  Customer,
  Job,
  JobStatus,
} from '../types';
import {
  generateMeasurementId,
  generateJobId,
  generateJobNumber,
  getNextJobNumber,
} from '../utils';
import { calculateJobPricing } from '../utils/pricing';
import { MeasurementCard } from '../components';
import { useJobStorage } from '../hooks';

const MeasurementsScreen = ({ navigation, route }: any) => {
  const { customer, measurements: initialMeasurements = [], jobId, category } = route.params || {};
  const { saveJob, jobs } = useJobStorage();

  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);
  const [showForm, setShowForm] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(!category && measurements.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<'WINDOW' | 'DOOR' | 'GLASS' | null>(null);
  const [saving, setSaving] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Form state for new measurement
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [location, setLocation] = useState('');
  const [productType, setProductType] = useState<ProductType>(DEFAULT_MEASUREMENT.productType);
  const [selectedGlassTypes, setSelectedGlassTypes] = useState<GlassType[]>([
    GlassType.DOUBLE_PANE,
    GlassType.DOUBLE_STRENGTH
  ]);
  const [frameType, setFrameType] = useState<FrameType | undefined>(FrameType.VINYL);
  const [hingePlacement, setHingePlacement] = useState<'LEFT' | 'RIGHT' | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // Pricing options state
  const [paneCount, setPaneCount] = useState<'SINGLE' | 'DOUBLE' | 'TRIPLE'>('DOUBLE');
  const [glassStrength, setGlassStrength] = useState<'SINGLE' | 'DOUBLE' | 'TRIPLE'>('DOUBLE');
  const [hasLaminate, setHasLaminate] = useState(false);
  const [hasTempered, setHasTempered] = useState(false);
  const [hasTinted, setHasTinted] = useState(false);
  const [hasGrids, setHasGrids] = useState(false);
  const [gridPattern, setGridPattern] = useState('');
  const [hasInstallation, setHasInstallation] = useState(false);
  const [customPrice, setCustomPrice] = useState('');

  // Door-specific pricing
  const [sidelightCount, setSidelightCount] = useState('0');
  const [sidelightType, setSidelightType] = useState<'FULL' | 'HALF' | 'NONE'>('FULL');

  // Edit mode
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null);

  const handleCategorySelect = (category: 'WINDOW' | 'DOOR' | 'GLASS') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    setShowCategorySelection(false);
    setShowForm(true);

    // Set default product type based on category
    if (category === 'WINDOW') {
      setProductType(ProductType.SINGLE_HUNG);
    } else if (category === 'DOOR') {
      // For now, we'll keep using window types since we don't have door types yet
      setProductType(ProductType.SINGLE_HUNG);
    } else {
      // GLASS category
      setProductType(ProductType.PICTURE);
    }
  };

  // Auto-select category if provided from navigation
  React.useEffect(() => {
    if (category && !selectedCategory) {
      handleCategorySelect(category);
    }
  }, [category, selectedCategory]);

  // Keyboard listeners
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const resetForm = () => {
    setWidth('');
    setHeight('');
    setDepth('');
    setQuantity('1');
    setLocation('');
    setProductType(DEFAULT_MEASUREMENT.productType);
    setSelectedGlassTypes([GlassType.DOUBLE_PANE, GlassType.DOUBLE_STRENGTH]);
    setFrameType(FrameType.VINYL);
    setHingePlacement(undefined);
    setNotes('');
    // Reset pricing options
    setPaneCount('DOUBLE');
    setGlassStrength('DOUBLE');
    setHasLaminate(false);
    setHasTempered(false);
    setHasTinted(false);
    setHasGrids(false);
    setGridPattern('');
    setHasInstallation(false);
    setCustomPrice('');
    setSidelightCount('0');
    setSidelightType('FULL');
  };

  const getProductTypeOptions = (): ProductType[] => {
    // All products are windows now, so return all window types
    return Object.values(ProductType);
  };

  const checkTemperedGlassRequirement = (widthNum: number, heightNum: number): boolean => {
    // Calculate square footage
    const squareFeet = (widthNum * heightNum) / 144; // Convert from square inches to square feet
    return squareFeet >= 9;
  };

  const handleAddMeasurement = () => {
    // Validate inputs
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const quantityNum = parseInt(quantity, 10);

    if (!width || isNaN(widthNum) || widthNum <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Validation Error', 'Please enter a valid width');
      return;
    }

    if (!height || isNaN(heightNum) || heightNum <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Validation Error', 'Please enter a valid height');
      return;
    }

    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }

    if (selectedGlassTypes.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Validation Error', 'Please select at least one glass type');
      return;
    }

    // Check if we're in edit mode
    if (editingMeasurementId) {
      // If editing, check tempered requirement and update
      const shouldSuggestTempered = checkTemperedGlassRequirement(widthNum, heightNum);
      if (shouldSuggestTempered && !hasTempered) {
        const squareFeet = ((widthNum * heightNum) / 144).toFixed(1);
        Alert.alert(
          'Building Code Notice',
          `This glass is ${squareFeet} sq ft, which is 9 sq ft or larger.\n\nBuilding codes typically require tempered glass for:\n• Glass 9+ sq ft\n• Within 18" of the floor\n• Within 36" of a walkway\n\nWould you like to enable tempered glass?`,
          [
            {
              text: 'No, Keep Current',
              style: 'cancel',
              onPress: () => {
                handleUpdateMeasurement(widthNum, heightNum, quantityNum);
              },
            },
            {
              text: 'Yes, Use Tempered',
              onPress: () => {
                setHasTempered(true);
                handleUpdateMeasurement(widthNum, heightNum, quantityNum, true);
              },
            },
          ]
        );
      } else {
        handleUpdateMeasurement(widthNum, heightNum, quantityNum);
      }
      return;
    }

    // Check if tempered glass should be suggested based on size (for new measurements)
    const shouldSuggestTempered = checkTemperedGlassRequirement(widthNum, heightNum);

    if (shouldSuggestTempered && !hasTempered) {
      const squareFeet = ((widthNum * heightNum) / 144).toFixed(1);
      Alert.alert(
        'Building Code Notice',
        `This glass is ${squareFeet} sq ft, which is 9 sq ft or larger.\n\nBuilding codes typically require tempered glass for:\n• Glass 9+ sq ft\n• Within 18" of the floor\n• Within 36" of a walkway\n\nWould you like to enable tempered glass?`,
        [
          {
            text: 'No, Keep Current',
            style: 'cancel',
            onPress: () => {
              addMeasurement(widthNum, heightNum, quantityNum);
            },
          },
          {
            text: 'Yes, Use Tempered',
            onPress: () => {
              setHasTempered(true);
              addMeasurement(widthNum, heightNum, quantityNum, true);
            },
          },
        ]
      );
    } else {
      addMeasurement(widthNum, heightNum, quantityNum);
    }
  };

  const addMeasurement = (
    widthNum: number,
    heightNum: number,
    quantityNum: number,
    overrideTempered?: boolean
  ) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newMeasurement: Measurement = {
      id: generateMeasurementId(),
      width: widthNum,
      height: heightNum,
      depth: depth ? parseFloat(depth) : undefined,
      quantity: quantityNum,
      location: location.trim() || undefined,
      productType,
      glassTypes: selectedGlassTypes,
      frameType,
      hingePlacement,
      // Pricing options
      hasTempered: overrideTempered !== undefined ? overrideTempered : hasTempered,
      hasLaminate,
      hasTinted,
      hasGrids,
      gridPattern: hasGrids ? gridPattern : undefined,
      hasInstallation,
      customPrice: customPrice ? parseFloat(customPrice) : undefined,
      sidelightCount: selectedCategory === 'DOOR' ? parseInt(sidelightCount) : undefined,
      sidelightType: selectedCategory === 'DOOR' ? sidelightType : undefined,
      notes: notes.trim() || undefined,
      measuredAt: new Date(),
    };

    setMeasurements([...measurements, newMeasurement]);
    resetForm();
    // Keep the form open but reset fields for next measurement
    setShowForm(true);
  };

  const handleRemoveMeasurement = (measurementId: string) => {
    Alert.alert(
      'Remove Measurement',
      'Are you sure you want to remove this measurement?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setMeasurements(measurements.filter((m) => m.id !== measurementId));
          },
        },
      ]
    );
  };

  const handleEditMeasurement = (measurementId: string) => {
    const measurement = measurements.find((m) => m.id === measurementId);
    if (!measurement) return;

    // Populate form with measurement data
    setWidth(measurement.width.toString());
    setHeight(measurement.height.toString());
    setDepth(measurement.depth?.toString() || '');
    setQuantity(measurement.quantity.toString());
    setLocation(measurement.location || '');
    setProductType(measurement.productType);
    setSelectedGlassTypes(measurement.glassTypes);
    setFrameType(measurement.frameType);
    setHingePlacement(measurement.hingePlacement);
    setHasTempered(measurement.hasTempered);
    setHasLaminate(measurement.hasLaminate);
    setHasTinted(measurement.hasTinted);
    setHasGrids(measurement.hasGrids);
    setGridPattern(measurement.gridPattern || '');
    setHasInstallation(measurement.hasInstallation);
    setCustomPrice(measurement.customPrice?.toString() || '');
    setSidelightCount(measurement.sidelightCount?.toString() || '0');
    setSidelightType(measurement.sidelightType || 'FULL');
    setNotes(measurement.notes || '');

    // Set edit mode
    setEditingMeasurementId(measurementId);
    setShowForm(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleUpdateMeasurement = (
    widthNum: number,
    heightNum: number,
    quantityNum: number,
    overrideTempered?: boolean
  ) => {
    if (!editingMeasurementId) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const updatedMeasurement: Measurement = {
      id: editingMeasurementId,
      width: widthNum,
      height: heightNum,
      depth: depth ? parseFloat(depth) : undefined,
      quantity: quantityNum,
      location: location.trim() || undefined,
      productType,
      glassTypes: selectedGlassTypes,
      frameType,
      hingePlacement,
      hasTempered: overrideTempered !== undefined ? overrideTempered : hasTempered,
      hasLaminate,
      hasTinted,
      hasGrids,
      gridPattern: hasGrids ? gridPattern : undefined,
      hasInstallation,
      customPrice: customPrice ? parseFloat(customPrice) : undefined,
      sidelightCount: selectedCategory === 'DOOR' ? parseInt(sidelightCount) : undefined,
      sidelightType: selectedCategory === 'DOOR' ? sidelightType : undefined,
      notes: notes.trim() || undefined,
      measuredAt: new Date(),
    };

    setMeasurements(measurements.map((m) => (m.id === editingMeasurementId ? updatedMeasurement : m)));
    setEditingMeasurementId(null);
    resetForm();
    setShowForm(false);
  };

  const handleSaveJob = async () => {
    if (!customer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Customer information is missing');
      return;
    }

    if (measurements.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please add at least one measurement');
      return;
    }

    try {
      setSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const pricing = calculateJobPricing(measurements);
      const existingJobNumbers = jobs.map((j) => j.jobNumber);
      const jobNumber = getNextJobNumber(existingJobNumbers);

      const newJob: Job = {
        id: jobId || generateJobId(),
        jobNumber,
        customer,
        measurements,
        status: JobStatus.DRAFT,
        pricing,
        measurementsLocked: false, // Jobs start unlocked in DRAFT status
        changeLog: [], // Empty change log for new jobs
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveJob(newJob);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Success',
        'Job saved successfully! Would you like to view the estimate and create a PDF?',
        [
          {
            text: 'Go to Home',
            style: 'cancel',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeMain' }],
              });
            },
          },
          {
            text: 'View Estimate',
            onPress: () => {
              navigation.navigate('EstimatePreview', { job: newJob });
            },
          },
        ]
      );
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to save job. Please try again.');
      console.error('Save job error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!customer) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Customer information is missing</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.customerPhone}>{customer.phone}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Measurements ({measurements.length})</Text>
          </View>

          {/* Category Selection */}
          {showCategorySelection && (
            <View style={styles.categorySelection}>
              <Text style={styles.categoryTitle}>What are you measuring?</Text>
              <Text style={styles.categorySubtitle}>Select the type of product</Text>

              <TouchableOpacity
                style={[styles.categoryCard, { borderColor: '#3B82F6' }]}
                onPress={() => handleCategorySelect('WINDOW')}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIcon, { backgroundColor: '#3B82F6' + '20' }]}>
                  <Text style={[styles.categoryIconText, { color: '#3B82F6' }]}>🪟</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Windows</Text>
                  <Text style={styles.categoryDescription}>
                    Single hung, double hung, slider, casement, etc.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryCard, { borderColor: '#F97316' }]}
                onPress={() => handleCategorySelect('DOOR')}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIcon, { backgroundColor: '#F97316' + '20' }]}>
                  <Text style={[styles.categoryIconText, { color: '#F97316' }]}>🚪</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Doors</Text>
                  <Text style={styles.categoryDescription}>
                    Entry doors, patio doors, etc.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryCard, { borderColor: '#10B981' }]}
                onPress={() => handleCategorySelect('GLASS')}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIcon, { backgroundColor: '#10B981' + '20' }]}>
                  <Text style={[styles.categoryIconText, { color: '#10B981' }]}>◇</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>Glass</Text>
                  <Text style={styles.categoryDescription}>
                    Glass panels, custom installations
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {measurements.map((measurement) => (
            <View key={measurement.id} style={styles.measurementWrapper}>
              <MeasurementCard measurement={measurement} />
              <View style={styles.measurementActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditMeasurement(measurement.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveMeasurement(measurement.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {showForm && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                {editingMeasurementId ? 'Edit Measurement' : 'New Measurement'}
              </Text>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Width (inches) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="24"
                    value={width}
                    onChangeText={setWidth}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                  <Text style={styles.label}>Height (inches) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="36"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* Bluetooth Measurement Button */}
              <TouchableOpacity
                style={styles.bluetoothButton}
                activeOpacity={0.7}
                onPress={() => {
                  // TODO: Backend developer - Read measurement from connected Bluetooth device
                  // Use BluetoothService to read width and height from Bosch GLM or Leica DISTO
                  // Then call: setWidth(measurement.width.toString()); setHeight(measurement.height.toString());
                  Alert.alert(
                    'Bluetooth Device',
                    'This will read measurements from your connected Bosch GLM or Leica DISTO device.\n\nBackend implementation pending.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={styles.bluetoothButtonIcon}>📏</Text>
                <Text style={styles.bluetoothButtonText}>Use Bluetooth Device</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Depth (inches)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Optional"
                    value={depth}
                    onChangeText={setDepth}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                  <Text style={styles.label}>Quantity *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location / Room</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Living Room, Master Bedroom, Kitchen"
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {selectedCategory === 'WINDOW' && 'Window Type *'}
                  {selectedCategory === 'DOOR' && 'Door Type *'}
                  {selectedCategory === 'GLASS' && 'Glass Type *'}
                </Text>
                <View style={styles.chipContainer}>
                  {getProductTypeOptions().map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        productType === type && styles.chipSelected,
                      ]}
                      onPress={() => setProductType(type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          productType === type && styles.chipTextSelected,
                        ]}
                      >
                        {type.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Glass Type * (Select all that apply)</Text>
                <View style={styles.chipContainer}>
                  {Object.values(GlassType).map((type) => {
                    const isSelected = selectedGlassTypes.includes(type);
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.chip,
                          isSelected && styles.chipSelected,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          if (isSelected) {
                            // Remove from selection
                            setSelectedGlassTypes(selectedGlassTypes.filter(t => t !== type));
                          } else {
                            // Add to selection
                            setSelectedGlassTypes([...selectedGlassTypes, type]);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {type.replace(/_/g, ' ')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.helperText}>
                  Example: Double Pane + Double Strength + Neat+
                </Text>
              </View>

              {/* PRICING OPTIONS */}
              <View style={styles.pricingSection}>
                <Text style={styles.pricingSectionTitle}>💰 Pricing Options</Text>

                {/* Pane Count - Only for GLASS category */}
                {selectedCategory === 'GLASS' && (
                  <View style={styles.compactInputGroup}>
                    <Text style={styles.label}>Pane Count *</Text>
                    <View style={styles.chipContainer}>
                      <TouchableOpacity
                        style={[styles.chip, paneCount === 'SINGLE' && styles.chipSelected]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setPaneCount('SINGLE');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.chipText, paneCount === 'SINGLE' && styles.chipTextSelected]}>
                          Single
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.chip, paneCount === 'DOUBLE' && styles.chipSelected]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setPaneCount('DOUBLE');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.chipText, paneCount === 'DOUBLE' && styles.chipTextSelected]}>
                          Double
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.chip, paneCount === 'TRIPLE' && styles.chipSelected]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setPaneCount('TRIPLE');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.chipText, paneCount === 'TRIPLE' && styles.chipTextSelected]}>
                          Triple
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Glass Strength */}
                <View style={styles.compactInputGroup}>
                  <Text style={styles.label}>Glass Strength</Text>
                  <View style={styles.chipContainer}>
                    <TouchableOpacity
                      style={[styles.chip, glassStrength === 'SINGLE' && styles.chipSelected]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setGlassStrength('SINGLE');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, glassStrength === 'SINGLE' && styles.chipTextSelected]}>
                        Single
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.chip, glassStrength === 'DOUBLE' && styles.chipSelected]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setGlassStrength('DOUBLE');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, glassStrength === 'DOUBLE' && styles.chipTextSelected]}>
                        Double
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.chip, glassStrength === 'TRIPLE' && styles.chipSelected]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setGlassStrength('TRIPLE');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, glassStrength === 'TRIPLE' && styles.chipTextSelected]}>
                        Triple
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Glass Options (2-column layout) */}
                <View style={styles.toggleGrid}>
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Laminate</Text>
                    <Switch
                      value={hasLaminate}
                      onValueChange={(value) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setHasLaminate(value);
                      }}
                      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                      thumbColor={hasLaminate ? Colors.primary : Colors.backgroundGray}
                    />
                  </View>
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Tempered</Text>
                    <Switch
                      value={hasTempered}
                      onValueChange={(value) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setHasTempered(value);
                      }}
                      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                      thumbColor={hasTempered ? Colors.primary : Colors.backgroundGray}
                    />
                  </View>
                </View>

                <View style={styles.toggleGrid}>
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Tinted</Text>
                    <Switch
                      value={hasTinted}
                      onValueChange={(value) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setHasTinted(value);
                      }}
                      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                      thumbColor={hasTinted ? Colors.primary : Colors.backgroundGray}
                    />
                  </View>
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Installation</Text>
                    <Switch
                      value={hasInstallation}
                      onValueChange={(value) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setHasInstallation(value);
                      }}
                      trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                      thumbColor={hasInstallation ? Colors.primary : Colors.backgroundGray}
                    />
                  </View>
                </View>

                {/* Grids with Pattern */}
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Grids</Text>
                  <Switch
                    value={hasGrids}
                    onValueChange={(value) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setHasGrids(value);
                      if (!value) setGridPattern('');
                    }}
                    trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                    thumbColor={hasGrids ? Colors.primary : Colors.backgroundGray}
                  />
                </View>
                {hasGrids && (
                  <View style={styles.compactInputGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Grid pattern (e.g., Colonial, Prairie)"
                      value={gridPattern}
                      onChangeText={setGridPattern}
                    />
                  </View>
                )}

                {/* Sidelights for DOORS only */}
                {selectedCategory === 'DOOR' && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.subsectionLabel}>Sidelights</Text>
                    <View style={styles.row}>
                      <View style={[styles.inputGroup, styles.flex1]}>
                        <Text style={styles.label}>Count</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          value={sidelightCount}
                          onChangeText={setSidelightCount}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
                        <Text style={styles.label}>Type</Text>
                        <View style={styles.chipContainer}>
                          <TouchableOpacity
                            style={[styles.chip, sidelightType === 'FULL' && styles.chipSelected]}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setSidelightType('FULL');
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.chipText, sidelightType === 'FULL' && styles.chipTextSelected]}>
                              Full
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.chip, sidelightType === 'HALF' && styles.chipSelected]}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setSidelightType('HALF');
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.chipText, sidelightType === 'HALF' && styles.chipTextSelected]}>
                              Half
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.chip, sidelightType === 'NONE' && styles.chipSelected]}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setSidelightType('NONE');
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.chipText, sidelightType === 'NONE' && styles.chipTextSelected]}>
                              None
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </>
                )}

                {/* Price Preview */}
                <View style={styles.pricePreview}>
                  <Text style={styles.pricePreviewLabel}>Estimated Price:</Text>
                  <Text style={styles.pricePreviewValue}>
                    {/* TODO: Backend developer - Calculate price based on all options */}
                    $0.00
                  </Text>
                </View>

                {/* Custom Price Override */}
                <View style={styles.compactInputGroup}>
                  <Text style={styles.label}>Custom Price Override (optional)</Text>
                  <View style={styles.priceInputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.priceInputField}
                      placeholder="Leave blank for auto-calc"
                      value={customPrice}
                      onChangeText={setCustomPrice}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Frame Type</Text>
                <View style={styles.chipContainer}>
                  <TouchableOpacity
                    style={[styles.chip, !frameType && styles.chipSelected]}
                    onPress={() => setFrameType(undefined)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        !frameType && styles.chipTextSelected,
                      ]}
                    >
                      None
                    </Text>
                  </TouchableOpacity>
                  {Object.values(FrameType).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        frameType === type && styles.chipSelected,
                      ]}
                      onPress={() => setFrameType(type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          frameType === type && styles.chipTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Hinge Placement for Casement windows */}
              {(productType === ProductType.CASEMENT || productType === ProductType.CASEMENT_PICTURE) && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Hinge Placement (viewed from exterior) *</Text>
                  <View style={styles.chipContainer}>
                    <TouchableOpacity
                      style={[
                        styles.chip,
                        hingePlacement === 'LEFT' && styles.chipSelected,
                      ]}
                      onPress={() => setHingePlacement('LEFT')}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          hingePlacement === 'LEFT' && styles.chipTextSelected,
                        ]}
                      >
                        Left Hinge
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.chip,
                        hingePlacement === 'RIGHT' && styles.chipSelected,
                      ]}
                      onPress={() => setHingePlacement('RIGHT')}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          hingePlacement === 'RIGHT' && styles.chipTextSelected,
                        ]}
                      >
                        Right Hinge
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Additional notes..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    resetForm();
                    setShowForm(false);
                    setShowCategorySelection(true);
                    setSelectedCategory(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.addMeasurementButton]}
                  onPress={handleAddMeasurement}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addMeasurementButtonText}>
                    {editingMeasurementId ? 'Update Measurement' : 'Add Measurement'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {measurements.length > 0 && !showForm && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSaveJob}
            disabled={saving}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Job'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Keyboard Dismiss Button */}
      {keyboardVisible && (
        <View style={styles.keyboardDismissContainer}>
          <TouchableOpacity
            style={styles.keyboardDismissButton}
            onPress={() => Keyboard.dismiss()}
            activeOpacity={0.7}
          >
            <Text style={styles.keyboardDismissText}>✓ Done</Text>
          </TouchableOpacity>
        </View>
      )}
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
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
  },
  section: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  measurementWrapper: {
    marginBottom: 12,
  },
  measurementActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.info,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    flex: 1,
    backgroundColor: Colors.error,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    backgroundColor: Colors.backgroundGray,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.background,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  addMeasurementButton: {
    backgroundColor: Colors.success,
    marginLeft: 8,
  },
  addMeasurementButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
  categorySelection: {
    padding: 16,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    marginTop: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categorySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIconText: {
    fontSize: 32,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  cancelCategoryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelCategoryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  bluetoothButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.info,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.info,
  },
  bluetoothButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  bluetoothButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  pricingSection: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
  },
  pricingSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  compactInputGroup: {
    marginBottom: 12,
  },
  toggleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  toggleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  subsectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  pricePreview: {
    backgroundColor: Colors.primaryLight + '20',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  pricePreviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  pricePreviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: Colors.text,
    marginRight: 4,
    fontWeight: '600',
  },
  priceInputField: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 12,
  },
  keyboardDismissContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  keyboardDismissButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardDismissText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MeasurementsScreen;
