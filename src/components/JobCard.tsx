import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Job } from '../types';
import { Colors } from '../constants';
import { formatCurrency, formatDisplayDate } from '../utils';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const statusColor = {
    DRAFT: Colors.draft,
    QUOTED: Colors.quoted,
    APPROVED: Colors.approved,
    IN_PROGRESS: Colors.inProgress,
    COMPLETED: Colors.completed,
    CANCELLED: Colors.cancelled,
  }[job.status] || Colors.text;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.jobNumber}>{job.jobNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{job.status}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{job.customer.name}</Text>
      <Text style={styles.customerPhone}>{job.customer.phone}</Text>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDisplayDate(job.createdAt)}</Text>
        <Text style={styles.total}>{formatCurrency(job.pricing.total)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.success,
  },
});
