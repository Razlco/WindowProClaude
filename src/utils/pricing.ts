import {
  Measurement,
  JobPricing,
  ItemizedCost,
  PricingRule,
  FrameType,
} from '../types';
import {
  DEFAULT_PRICING_RULES,
  DEFAULT_TAX_RATE,
  FRAME_TYPE_MULTIPLIERS,
} from '../constants';

/**
 * Calculate square footage from width and height (in inches)
 */
export const calculateSquareFeet = (
  widthInches: number,
  heightInches: number
): number => {
  return (widthInches * heightInches) / 144; // 144 square inches = 1 square foot
};

/**
 * Find the applicable pricing rule for a measurement
 */
export const findPricingRule = (
  measurement: Measurement,
  pricingRules: PricingRule[] = DEFAULT_PRICING_RULES
): PricingRule => {
  // Try to find exact match with glass type
  let rule = pricingRules.find(
    (r) =>
      r.productType === measurement.productType &&
      r.glassType === measurement.glassType
  );

  // If not found, find by product type only
  if (!rule) {
    rule = pricingRules.find((r) => r.productType === measurement.productType);
  }

  // Fallback to first rule (should never happen with proper defaults)
  if (!rule) {
    rule = pricingRules[0];
  }

  return rule;
};

/**
 * Calculate cost for a single measurement
 */
export const calculateMeasurementCost = (
  measurement: Measurement,
  pricingRules: PricingRule[] = DEFAULT_PRICING_RULES
): ItemizedCost => {
  const rule = findPricingRule(measurement, pricingRules);
  const sqFt = calculateSquareFeet(measurement.width, measurement.height);

  let basePrice = rule.basePrice * sqFt;

  // Apply frame type multiplier if applicable
  if (measurement.frameType) {
    const multiplier = FRAME_TYPE_MULTIPLIERS[measurement.frameType] || 1.0;
    basePrice *= multiplier;
  }

  const laborCost = rule.laborPrice;
  const unitPrice = basePrice + laborCost;
  const subtotal = Math.max(unitPrice * measurement.quantity, rule.minimumCharge);

  return {
    measurementId: measurement.id,
    description: `${measurement.productType} - ${measurement.glassType || 'Standard'}${
      measurement.frameType ? ` (${measurement.frameType})` : ''
    } - ${measurement.width}"W x ${measurement.height}"H`,
    quantity: measurement.quantity,
    unitPrice: parseFloat(unitPrice.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
  };
};

/**
 * Calculate total job pricing from all measurements
 */
export const calculateJobPricing = (
  measurements: Measurement[],
  taxRate: number = DEFAULT_TAX_RATE,
  discount: number = 0,
  pricingRules: PricingRule[] = DEFAULT_PRICING_RULES
): JobPricing => {
  const itemizedCosts = measurements.map((m) =>
    calculateMeasurementCost(m, pricingRules)
  );

  const subtotal = itemizedCosts.reduce((sum, cost) => sum + cost.subtotal, 0);
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxRate,
    tax: parseFloat(tax.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemizedCosts,
  };
};

/**
 * Format currency value
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format measurement dimensions
 */
export const formatDimensions = (
  width: number,
  height: number,
  depth?: number
): string => {
  let result = `${width}" W x ${height}" H`;
  if (depth) {
    result += ` x ${depth}" D`;
  }
  return result;
};
