import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants';
import SkeletonLoader from './SkeletonLoader';

const DashboardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Metric Cards Grid */}
      <View style={styles.metricsGrid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.metricCard}>
            <SkeletonLoader width={60} height={28} borderRadius={4} style={styles.marginBottom4} />
            <SkeletonLoader width="80%" height={14} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Section with rows */}
      <View style={styles.section}>
        <SkeletonLoader width={150} height={18} borderRadius={4} style={styles.marginBottom16} />
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.row}>
            <SkeletonLoader width={12} height={12} borderRadius={6} />
            <SkeletonLoader width={100} height={14} borderRadius={4} style={styles.rowLabel} />
            <SkeletonLoader width={40} height={16} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Progress Bars Section */}
      <View style={styles.section}>
        <SkeletonLoader width={120} height={18} borderRadius={4} style={styles.marginBottom16} />
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.progressRow}>
            <View style={styles.progressHeader}>
              <SkeletonLoader width={100} height={14} borderRadius={4} />
              <SkeletonLoader width={60} height={14} borderRadius={4} />
            </View>
            <SkeletonLoader width="100%" height={8} borderRadius={4} style={styles.marginTop8} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 12,
  },
  metricCard: {
    width: '50%',
    padding: 16,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 6,
  },
  section: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    flex: 1,
    marginLeft: 12,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  marginBottom4: {
    marginBottom: 4,
  },
  marginBottom16: {
    marginBottom: 16,
  },
  marginTop8: {
    marginTop: 8,
  },
});

export default DashboardSkeleton;
