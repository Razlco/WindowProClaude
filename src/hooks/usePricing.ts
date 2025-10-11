import { useMemo } from 'react';
import { Measurement, JobPricing } from '../types';
import { calculateJobPricing } from '../utils/pricing';

export const usePricing = (
  measurements: Measurement[],
  taxRate?: number,
  discount?: number
) => {
  const pricing: JobPricing = useMemo(() => {
    return calculateJobPricing(measurements, taxRate, discount);
  }, [measurements, taxRate, discount]);

  return pricing;
};
