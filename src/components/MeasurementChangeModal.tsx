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
import { ChangeReason } from '../types';

interface MeasurementChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ChangeReason, notes: string) => Promise<void>;
  measurementDescription: string; // e.g., "Double Hung Window 30x40"
}

export const MeasurementChangeModal: React.FC<MeasurementChangeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  measurementDescription,
}) => {
  const [selectedReason, setSelectedReason] = useState<ChangeReason | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons: { value: ChangeReason; label: string; icon: string }[] = [
    {
      value: ChangeReason.MISTAKE,
      label: 'I made a mistake',
      icon: '❌',
    },
    {
      value: ChangeReason.CUSTOMER_LAYOUT_CHANGE,
      label: 'Customer changed window layout',
      icon: '🏠',
    },
    {
      value: ChangeReason.INSTALLER_CORRECTION,
      label: 'Installer corrected measurements',
      icon: '🔧',
    },
    {
      value: ChangeReason.CUSTOMER_ADDED_WINDOWS,
      label: 'Customer added windows',
      icon: '➕',
    },
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Required', 'Please select a reason for this change.');
      return;
    }

    if (notes.trim().length === 0) {
      Alert.alert('Required', 'Please provide additional details about this change.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedReason, notes);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset state
      setSelectedReason(null);
      setNotes('');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit change request.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReason(null);
    setNotes('');
    onClose();
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
              <Text style={styles.headerIcon}>⚠️</Text>
              <Text style={styles.headerTitle}>Measurement Change Request</Text>
            </View>

            {/* Warning Message */}
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This measurement is locked. Changing it requires approval.
              </Text>
              <Text style={styles.measurementText}>
                {measurementDescription}
              </Text>
            </View>

            {/* Reason Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why are you changing this measurement? *</Text>
              {reasons.map((reason) => (
                <TouchableOpacity
                  key={reason.value}
                  style={[
                    styles.reasonOption,
                    selectedReason === reason.value && styles.reasonOptionSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedReason(reason.value);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.reasonIcon}>{reason.icon}</Text>
                  <Text
                    style={[
                      styles.reasonLabel,
                      selectedReason === reason.value && styles.reasonLabelSelected,
                    ]}
                  >
                    {reason.label}
                  </Text>
                  {selectedReason === reason.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}

              {/* Special Notice for Installer Correction */}
              {selectedReason === ChangeReason.INSTALLER_CORRECTION && (
                <View style={styles.installerNotice}>
                  <Text style={styles.installerNoticeIcon}>📋</Text>
                  <Text style={styles.installerNoticeText}>
                    The installer will be notified and must approve this change.
                  </Text>
                </View>
              )}
            </View>

            {/* Additional Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Details *</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Please provide more context about this change..."
                placeholderTextColor={Colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Approval Notice */}
            <View style={styles.approvalNotice}>
              <Text style={styles.approvalNoticeIcon}>👤</Text>
              <Text style={styles.approvalNoticeText}>
                An admin must approve this change before it takes effect.
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
                  (!selectedReason || notes.trim().length === 0 || isSubmitting) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!selectedReason || notes.trim().length === 0 || isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Change Request'}
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
    maxWidth: 500,
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
  },
  warningBox: {
    backgroundColor: Colors.error + '10',
    borderColor: Colors.error,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 15,
    color: Colors.error,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  measurementText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  reasonOptionSelected: {
    backgroundColor: Colors.primaryLight + '20',
    borderColor: Colors.primary,
  },
  reasonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reasonLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  reasonLabelSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  installerNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight + '15',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  installerNoticeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  installerNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    minHeight: 100,
  },
  approvalNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  approvalNoticeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  approvalNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
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
