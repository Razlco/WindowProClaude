import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants';
import SkeletonLoader from './SkeletonLoader';

const LeadCardSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonLoader width={150} height={18} borderRadius={4} />
        <SkeletonLoader width={80} height={24} borderRadius={12} />
      </View>

      {/* Details */}
      <SkeletonLoader width="90%" height={14} borderRadius={4} style={styles.marginBottom4} />
      <SkeletonLoader width="70%" height={14} borderRadius={4} style={styles.marginBottom4} />
      <SkeletonLoader width="80%" height={14} borderRadius={4} style={styles.marginBottom4} />
      <SkeletonLoader width="85%" height={14} borderRadius={4} style={styles.marginBottom8} />

      {/* Date */}
      <SkeletonLoader width={120} height={12} borderRadius={4} style={styles.marginTop8} />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <SkeletonLoader width={90} height={32} borderRadius={6} />
        <SkeletonLoader width={120} height={32} borderRadius={6} />
        <SkeletonLoader width={70} height={32} borderRadius={6} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  marginBottom4: {
    marginBottom: 4,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  marginTop8: {
    marginTop: 8,
  },
});

export default LeadCardSkeleton;
