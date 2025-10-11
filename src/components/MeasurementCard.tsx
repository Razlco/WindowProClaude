import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Measurement } from '../types';
import { Colors } from '../constants';
import { formatDimensions } from '../utils';

interface MeasurementCardProps {
  measurement: Measurement;
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{measurement.productType}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Dimensions:</Text>
        <Text style={styles.value}>
          {formatDimensions(measurement.width, measurement.height, measurement.depth)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Glass:</Text>
        <Text style={styles.value}>{measurement.glassType || 'N/A'}</Text>
      </View>

      {measurement.frameType && (
        <View style={styles.row}>
          <Text style={styles.label}>Frame:</Text>
          <Text style={styles.value}>{measurement.frameType}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Quantity:</Text>
        <Text style={styles.value}>{measurement.quantity}</Text>
      </View>

      {measurement.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.notes}>{measurement.notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notes: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
  },
});
