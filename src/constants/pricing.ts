import { ProductType, GlassType, FrameType, PricingRule } from '../types';

// Default pricing rules ($ per square foot for materials, $ per unit for labor)
export const DEFAULT_PRICING_RULES: PricingRule[] = [
  // Single Hung Windows
  {
    productType: ProductType.SINGLE_HUNG,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 15.0,
    laborPrice: 75.0,
    minimumCharge: 150.0,
  },
  {
    productType: ProductType.SINGLE_HUNG,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 25.0,
    laborPrice: 85.0,
    minimumCharge: 200.0,
  },

  // Double Hung Windows
  {
    productType: ProductType.DOUBLE_HUNG,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 18.0,
    laborPrice: 80.0,
    minimumCharge: 160.0,
  },
  {
    productType: ProductType.DOUBLE_HUNG,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 28.0,
    laborPrice: 90.0,
    minimumCharge: 210.0,
  },

  // Picture Windows
  {
    productType: ProductType.PICTURE,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 12.0,
    laborPrice: 60.0,
    minimumCharge: 120.0,
  },
  {
    productType: ProductType.PICTURE,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 22.0,
    laborPrice: 70.0,
    minimumCharge: 180.0,
  },

  // Slider Windows
  {
    productType: ProductType.SLIDER,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 16.0,
    laborPrice: 70.0,
    minimumCharge: 145.0,
  },
  {
    productType: ProductType.SLIDER,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 26.0,
    laborPrice: 80.0,
    minimumCharge: 195.0,
  },

  // XOX Slider Windows
  {
    productType: ProductType.XOX_SLIDER,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 18.0,
    laborPrice: 90.0,
    minimumCharge: 180.0,
  },
  {
    productType: ProductType.XOX_SLIDER,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 28.0,
    laborPrice: 100.0,
    minimumCharge: 230.0,
  },

  // Casement Windows
  {
    productType: ProductType.CASEMENT,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 20.0,
    laborPrice: 85.0,
    minimumCharge: 170.0,
  },
  {
    productType: ProductType.CASEMENT,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 30.0,
    laborPrice: 95.0,
    minimumCharge: 220.0,
  },

  // Casement Picture Windows
  {
    productType: ProductType.CASEMENT_PICTURE,
    glassType: GlassType.SINGLE_PANE,
    basePrice: 22.0,
    laborPrice: 95.0,
    minimumCharge: 190.0,
  },
  {
    productType: ProductType.CASEMENT_PICTURE,
    glassType: GlassType.DOUBLE_PANE,
    basePrice: 32.0,
    laborPrice: 105.0,
    minimumCharge: 240.0,
  },
];

// Default tax rate (8%)
export const DEFAULT_TAX_RATE = 0.08;

// Frame type multipliers (applied to base price)
export const FRAME_TYPE_MULTIPLIERS: Record<FrameType, number> = {
  [FrameType.VINYL]: 1.0,
  [FrameType.WOOD]: 1.3,
  [FrameType.ALUMINUM]: 1.1,
  [FrameType.FIBERGLASS]: 1.4,
  [FrameType.COMPOSITE]: 1.35,
};
