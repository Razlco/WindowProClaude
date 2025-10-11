import { format } from 'date-fns';

/**
 * Generate a unique job number in format: YYYYMMDD-XXX
 * Example: 20241010-001
 */
export const generateJobNumber = (lastJobNumber: number, date: Date = new Date()): string => {
  const dateStr = format(date, 'yyyyMMdd');
  const sequenceNumber = (lastJobNumber + 1).toString().padStart(3, '0');
  return `${dateStr}-${sequenceNumber}`;
};

/**
 * Parse a job number to extract date and sequence
 */
export const parseJobNumber = (
  jobNumber: string
): { date: string; sequence: number } | null => {
  const match = jobNumber.match(/^(\d{8})-(\d{3})$/);
  if (!match) return null;

  return {
    date: match[1],
    sequence: parseInt(match[2], 10),
  };
};

/**
 * Validate job number format
 */
export const isValidJobNumber = (jobNumber: string): boolean => {
  return /^\d{8}-\d{3}$/.test(jobNumber);
};

/**
 * Get next job number based on the last number used
 */
export const getNextJobNumber = (
  currentJobNumbers: string[],
  date: Date = new Date()
): string => {
  const dateStr = format(date, 'yyyyMMdd');

  // Filter job numbers from today
  const todayJobs = currentJobNumbers.filter((jn) => jn.startsWith(dateStr));

  // Find highest sequence number for today
  const sequences = todayJobs
    .map((jn) => parseJobNumber(jn))
    .filter((parsed): parsed is { date: string; sequence: number } => parsed !== null)
    .map((parsed) => parsed.sequence);

  const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0;

  return generateJobNumber(maxSequence, date);
};

/**
 * Generate a customer ID (simple UUID-like string)
 */
export const generateCustomerId = (): string => {
  return `CUS-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

/**
 * Generate a measurement ID
 */
export const generateMeasurementId = (): string => {
  return `MEA-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

/**
 * Generate a job ID
 */
export const generateJobId = (): string => {
  return `JOB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};
