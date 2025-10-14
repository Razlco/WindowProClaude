import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';
import { MeasurementChangeLog as ChangeLogType, ChangeReason } from '../types';

interface MeasurementChangeLogProps {
  changeLog: ChangeLogType[];
  onViewChange?: (change: ChangeLogType) => void;
}

export const MeasurementChangeLog: React.FC<MeasurementChangeLogProps> = ({
  changeLog,
  onViewChange,
}) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return Colors.success;
      case 'REJECTED':
        return Colors.error;
      case 'PENDING':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '✅';
      case 'REJECTED':
        return '❌';
      case 'PENDING':
        return '⏳';
      default:
        return '📋';
    }
  };

  const renderChangeLogItem = ({ item }: { item: ChangeLogType }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={styles.logItem}
        onPress={() => {
          if (onViewChange) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onViewChange(item);
          }
        }}
        activeOpacity={onViewChange ? 0.7 : 1}
        disabled={!onViewChange}
      >
        {/* Header */}
        <View style={styles.logHeader}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.logDate}>{formatDate(item.changedAt)}</Text>
        </View>

        {/* Change Details */}
        <View style={styles.logBody}>
          <View style={styles.reasonRow}>
            <Text style={styles.reasonIcon}>{getReasonIcon(item.reason)}</Text>
            <Text style={styles.reasonText}>{item.reason}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userLabel}>Changed by:</Text>
            <Text style={styles.userName}>{item.changedByName}</Text>
          </View>

          {item.reasonNotes && (
            <View style={styles.notesPreview}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText} numberOfLines={2}>
                {item.reasonNotes}
              </Text>
            </View>
          )}

          {/* Measurement Preview */}
          <View style={styles.measurementPreview}>
            <Text style={styles.measurementPreviewLabel}>
              {item.previousValue.width}" × {item.previousValue.height}"
            </Text>
            <Text style={styles.arrowSmall}>→</Text>
            <Text style={[styles.measurementPreviewLabel, styles.measurementNew]}>
              {item.newValue.width}" × {item.newValue.height}"
            </Text>
          </View>

          {/* Approval Info */}
          {item.status === 'APPROVED' && item.approvedBy && (
            <View style={styles.approvalInfo}>
              <Text style={styles.approvalText}>
                Approved by {item.approvedByName}
              </Text>
              {item.installerApprovalRequired && item.installerApprovedBy && (
                <Text style={styles.approvalText}>
                  Installer: {item.installerApprovedByName}
                </Text>
              )}
            </View>
          )}

          {/* Pending Installer Approval */}
          {item.status === 'PENDING' &&
            item.installerApprovalRequired &&
            !item.installerApprovedBy && (
              <View style={styles.pendingNotice}>
                <Text style={styles.pendingText}>⏳ Awaiting installer approval</Text>
              </View>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  if (changeLog.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>No measurement changes yet</Text>
        <Text style={styles.emptySubtext}>
          Changes to locked measurements will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Change History</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{changeLog.length}</Text>
        </View>
      </View>

      <FlatList
        data={changeLog}
        renderItem={renderChangeLogItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  list: {
    flex: 1,
  },
  logItem: {
    backgroundColor: Colors.background,
    padding: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  logDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  logBody: {
    gap: 8,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '15',
    borderRadius: 8,
    padding: 12,
  },
  reasonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginRight: 6,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  notesPreview: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  measurementPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 12,
  },
  measurementPreviewLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  measurementNew: {
    color: Colors.primary,
  },
  arrowSmall: {
    fontSize: 18,
    color: Colors.primary,
    marginHorizontal: 8,
  },
  approvalInfo: {
    backgroundColor: Colors.success + '15',
    borderRadius: 8,
    padding: 10,
  },
  approvalText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success,
  },
  pendingNotice: {
    backgroundColor: Colors.warning + '15',
    borderRadius: 8,
    padding: 10,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.warning,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
