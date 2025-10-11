import { AppSettings, ProductType, GlassType } from '../types';
import { DEFAULT_PRICING_RULES, DEFAULT_TAX_RATE } from './pricing';

// Default application settings
export const DEFAULT_APP_SETTINGS: AppSettings = {
  companyName: 'Glass & Window Solutions',
  companyAddress: '123 Main Street',
  companyPhone: '(555) 123-4567',
  companyEmail: 'info@glasswindow.com',
  taxRate: DEFAULT_TAX_RATE,
  defaultPricingRules: DEFAULT_PRICING_RULES,
  jobNumberPrefix: 'JOB',
  lastJobNumber: 0,
};

// Storage keys
export const STORAGE_KEYS = {
  JOBS: '@jobs',
  CUSTOMERS: '@customers',
  SETTINGS: '@settings',
  BLUETOOTH_DEVICES: '@bluetooth_devices',
  LAST_JOB_NUMBER: '@last_job_number',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
  JOB_NUMBER: 'YYYYMMDD',
  CALENDAR: 'YYYY-MM-DD',
};

// Measurement limits
export const MEASUREMENT_LIMITS = {
  MIN_WIDTH: 6, // inches
  MAX_WIDTH: 240, // inches (20 feet)
  MIN_HEIGHT: 6, // inches
  MAX_HEIGHT: 240, // inches (20 feet)
  MIN_DEPTH: 0.5, // inches
  MAX_DEPTH: 12, // inches
};

// Default values for new measurements
export const DEFAULT_MEASUREMENT = {
  productType: ProductType.DOUBLE_HUNG,
  glassType: GlassType.DOUBLE_PANE,
  quantity: 1,
};

// Bluetooth connection settings
export const BLUETOOTH_CONFIG = {
  SCAN_TIMEOUT: 10000, // 10 seconds
  CONNECTION_TIMEOUT: 5000, // 5 seconds
  AUTO_RECONNECT: true,
};

// PDF export settings
export const PDF_CONFIG = {
  PAGE_SIZE: 'LETTER' as const,
  MARGIN: 20,
  FONT_SIZE: {
    TITLE: 20,
    HEADING: 16,
    SUBHEADING: 14,
    BODY: 12,
    SMALL: 10,
  },
};

// Navigation
export const SCREEN_NAMES = {
  HOME: 'Home',
  MEASUREMENTS: 'Measurements',
  JOB_DETAILS: 'JobDetails',
  CALENDAR: 'Calendar',
  SETTINGS: 'Settings',
  ADMIN: 'Admin',
  NEW_JOB: 'NewJob',
  EDIT_JOB: 'EditJob',
  CUSTOMER_FORM: 'CustomerForm',
} as const;

export const TAB_NAMES = {
  JOBS: 'Jobs',
  CALENDAR: 'Calendar',
  SETTINGS: 'Settings',
} as const;
