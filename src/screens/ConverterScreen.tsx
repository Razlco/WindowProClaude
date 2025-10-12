import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Colors } from '../constants';

const ConverterScreen = ({ navigation }: any) => {
  // Fraction to Decimal
  const [wholeNumber, setWholeNumber] = useState('');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [decimalResult, setDecimalResult] = useState<string | null>(null);

  // Decimal to Fraction
  const [decimalInput, setDecimalInput] = useState('');
  const [fractionResult, setFractionResult] = useState<string | null>(null);

  // MM to Fraction
  const [mmInput, setMmInput] = useState('');
  const [mmToFractionResult, setMmToFractionResult] = useState<string | null>(null);
  const [mmToInchesResult, setMmToInchesResult] = useState<string | null>(null);

  // Convert fraction to decimal
  useEffect(() => {
    const whole = parseFloat(wholeNumber) || 0;
    const num = parseFloat(numerator);
    const den = parseFloat(denominator);

    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      const result = whole + (num / den);
      setDecimalResult(result.toFixed(6).replace(/\.?0+$/, ''));
    } else if (wholeNumber && !numerator && !denominator) {
      setDecimalResult(whole.toString());
    } else {
      setDecimalResult(null);
    }
  }, [wholeNumber, numerator, denominator]);

  // Convert decimal to fraction
  useEffect(() => {
    const decimal = parseFloat(decimalInput);
    if (!isNaN(decimal)) {
      const result = decimalToFraction(decimal);
      setFractionResult(result);
    } else {
      setFractionResult(null);
    }
  }, [decimalInput]);

  // Convert MM to fraction
  useEffect(() => {
    const mm = parseFloat(mmInput);
    if (!isNaN(mm)) {
      const inches = mm / 25.4;
      setMmToInchesResult(inches.toFixed(6).replace(/\.?0+$/, ''));
      const result = decimalToFraction(inches);
      setMmToFractionResult(result);
    } else {
      setMmToInchesResult(null);
      setMmToFractionResult(null);
    }
  }, [mmInput]);

  const decimalToFraction = (decimal: number): string => {
    const whole = Math.floor(decimal);
    const fractional = decimal - whole;

    if (fractional === 0) {
      return whole.toString();
    }

    // Try common denominators first (2, 4, 8, 16, 32, 64)
    const commonDenominators = [64, 32, 16, 8, 4, 2];
    for (const den of commonDenominators) {
      const num = Math.round(fractional * den);
      if (Math.abs((num / den) - fractional) < 0.001) {
        // Simplify the fraction
        const gcd = greatestCommonDivisor(num, den);
        const simplifiedNum = num / gcd;
        const simplifiedDen = den / gcd;

        if (whole === 0) {
          return `${simplifiedNum}/${simplifiedDen}`;
        } else {
          return `${whole} ${simplifiedNum}/${simplifiedDen}`;
        }
      }
    }

    // If no common denominator works, use 64ths
    const num = Math.round(fractional * 64);
    const gcd = greatestCommonDivisor(num, 64);
    const simplifiedNum = num / gcd;
    const simplifiedDen = 64 / gcd;

    if (whole === 0) {
      return `${simplifiedNum}/${simplifiedDen}`;
    } else {
      return `${whole} ${simplifiedNum}/${simplifiedDen}`;
    }
  };

  const greatestCommonDivisor = (a: number, b: number): number => {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
  };

  const quickFractions = [
    { label: '1/16"', value: { whole: '0', num: '1', den: '16' } },
    { label: '1/8"', value: { whole: '0', num: '1', den: '8' } },
    { label: '3/16"', value: { whole: '0', num: '3', den: '16' } },
    { label: '1/4"', value: { whole: '0', num: '1', den: '4' } },
    { label: '3/8"', value: { whole: '0', num: '3', den: '8' } },
    { label: '1/2"', value: { whole: '0', num: '1', den: '2' } },
    { label: '5/8"', value: { whole: '0', num: '5', den: '8' } },
    { label: '3/4"', value: { whole: '0', num: '3', den: '4' } },
  ];

  const handleQuickFraction = (fraction: { whole: string; num: string; den: string }) => {
    setWholeNumber(fraction.whole);
    setNumerator(fraction.num);
    setDenominator(fraction.den);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Measurement Converter</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Fraction to Decimal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fraction → Decimal</Text>

          <View style={styles.fractionInputRow}>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              value={wholeNumber}
              onChangeText={setWholeNumber}
              placeholder="0"
              keyboardType="numeric"
            />
            <Text style={styles.fractionDivider}>+</Text>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              value={numerator}
              onChangeText={setNumerator}
              placeholder="0"
              keyboardType="numeric"
            />
            <Text style={styles.fractionDivider}>/</Text>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              value={denominator}
              onChangeText={setDenominator}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {decimalResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Result:</Text>
              <Text style={styles.resultValue}>{decimalResult}"</Text>
            </View>
          )}

          {/* Quick Reference */}
          <Text style={styles.quickRefTitle}>Quick Reference:</Text>
          <View style={styles.quickRefGrid}>
            {quickFractions.map((frac, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickRefButton}
                onPress={() => handleQuickFraction(frac.value)}
              >
                <Text style={styles.quickRefText}>{frac.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Decimal to Fraction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decimal → Fraction</Text>

          <TextInput
            style={styles.input}
            value={decimalInput}
            onChangeText={setDecimalInput}
            placeholder="Enter decimal (e.g., 3.625)"
            keyboardType="decimal-pad"
          />

          {fractionResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Result:</Text>
              <Text style={styles.resultValue}>{fractionResult}"</Text>
            </View>
          )}
        </View>

        {/* MM to Fraction/Inches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Millimeters → Inches</Text>
          <Text style={styles.sectionSubtitle}>
            (Common for glass thickness measurements)
          </Text>

          <TextInput
            style={styles.input}
            value={mmInput}
            onChangeText={setMmInput}
            placeholder="Enter millimeters (e.g., 6)"
            keyboardType="decimal-pad"
          />

          {mmToInchesResult && (
            <>
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Decimal Inches:</Text>
                <Text style={styles.resultValue}>{mmToInchesResult}"</Text>
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Fractional Inches:</Text>
                <Text style={styles.resultValue}>{mmToFractionResult}"</Text>
              </View>
            </>
          )}

          {/* Common Glass Thickness Reference */}
          <View style={styles.referenceTable}>
            <Text style={styles.referenceTitle}>Common Glass Thickness:</Text>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceCell}>3mm</Text>
              <Text style={styles.referenceCell}>→</Text>
              <Text style={styles.referenceCell}>1/8"</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceCell}>6mm</Text>
              <Text style={styles.referenceCell}>→</Text>
              <Text style={styles.referenceCell}>1/4"</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceCell}>10mm</Text>
              <Text style={styles.referenceCell}>→</Text>
              <Text style={styles.referenceCell}>3/8"</Text>
            </View>
            <View style={styles.referenceRow}>
              <Text style={styles.referenceCell}>12mm</Text>
              <Text style={styles.referenceCell}>→</Text>
              <Text style={styles.referenceCell}>1/2"</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  fractionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inputSmall: {
    flex: 1,
    textAlign: 'center',
  },
  fractionDivider: {
    fontSize: 20,
    color: Colors.text,
    marginHorizontal: 8,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: Colors.primaryLight + '20',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  quickRefTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  quickRefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickRefButton: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickRefText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  referenceTable: {
    marginTop: 20,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    padding: 16,
  },
  referenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  referenceCell: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ConverterScreen;
