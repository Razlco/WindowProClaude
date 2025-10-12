import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants';
import { useJobStorage } from '../hooks';
import { formatCurrency } from '../utils';
import { DashboardSkeleton, SkeletonLoader } from '../components/shared';

const AdminScreen = ({ navigation }: any) => {
  const { jobs } = useJobStorage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to show skeleton briefly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalRevenue = jobs.reduce((sum, job) => sum + job.pricing.total, 0);
    const avgJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

    const statusCounts = jobs.reduce(
      (acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const productTypeCounts = jobs.reduce(
      (acc, job) => {
        job.measurements.forEach((m) => {
          acc[m.productType] = (acc[m.productType] || 0) + m.quantity;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const glassTypeCounts = jobs.reduce(
      (acc, job) => {
        job.measurements.forEach((m) => {
          if (m.glassType) {
            acc[m.glassType] = (acc[m.glassType] || 0) + m.quantity;
          }
        });
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalJobs,
      totalRevenue,
      avgJobValue,
      statusCounts,
      productTypeCounts,
      glassTypeCounts,
    };
  }, [jobs]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
      {loading ? (
        <>
          {/* Header Skeleton */}
          <View style={styles.header}>
            <SkeletonLoader width={150} height={28} borderRadius={4} style={{ marginBottom: 4 }} />
            <SkeletonLoader width={200} height={14} borderRadius={4} />
          </View>
          <DashboardSkeleton />
        </>
      ) : (
        <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Business Overview & Analytics</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCardPrimary}>
            <Text style={styles.metricValuePrimary}>
              {stats.totalJobs}
            </Text>
            <Text style={styles.metricLabel}>Total Jobs</Text>
          </View>

          <View style={styles.metricCardSuccess}>
            <Text style={styles.metricValueSuccess}>
              {formatCurrency(stats.totalRevenue)}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>

          <View style={styles.metricCardAccent}>
            <Text style={styles.metricValueAccent}>
              {formatCurrency(stats.avgJobValue)}
            </Text>
            <Text style={styles.metricLabel}>Avg Job Value</Text>
          </View>

          <View style={styles.metricCardInfo}>
            <Text style={styles.metricValueInfo}>
              {stats.statusCounts['COMPLETED'] || 0}
            </Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Job Status Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Status Breakdown</Text>

        {Object.entries(stats.statusCounts).map(([status, count]) => (
          <View key={status} style={styles.statsRow}>
            <View style={(styles as any)[`statusDot${status.replace(/_/g, '')}`] || styles.statusDot} />
            <Text style={styles.statsLabel}>{status.replace('_', ' ')}</Text>
            <Text style={styles.statsValue}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Product Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Types</Text>

        {Object.entries(stats.productTypeCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([type, count]) => {
            const percentage = Math.min(
              (count / Math.max(...Object.values(stats.productTypeCounts))) * 100,
              100
            );
            return (
              <View key={type} style={styles.progressRow}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>{type.replace('_', ' ')}</Text>
                  <Text style={styles.progressValue}>{count} units</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarPrimary, { width: `${percentage}%` }]} />
                </View>
              </View>
            );
          })}

        {Object.keys(stats.productTypeCounts).length === 0 && (
          <Text style={styles.emptyText}>No product data yet</Text>
        )}
      </View>

      {/* Glass Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Glass Types</Text>

        {Object.entries(stats.glassTypeCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([type, count]) => {
            const percentage = Math.min(
              (count / Math.max(...Object.values(stats.glassTypeCounts))) * 100,
              100
            );
            return (
              <View key={type} style={styles.progressRow}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>{type.replace('_', ' ')}</Text>
                  <Text style={styles.progressValue}>{count} units</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarSuccess, { width: `${percentage}%` }]} />
                </View>
              </View>
            );
          })}

        {Object.keys(stats.glassTypeCounts).length === 0 && (
          <Text style={styles.emptyText}>No glass data yet</Text>
        )}
      </View>

      {/* Recent Jobs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Jobs</Text>

        {jobs.slice(0, 5).map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobRow}
            onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            activeOpacity={0.7}
          >
            <View style={styles.jobInfo}>
              <Text style={styles.jobNumber}>{job.jobNumber}</Text>
              <Text style={styles.customerName}>{job.customer.name}</Text>
            </View>
            <Text style={styles.jobAmount}>{formatCurrency(job.pricing.total)}</Text>
          </TouchableOpacity>
        ))}

        {jobs.length === 0 && (
          <Text style={styles.emptyText}>No jobs created yet</Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Export Financial Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>Generate Monthly Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>View All Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
            App Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
        </>
      )}
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
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.background,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.9,
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
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricCard: {
    width: '50%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
  },
  metricCardPrimary: {
    width: '50%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
    backgroundColor: Colors.primary + '15',
  },
  metricCardSuccess: {
    width: '50%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
    backgroundColor: Colors.success + '15',
  },
  metricCardAccent: {
    width: '50%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
    backgroundColor: Colors.accent + '15',
  },
  metricCardInfo: {
    width: '50%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
    backgroundColor: Colors.info + '15',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricValuePrimary: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary,
  },
  metricValueSuccess: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.success,
  },
  metricValueAccent: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.accent,
  },
  metricValueInfo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.info,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusDotDRAFT: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.draft,
  },
  statusDotQUOTED: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.quoted,
  },
  statusDotAPPROVED: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.approved,
  },
  statusDotINPROGRESS: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.inProgress,
  },
  statusDotCOMPLETED: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.completed,
  },
  statusDotCANCELLED: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.cancelled,
  },
  statsLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarPrimary: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  progressBarSuccess: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  jobInfo: {
    flex: 1,
  },
  jobNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  jobAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.success,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: Colors.text,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AdminScreen;
