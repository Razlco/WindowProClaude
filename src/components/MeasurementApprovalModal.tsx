import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';
import { MeasurementChangeLog, ChangeReason } from '../types';

interface MeasurementApprovalModalProps {
  visible: boolean;
  onClose: () => void;
  changeLog: MeasurementChangeLog;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}

export const MeasurementApprovalModal: React.FC<MeasurementApprovalModalProps> = ({
  visible,
  onClose,
  changeLog,
  onApprove,
  onReject,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Approved', 'Measurement change has been approved.');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to approve change.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject Change',
      'Are you sure you want to reject this measurement change? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              await onReject();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Rejected', 'Measurement change has been rejected.');
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to reject change.');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getReasonIcon = (reason: ChangeReason) => {
    switch (reason) {
      case ChangeReason.MISTAKE:
        return '❌';
      case ChangeReason.CUSTOMER_LAYOUT_CHANGE:
        return '🏠';
      case ChangeReason.INSTALLER_CORRECTION:
        return '🔧';
      case ChangeReason.CUSTOMER_ADDED_WINDOWS:
        return '➕';
      default:
        return '📝';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerIcon}>🔍</Text>
              <Text style={styles.headerTitle}>Approve Measurement Change</Text>
            </View>

            {/* Change Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Changed By:</Text>
                <Text style={styles.infoValue}>{changeLog.changedByName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date:</Text>
                <Text style={styles.infoValue}>{formatDate(changeLog.changedAt)}</Text>
              </View>
            </View>

            {/* Reason */}
            <View style={styles.reasonSection}>
              <Text style={styles.sectionTitle}>Reason for Change</Text>
              <View style={styles.reasonBox}>
                <Text style={styles.reasonIcon}>{getReasonIcon(changeLog.reason)}</Text>
                <Text style={styles.reasonText}>{changeLog.reason}</Text>
              </View>
            </View>

            {/* Additional Notes */}
            {changeLog.reasonNotes && (
              <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Additional Details</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{changeLog.reasonNotes}</Text>
                </View>
              </View>
            )}

            {/* Installer Approval Required Notice */}
            {changeLog.installerApprovalRequired && (
              <View style={styles.installerNotice}>
                <Text style={styles.installerNoticeIcon}>🔧</Text>
                <Text style={styles.installerNoticeText}>
                  {changeLog.installerApprovedBy
                    ? `Installer approved by ${changeLog.installerApprovedByName} on ${formatDate(
                        changeLog.installerApprovedAt!
                      )}`
                    : 'Installer approval is required. The installer will be notified after your approval.'}
                </Text>
              </View>
            )}

            {/* Measurement Comparison */}
            <View style={styles.comparisonSection}>
              <Text style={styles.sectionTitle}>Measurement Changes</Text>

              <View style={styles.comparisonRow}>
                <View style={styles.comparisonColumn}>
                  <Text style={styles.comparisonHeader}>Previous</Text>
                  <View style={styles.measurementBox}>
                    <Text style={styles.measurementLabel}>Width:</Text>
                    <Text style={styles.measurementValue}>
                      {changeLog.previousValue.width}"
                    </Text>
                  </View>
                  <View style={styles.measurementBox}>
                    <Text style={styles.measurementLabel}>Height:</Text>
                    <Text style={styles.measurementValue}>
                      {changeLog.previousValue.height}"
                    </Text>
                  </View>
                  <View style={styles.measurementBox}>
                    <Text style={styles.measurementLabel}>Type:</Text>
                    <Text style={styles.measurementValue}>
                      {changeLog.previousValue.productType}
                    </Text>
                  </View>
                </View>

                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>

                <View style={styles.comparisonColumn}>
                  <Text style={styles.comparisonHeader}>New</Text>
                  <View style={styles.measurementBox}>
                    <Text style={styles.measurementLabel}>Width:</Text>
                    <Text style={[styles.measurementValue, styles.measurementValueNew]}>
                      {changeLog.newValue.width}"
                    </Text>
                  </View>
                  <View style={styles.measurementBox}>
                    <Text style={styles.measurementLabel}>Height:</Text>
                    <Text style={[styles.measurementValue, styles.measurementValueNew]}>
                      {changeLog.newValue.height}"
                    </Text>
                  </View>
                  <View style={styles.measurementBox}>
                    <Text style={styles.measurementLabel}>Type:</Text>
                    <Text style={[styles.measurementValue, styles.measurementValueNew]}>
                      {changeLog.newValue.productType}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleReject}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <Text style={styles.rejectButtonText}>
                  {isProcessing ? 'Processing...' : 'Reject'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.approveButton}
                onPress={handleApprove}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <Text style={styles.approveButtonText}>
                  {isProcessing ? 'Processing...' : 'Approve Change'}
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
  infoSection: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  reasonSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
  },
  reasonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  notesSection: {
    marginBottom: 16,
  },
  notesBox: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 16,
  },
  notesText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  installerNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight + '15',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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
  comparisonSection: {
    marginBottom: 24,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  measurementBox: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  measurementLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  measurementValueNew: {
    color: Colors.primary,
  },
  arrowContainer: {
    paddingHorizontal: 12,
  },
  arrow: {
    fontSize: 32,
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Colors.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  approveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
