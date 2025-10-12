import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';
import { Customer } from '../types';
import { generateCustomerId } from '../utils';

const NewJobScreen = ({ navigation, route }: any) => {
  const { measurements = [], jobData = null } = route.params || {};

  const [customerData, setCustomerData] = useState<Partial<Customer>>({
    name: jobData?.customer?.name || '',
    phone: jobData?.customer?.phone || '',
    email: jobData?.customer?.email || '',
    address: jobData?.customer?.address || '',
    city: jobData?.customer?.city || '',
    state: jobData?.customer?.state || '',
    zipCode: jobData?.customer?.zipCode || '',
    notes: jobData?.customer?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customerData.name?.trim()) {
      newErrors.name = 'Customer name is required';
    }
    if (!customerData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!customerData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!customerData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!customerData.state?.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToMeasurements = () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const customer: Customer = {
      id: jobData?.customer?.id || generateCustomerId(),
      name: customerData.name!,
      phone: customerData.phone!,
      email: customerData.email,
      address: customerData.address!,
      city: customerData.city!,
      state: customerData.state!,
      zipCode: customerData.zipCode || '',
      notes: customerData.notes,
      createdAt: jobData?.customer?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    navigation.navigate('Measurements', {
      customer,
      measurements,
      jobId: jobData?.id,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="John Doe"
            value={customerData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Phone <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="(555) 123-4567"
            value={customerData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            value={customerData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            placeholder="123 Main Street"
            value={customerData.address}
            onChangeText={(value) => handleInputChange('address', value)}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1]}>
            <Text style={styles.label}>
              City <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="New York"
              value={customerData.city}
              onChangeText={(value) => handleInputChange('city', value)}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
            <Text style={styles.label}>
              State <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.state && styles.inputError]}
              placeholder="NY"
              value={customerData.state}
              onChangeText={(value) => handleInputChange('state', value)}
              maxLength={2}
              autoCapitalize="characters"
            />
            {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            placeholder="10001"
            value={customerData.zipCode}
            onChangeText={(value) => handleInputChange('zipCode', value)}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional customer notes..."
            value={customerData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinueToMeasurements}
        activeOpacity={0.7}
      >
        <Text style={styles.continueButtonText}>
          Continue to Measurements
        </Text>
      </TouchableOpacity>

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
  scrollView: {
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
    marginBottom: 20,
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
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
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
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
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
  continueButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default NewJobScreen;
