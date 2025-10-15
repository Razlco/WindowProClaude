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
  location?: string; // Room or location (e.g., "Living Room", "Master Bedroom")
  productType: ProductType;
  glassTypes: GlassType[]; // Allow multiple selections (e.g., Double Pane + Double Strength + Neat+)
  frameType?: FrameType;
  hingePlacement?: 'LEFT' | 'RIGHT'; // For casement windows (viewed from exterior)
  // Pricing options (toggles)
  hasTempered: boolean;
  hasLaminate: boolean;
  hasTinted: boolean;
  hasGrids: boolean;
  gridPattern?: string;
  hasInstallation: boolean;
  customPrice?: number; // Optional price override
  // Door-specific
  sidelightCount?: number;
  sidelightType?: 'FULL' | 'HALF' | 'NONE';
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
  // Pane Count
  SINGLE_PANE = 'SINGLE_PANE',
  DOUBLE_PANE = 'DOUBLE_PANE',
  TRIPLE_PANE = 'TRIPLE_PANE',
  // Glass Strength
  SINGLE_STRENGTH = 'SINGLE_STRENGTH',
  DOUBLE_STRENGTH = 'DOUBLE_STRENGTH',
  TRIPLE_STRENGTH = 'TRIPLE_STRENGTH',
  // Special Glass Types
  NEAT_PLUS = 'NEAT_PLUS',
  OFF_SET = 'OFF_SET',
}

export enum FrameType {
  VINYL = 'VINYL',
  WOOD = 'WOOD',
  ALUMINUM = 'ALUMINUM',
  FIBERGLASS = 'FIBERGLASS',
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

export enum ChangeReason {
  MISTAKE = 'I made a mistake',
  CUSTOMER_LAYOUT_CHANGE = 'Customer changed window layout',
  INSTALLER_CORRECTION = 'Installer corrected measurements',
  CUSTOMER_ADDED_WINDOWS = 'Customer added windows',
}

export interface MeasurementChangeLog {
  id: string;
  jobId: string;
  measurementId: string;
  changedBy: string; // User ID
  changedByName: string; // User display name
  changedAt: Date;
  previousValue: Measurement;
  newValue: Measurement;
  reason: ChangeReason;
  reasonNotes?: string; // Additional context
  approvedBy?: string; // Manager/Admin ID
  approvedByName?: string;
  approvedAt?: Date;
  installerApprovalRequired: boolean; // True if reason is INSTALLER_CORRECTION
  installerApprovedBy?: string;
  installerApprovedByName?: string;
  installerApprovedAt?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
  workOrderScopeOfWork?: string; // Detailed description of work to be completed
  workOrderMaterialsRequired?: string; // List of materials needed
  workOrderSpecialInstructions?: string; // Special notes, access codes, safety info
  workOrderEstimatedDuration?: string; // How long the job will take
  pricing: JobPricing;
  notes?: string;
  signatureDataUrl?: string;
  measurementsLocked: boolean; // Locked when status changes from DRAFT to QUOTED
  lockedAt?: Date;
  lockedBy?: string; // User ID who locked
  lockedByName?: string;
  changeLog: MeasurementChangeLog[]; // Track all measurement changes
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
