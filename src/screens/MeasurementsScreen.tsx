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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { customer, measurements: initialMeasurements = [], jobId } = route.params || {};
  const { saveJob, jobs } = useJobStorage();

  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);
  const [showForm, setShowForm] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(measurements.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<'WINDOW' | 'DOOR' | 'GLASS' | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state for new measurement
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [productType, setProductType] = useState<ProductType>(DEFAULT_MEASUREMENT.productType);
  const [glassType, setGlassType] = useState<GlassType>(DEFAULT_MEASUREMENT.glassType);
  const [frameType, setFrameType] = useState<FrameType | undefined>(undefined);
  const [hingePlacement, setHingePlacement] = useState<'LEFT' | 'RIGHT' | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setWidth('');
    setHeight('');
    setDepth('');
    setQuantity('1');
    setProductType(DEFAULT_MEASUREMENT.productType);
    setGlassType(DEFAULT_MEASUREMENT.glassType);
    setFrameType(undefined);
    setHingePlacement(undefined);
    setNotes('');
  };

  const handleCategorySelect = (category: 'WINDOW' | 'DOOR' | 'GLASS') => {
    setSelectedCategory(category);
    setShowCategorySelection(false);
    setShowForm(true);

    // Set default product type based on category
    if (category === 'WINDOW') {
      setProductType(ProductType.DOUBLE_HUNG);
    } else if (category === 'DOOR') {
      // For now, we'll keep using window types since we don't have door types yet
      setProductType(ProductType.DOUBLE_HUNG);
    } else {
      // GLASS category
      setProductType(ProductType.PICTURE);
    }
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
      Alert.alert('Validation Error', 'Please enter a valid width');
      return;
    }

    if (!height || isNaN(heightNum) || heightNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid height');
      return;
    }

    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity');
      return;
    }

    // Check if tempered glass should be suggested
    const shouldSuggestTempered = checkTemperedGlassRequirement(widthNum, heightNum);
    const isNotTempered = glassType !== GlassType.TEMPERED;

    if (shouldSuggestTempered && isNotTempered) {
      const squareFeet = ((widthNum * heightNum) / 144).toFixed(1);
      Alert.alert(
        'Building Code Notice',
        `This glass is ${squareFeet} sq ft, which is 9 sq ft or larger.\n\nBuilding codes typically require tempered glass for:\n• Glass 9+ sq ft\n• Within 18" of the floor\n• Within 36" of a walkway\n\nWould you like to change this to tempered glass?`,
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
              setGlassType(GlassType.TEMPERED);
              addMeasurement(widthNum, heightNum, quantityNum, GlassType.TEMPERED);
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
    overrideGlassType?: GlassType
  ) => {
    const newMeasurement: Measurement = {
      id: generateMeasurementId(),
      width: widthNum,
      height: heightNum,
      depth: depth ? parseFloat(depth) : undefined,
      quantity: quantityNum,
      productType,
      glassType: overrideGlassType || glassType,
      frameType,
      hingePlacement,
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

  const handleSaveJob = async () => {
    if (!customer) {
      Alert.alert('Error', 'Customer information is missing');
      return;
    }

    if (measurements.length === 0) {
      Alert.alert('Error', 'Please add at least one measurement');
      return;
    }

    try {
      setSaving(true);

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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveJob(newJob);

      Alert.alert('Success', 'Job saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Tabs' }],
            });
          },
        },
      ]);
    } catch (error) {
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
      <ScrollView style={styles.scrollView}>
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
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMeasurement(measurement.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {showForm && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>New Measurement</Text>

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
                <Text style={styles.label}>Glass Type *</Text>
                <View style={styles.chipContainer}>
                  {Object.values(GlassType).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        glassType === type && styles.chipSelected,
                      ]}
                      onPress={() => setGlassType(type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          glassType === type && styles.chipTextSelected,
                        ]}
                      >
                        {type.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
                  <Text style={styles.addMeasurementButtonText}>Add Measurement</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
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
  removeButton: {
    backgroundColor: Colors.error,
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
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
});

export default MeasurementsScreen;
