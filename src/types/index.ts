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

export enum WorkflowStatus {
  NONE = 'NONE',
  ESTIMATE_SCHEDULED = 'ESTIMATE_SCHEDULED',
  MATERIALS_NEEDED = 'MATERIALS_NEEDED',
  INSTALLER_MEASUREMENTS = 'INSTALLER_MEASUREMENTS',
  SCHEDULED_FOR_INSTALL = 'SCHEDULED_FOR_INSTALL',
  FOLLOW_UP_NEEDED = 'FOLLOW_UP_NEEDED',
}

export interface Job {
  id: string;
  jobNumber: string; // Auto-generated format: YYYYMMDD-XXX
  customer: Customer;
  measurements: Measurement[];
  status: JobStatus;
  workflowStatus?: WorkflowStatus;
  workflowStatusNotes?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  appointmentDate?: Date; // For estimate appointments
  followUpDate?: Date; // For follow-up reminders
  installDate?: Date; // For installation scheduling
  workOrderNumber?: string; // For scheduled installs
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

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  FOLLOW_UP = 'FOLLOW_UP',
  SCHEDULED = 'SCHEDULED',
  CONVERTED = 'CONVERTED',
  CANCELLED = 'CANCELLED',
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  interest: string; // Windows, Glass, Doors, or description
  notes?: string;
  status: LeadStatus;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
