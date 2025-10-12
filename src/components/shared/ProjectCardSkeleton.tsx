import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants';
import SkeletonLoader from './SkeletonLoader';

interface ProjectCardSkeletonProps {
  viewMode: 'compact' | 'detailed';
}

const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = ({ viewMode }) => {
  if (viewMode === 'compact') {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactRow}>
          <View style={styles.compactLeft}>
            <SkeletonLoader width={80} height={16} borderRadius={4} />
            <SkeletonLoader width={120} height={20} borderRadius={4} style={styles.marginTop4} />
          </View>
          <View style={styles.compactRight}>
            <SkeletonLoader width={60} height={20} borderRadius={12} />
          </View>
        </View>

        <View style={styles.compactFooter}>
          <SkeletonLoader width={100} height={14} borderRadius={4} />
          <SkeletonLoader width={80} height={14} borderRadius={4} />
        </View>
      </View>
    );
  }

  // Detailed view
  return (
    <View style={styles.detailedCard}>
      <View style={styles.detailedHeader}>
        <SkeletonLoader width={100} height={18} borderRadius={4} />
        <SkeletonLoader width={70} height={24} borderRadius={12} />
      </View>

      <SkeletonLoader width="100%" height={1} style={styles.marginVertical8} />

      <SkeletonLoader width={150} height={22} borderRadius={4} style={styles.marginBottom8} />
      <SkeletonLoader width="90%" height={16} borderRadius={4} style={styles.marginBottom4} />
      <SkeletonLoader width="70%" height={16} borderRadius={4} style={styles.marginBottom4} />
      <SkeletonLoader width="60%" height={16} borderRadius={4} />

      <View style={styles.detailedFooter}>
        <SkeletonLoader width={100} height={14} borderRadius={4} />
        <SkeletonLoader width={110} height={32} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  compactCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  compactLeft: {
    flex: 1,
  },
  compactRight: {
    marginLeft: 12,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailedCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  marginTop4: {
    marginTop: 4,
  },
  marginBottom4: {
    marginBottom: 4,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  marginVertical8: {
    marginVertical: 8,
  },
});

export default ProjectCardSkeleton;
