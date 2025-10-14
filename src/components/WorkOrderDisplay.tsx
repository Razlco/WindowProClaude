import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';
import { Job } from '../types';

interface WorkOrderDisplayProps {
  job: Job;
  onEdit?: () => void;
}

export const WorkOrderDisplay: React.FC<WorkOrderDisplayProps> = ({ job, onEdit }) => {
  if (!job.workOrderNumber) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Work Order</Text>
          <Text style={styles.workOrderNumber}>#{job.workOrderNumber}</Text>
        </View>
        {onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onEdit();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoBox}>
            <Text style={styles.customerName}>{job.customer.name}</Text>
            <Text style={styles.infoText}>{job.customer.phone}</Text>
            <Text style={styles.infoText}>
              {job.customer.address}
              {'\n'}
              {job.customer.city}, {job.customer.state} {job.customer.zipCode}
            </Text>
            {job.customer.email && (
              <Text style={styles.infoText}>{job.customer.email}</Text>
            )}
          </View>
        </View>

        {/* Estimated Duration */}
        {job.workOrderEstimatedDuration && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Duration</Text>
            <View style={styles.durationBox}>
              <Text style={styles.durationIcon}>⏱️</Text>
              <Text style={styles.durationText}>{job.workOrderEstimatedDuration}</Text>
            </View>
          </View>
        )}

        {/* Scope of Work */}
        {job.workOrderScopeOfWork && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scope of Work</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{job.workOrderScopeOfWork}</Text>
            </View>
          </View>
        )}

        {/* Materials Required */}
        {job.workOrderMaterialsRequired && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Materials Required</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{job.workOrderMaterialsRequired}</Text>
            </View>
          </View>
        )}

        {/* Special Instructions */}
        {job.workOrderSpecialInstructions && (
          <View style={styles.section}>
            <View style={styles.specialHeader}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <Text style={styles.specialIcon}>⚠️</Text>
            </View>
            <View style={styles.specialBox}>
              <Text style={styles.contentText}>{job.workOrderSpecialInstructions}</Text>
            </View>
          </View>
        )}

        {/* Install Date (if scheduled) */}
        {job.installDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scheduled Installation</Text>
            <View style={styles.dateBox}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.dateText}>
                {new Date(job.installDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}

        {/* Job Number Reference */}
        <View style={styles.referenceBox}>
          <Text style={styles.referenceLabel}>Job Number:</Text>
          <Text style={styles.referenceValue}>{job.jobNumber}</Text>
        </View>
      </ScrollView>
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
    padding: 16,
    backgroundColor: Colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryDark,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
    marginBottom: 4,
  },
  workOrderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.background,
  },
  editButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '15',
    borderRadius: 8,
    padding: 12,
  },
  durationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  contentBox: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 12,
  },
  contentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  specialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specialIcon: {
    fontSize: 20,
  },
  specialBox: {
    backgroundColor: Colors.warning + '15',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    borderRadius: 8,
    padding: 12,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    borderRadius: 8,
    padding: 12,
  },
  dateIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  referenceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundGray,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
  },
  referenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  referenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
