import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants';

interface LockIndicatorProps {
  isLocked: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const LockIndicator: React.FC<LockIndicatorProps> = ({
  isLocked,
  size = 'medium',
  showLabel = false,
}) => {
  if (!isLocked) {
    return null;
  }

  const sizeStyles = {
    small: {
      iconSize: 16,
      labelSize: 10,
      padding: 4,
    },
    medium: {
      iconSize: 20,
      labelSize: 12,
      padding: 6,
    },
    large: {
      iconSize: 24,
      labelSize: 14,
      padding: 8,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, { padding: currentSize.padding }]}>
      <Text style={[styles.lockIcon, { fontSize: currentSize.iconSize }]}>🔒</Text>
      {showLabel && (
        <Text style={[styles.lockLabel, { fontSize: currentSize.labelSize }]}>
          Locked
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: 6,
  },
  lockIcon: {
    lineHeight: 20,
  },
  lockLabel: {
    marginLeft: 4,
    fontWeight: '600',
    color: Colors.warning,
  },
});
