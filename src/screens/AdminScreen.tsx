import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../constants';
import { useJobStorage } from '../hooks';
import { formatCurrency } from '../utils';

const AdminScreen = ({ navigation }: any) => {
  const { jobs } = useJobStorage();

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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Business Overview & Analytics</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: Colors.primary + '15' }]}>
            <Text style={[styles.metricValue, { color: Colors.primary }]}>
              {stats.totalJobs}
            </Text>
            <Text style={styles.metricLabel}>Total Jobs</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: Colors.success + '15' }]}>
            <Text style={[styles.metricValue, { color: Colors.success }]}>
              {formatCurrency(stats.totalRevenue)}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: Colors.accent + '15' }]}>
            <Text style={[styles.metricValue, { color: Colors.accent }]}>
              {formatCurrency(stats.avgJobValue)}
            </Text>
            <Text style={styles.metricLabel}>Avg Job Value</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: Colors.info + '15' }]}>
            <Text style={[styles.metricValue, { color: Colors.info }]}>
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
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    {
                      DRAFT: Colors.draft,
                      QUOTED: Colors.quoted,
                      APPROVED: Colors.approved,
                      IN_PROGRESS: Colors.inProgress,
                      COMPLETED: Colors.completed,
                      CANCELLED: Colors.cancelled,
                    }[status] || Colors.text,
                },
              ]}
            />
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
          .map(([type, count]) => (
            <View key={type} style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{type.replace('_', ' ')}</Text>
                <Text style={styles.progressValue}>{count} units</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(
                        (count /
                          Math.max(
                            ...Object.values(stats.productTypeCounts)
                          )) *
                          100,
                        100
                      )}%`,
                      backgroundColor: Colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

        {Object.keys(stats.productTypeCounts).length === 0 && (
          <Text style={styles.emptyText}>No product data yet</Text>
        )}
      </View>

      {/* Glass Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Glass Types</Text>

        {Object.entries(stats.glassTypeCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([type, count]) => (
            <View key={type} style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{type.replace('_', ' ')}</Text>
                <Text style={styles.progressValue}>{count} units</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(
                        (count /
                          Math.max(...Object.values(stats.glassTypeCounts))) *
                          100,
                        100
                      )}%`,
                      backgroundColor: Colors.success,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

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

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Export Financial Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Generate Monthly Summary</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View All Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
            App Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
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
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
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
