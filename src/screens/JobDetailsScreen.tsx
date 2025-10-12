import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MeasurementCard } from '../components';
import { Colors } from '../constants';
import { formatDisplayDate, formatCurrency } from '../utils';
import { useJobStorage } from '../hooks';
import { Job } from '../types';

const JobDetailsScreen = ({ route, navigation }: any) => {
  const { jobId } = route.params;
  const { jobs, deleteJob } = useJobStorage();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundJob = jobs.find((j) => j.id === jobId);
    setJob(foundJob || null);
    setLoading(false);
  }, [jobId, jobs]);

  const handleDeleteJob = () => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJob(jobId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  const statusColor = {
    DRAFT: Colors.draft,
    QUOTED: Colors.quoted,
    APPROVED: Colors.approved,
    IN_PROGRESS: Colors.inProgress,
    COMPLETED: Colors.completed,
    CANCELLED: Colors.cancelled,
  }[job.status] || Colors.text;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
      {/* Job Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.jobNumber}>{job.jobNumber}</Text>
            <Text style={styles.date}>{formatDisplayDate(job.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{job.status}</Text>
          </View>
        </View>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{job.customer.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{job.customer.phone}</Text>
        </View>
        {job.customer.email && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{job.customer.email}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>
            {job.customer.address}, {job.customer.city}, {job.customer.state}{' '}
            {job.customer.zipCode}
          </Text>
        </View>
        {job.customer.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.notes}>{job.customer.notes}</Text>
          </View>
        )}
      </View>

      {/* Measurements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Measurements ({job.measurements.length})
        </Text>
        {job.measurements.map((measurement) => (
          <MeasurementCard key={measurement.id} measurement={measurement} />
        ))}
      </View>

      {/* Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Details</Text>

        {/* Itemized Costs */}
        {job.pricing.itemizedCosts.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemDescription}>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemSubtext}>
                Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
              </Text>
            </View>
            <Text style={styles.itemPrice}>{formatCurrency(item.subtotal)}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(job.pricing.subtotal)}
          </Text>
        </View>

        {job.pricing.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={[styles.totalValue, styles.discount]}>
              -{formatCurrency(job.pricing.discount)}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Tax ({(job.pricing.taxRate * 100).toFixed(1)}%):
          </Text>
          <Text style={styles.totalValue}>{formatCurrency(job.pricing.tax)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>
            {formatCurrency(job.pricing.total)}
          </Text>
        </View>
      </View>

      {/* Job Notes */}
      {job.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Notes</Text>
          <Text style={styles.notes}>{job.notes}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteJob} activeOpacity={0.7}>
          <Text style={styles.deleteButtonText}>Delete Job</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
      </ScrollView>
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
  header: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notes: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundGray,
  },
  itemDescription: {
    flex: 1,
    marginRight: 12,
  },
  itemText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  discount: {
    color: Colors.error,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default JobDetailsScreen;
