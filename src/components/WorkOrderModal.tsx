import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';
import { Measurement, Customer } from '../types';

interface WorkOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (workOrderDetails: WorkOrderDetails) => Promise<void>;
  customer: Customer;
  measurements: Measurement[];
  statusType: 'SCHEDULED_FOR_INSTALL' | 'MATERIALS_NEEDED';
}

export interface WorkOrderDetails {
  workOrderNumber: string;
  scopeOfWork: string;
  specialInstructions: string;
  materialsRequired: string;
  estimatedDuration: string;
  installDate?: Date;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  visible,
  onClose,
  onSubmit,
  customer,
  measurements,
  statusType,
}) => {
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [materialsRequired, setMaterialsRequired] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate materials list from measurements
  React.useEffect(() => {
    if (visible && measurements.length > 0 && !materialsRequired) {
      const materialsList = measurements
        .map((m, index) => {
          return `${index + 1}. ${m.productType.replace(/_/g, ' ')} - ${m.width}" x ${m.height}" (Qty: ${m.quantity})${m.glassType ? ` - ${m.glassType.replace(/_/g, ' ')}` : ''}`;
        })
        .join('\n');
      setMaterialsRequired(materialsList);
    }
  }, [visible, measurements]);

  // Auto-populate scope of work summary
  React.useEffect(() => {
    if (visible && measurements.length > 0 && !scopeOfWork) {
      const totalItems = measurements.reduce((sum, m) => sum + m.quantity, 0);
      const summary = `Install ${totalItems} window/door unit(s) at:\n${customer.address}\n${customer.city}, ${customer.state} ${customer.zipCode}\n\nContact: ${customer.name}\nPhone: ${customer.phone}`;
      setScopeOfWork(summary);
    }
  }, [visible, customer, measurements]);

  const handleSubmit = async () => {
    // Validation
    if (!workOrderNumber.trim()) {
      Alert.alert('Required', 'Please enter a work order number.');
      return;
    }

    if (!scopeOfWork.trim()) {
      Alert.alert('Required', 'Please describe the scope of work.');
      return;
    }

    if (!materialsRequired.trim()) {
      Alert.alert('Required', 'Please list the materials required.');
      return;
    }

    if (!estimatedDuration.trim()) {
      Alert.alert('Required', 'Please enter an estimated duration (e.g., "4 hours", "1 day").');
      return;
    }

    setIsSubmitting(true);
    try {
      const workOrderDetails: WorkOrderDetails = {
        workOrderNumber: workOrderNumber.trim(),
        scopeOfWork: scopeOfWork.trim(),
        specialInstructions: specialInstructions.trim(),
        materialsRequired: materialsRequired.trim(),
        estimatedDuration: estimatedDuration.trim(),
      };

      await onSubmit(workOrderDetails);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset form
      setWorkOrderNumber('');
      setScopeOfWork('');
      setSpecialInstructions('');
      setMaterialsRequired('');
      setEstimatedDuration('');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create work order.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Reset form
    setWorkOrderNumber('');
    setScopeOfWork('');
    setSpecialInstructions('');
    setMaterialsRequired('');
    setEstimatedDuration('');
    onClose();
  };

  const getModalTitle = () => {
    if (statusType === 'SCHEDULED_FOR_INSTALL') {
      return 'Create Installation Work Order';
    }
    return 'Create Materials Order';
  };

  const getModalIcon = () => {
    if (statusType === 'SCHEDULED_FOR_INSTALL') {
      return '🔨';
    }
    return '📦';
  };

  const getModalDescription = () => {
    if (statusType === 'SCHEDULED_FOR_INSTALL') {
      return 'Document what needs to be completed for this installation job.';
    }
    return 'Document materials needed for ordering and inventory tracking.';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerIcon}>{getModalIcon()}</Text>
              <Text style={styles.headerTitle}>{getModalTitle()}</Text>
              <Text style={styles.headerDescription}>{getModalDescription()}</Text>
            </View>

            {/* Customer Info Banner */}
            <View style={styles.customerBanner}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerDetails}>{customer.phone}</Text>
              <Text style={styles.customerDetails}>
                {customer.address}, {customer.city}, {customer.state}
              </Text>
            </View>

            {/* Work Order Number */}
            <View style={styles.section}>
              <Text style={styles.label}>Work Order Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., WO-2024-001"
                placeholderTextColor={Colors.textSecondary}
                value={workOrderNumber}
                onChangeText={setWorkOrderNumber}
                autoCapitalize="characters"
              />
              <Text style={styles.helperText}>
                Enter a unique work order number for tracking
              </Text>
            </View>

            {/* Scope of Work */}
            <View style={styles.section}>
              <Text style={styles.label}>Scope of Work *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe what needs to be completed..."
                placeholderTextColor={Colors.textSecondary}
                value={scopeOfWork}
                onChangeText={setScopeOfWork}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Text style={styles.helperText}>
                Detail the work to be performed at the job site
              </Text>
            </View>

            {/* Materials Required */}
            <View style={styles.section}>
              <Text style={styles.label}>Materials Required *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List all materials needed..."
                placeholderTextColor={Colors.textSecondary}
                value={materialsRequired}
                onChangeText={setMaterialsRequired}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
              <Text style={styles.helperText}>
                List all windows, doors, glass, and supplies needed
              </Text>
            </View>

            {/* Estimated Duration */}
            <View style={styles.section}>
              <Text style={styles.label}>Estimated Duration *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 4 hours, 1 day, 2 days"
                placeholderTextColor={Colors.textSecondary}
                value={estimatedDuration}
                onChangeText={setEstimatedDuration}
              />
              <Text style={styles.helperText}>
                How long will this job take to complete?
              </Text>
            </View>

            {/* Special Instructions */}
            <View style={styles.section}>
              <Text style={styles.label}>Special Instructions (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special notes, access instructions, safety concerns, etc."
                placeholderTextColor={Colors.textSecondary}
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.helperText}>
                Include access codes, parking info, safety requirements, etc.
              </Text>
            </View>

            {/* Summary Banner */}
            <View style={styles.summaryBanner}>
              <Text style={styles.summaryIcon}>📋</Text>
              <Text style={styles.summaryText}>
                This work order will be attached to the job and available for field reference.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!workOrderNumber || !scopeOfWork || !materialsRequired || !estimatedDuration || isSubmitting) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!workOrderNumber || !scopeOfWork || !materialsRequired || !estimatedDuration || isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Creating...' : 'Create Work Order'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  customerBanner: {
    backgroundColor: Colors.primaryLight + '15',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  customerDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  summaryBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.border,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
