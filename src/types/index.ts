// Core type definitions for the Window Measurement App

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Measurement {
  id: string;
  width: number; // in inches
  height: number; // in inches
  depth?: number; // in inches (for frames, etc.)
  quantity: number;
  productType: ProductType;
  glassType?: GlassType;
  frameType?: FrameType;
  hingePlacement?: 'LEFT' | 'RIGHT'; // For casement windows (viewed from exterior)
  notes?: string;
  bluetoothDeviceId?: string;
  measuredAt: Date;
}

export enum ProductType {
  SINGLE_HUNG = 'SINGLE_HUNG',
  DOUBLE_HUNG = 'DOUBLE_HUNG',
  PICTURE = 'PICTURE',
  SLIDER = 'SLIDER',
  XOX_SLIDER = 'XOX_SLIDER',
  CASEMENT = 'CASEMENT',
  CASEMENT_PICTURE = 'CASEMENT_PICTURE',
}

export enum GlassType {
  SINGLE_PANE = 'SINGLE_PANE',
  DOUBLE_PANE = 'DOUBLE_PANE',
  TRIPLE_PANE = 'TRIPLE_PANE',
  TEMPERED = 'TEMPERED',
  LAMINATED = 'LAMINATED',
  NEAT_PLUS = 'NEAT_PLUS',
  OFF_SET = 'OFF_SET',
  SINGLE_STRENGTH = 'SINGLE_STRENGTH',
  DOUBLE_STRENGTH = 'DOUBLE_STRENGTH',
  TRIPLE_STRENGTH = 'TRIPLE_STRENGTH',
  TINTED = 'TINTED',
}

export enum FrameType {
  VINYL = 'VINYL',
  WOOD = 'WOOD',
  ALUMINUM = 'ALUMINUM',
  FIBERGLASS = 'FIBERGLASS',
  COMPOSITE = 'COMPOSITE',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  QUOTED = 'QUOTED',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Job {
  id: string;
  jobNumber: string; // Auto-generated format: YYYYMMDD-XXX
  customer: Customer;
  measurements: Measurement[];
  status: JobStatus;
  scheduledDate?: Date;
  completedDate?: Date;
  pricing: JobPricing;
  notes?: string;
  signatureDataUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingRule {
  productType: ProductType;
  glassType?: GlassType;
  frameType?: FrameType;
  basePrice: number; // per square foot
  laborPrice: number; // per unit
  minimumCharge: number;
}

export interface JobPricing {
  subtotal: number;
  taxRate: number;
  tax: number;
  discount: number;
  total: number;
  itemizedCosts: ItemizedCost[];
}

export interface ItemizedCost {
  measurementId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  taxRate: number;
  defaultPricingRules: PricingRule[];
  jobNumberPrefix: string;
  lastJobNumber: number;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  isConnected: boolean;
  lastConnected?: Date;
}
