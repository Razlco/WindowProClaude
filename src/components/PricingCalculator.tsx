import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JobPricing } from '../types';
import { Colors } from '../constants';
import { formatCurrency } from '../utils';

interface PricingCalculatorProps {
  pricing: JobPricing;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ pricing }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pricing Summary</Text>

      {pricing.itemizedCosts.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemQuantity}>
              {item.quantity} x {formatCurrency(item.unitPrice)}
            </Text>
          </View>
          <Text style={styles.itemPrice}>{formatCurrency(item.subtotal)}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal:</Text>
        <Text style={styles.value}>{formatCurrency(pricing.subtotal)}</Text>
      </View>

      {pricing.discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Discount:</Text>
          <Text style={[styles.value, styles.discount]}>
            -{formatCurrency(pricing.discount)}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Tax ({(pricing.taxRate * 100).toFixed(1)}%):</Text>
        <Text style={styles.value}>{formatCurrency(pricing.tax)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{formatCurrency(pricing.total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  itemQuantity: {
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  discount: {
    color: Colors.success,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
  },
});
