# Glass Type Refactoring - Implementation Notes

## Changes Made

### 1. Type Definitions (src/types/index.ts) ✅

**Measurement Interface Updated:**
- Changed `glassType?: GlassType` to `glassTypes: GlassType[]` (array for multiple selections)
- Added pricing option fields directly to Measurement:
  - `hasTempered: boolean`
  - `hasLaminate: boolean`
  - `hasTinted: boolean`
  - `hasGrids: boolean`
  - `gridPattern?: string`
  - `hasInstallation: boolean`
  - `customPrice?: number`
  - `sidelightCount?: number`
  - `sidelightType?: 'FULL' | 'HALF' | 'NONE'`

**GlassType Enum Simplified:**
```typescript
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
```

**Removed from GlassType:**
- TEMPERED (moved to pricing toggle)
- LAMINATED (moved to pricing toggle)
- TINTED (moved to pricing toggle)

## Changes Needed in MeasurementsScreen.tsx

### State Management Changes Required:

1. **Remove these state variables:**
   ```typescript
   const [glassType, setGlassType] = useState<GlassType>(...);
   const [paneCount, setPaneCount] = useState<'SINGLE' | 'DOUBLE' | 'TRIPLE'>('DOUBLE');
   const [glassStrength, setGlassStrength] = useState<'SINGLE' | 'DOUBLE' | 'TRIPLE'>('SINGLE');
   ```

2. **Add new state variable:**
   ```typescript
   const [selectedGlassTypes, setSelectedGlassTypes] = useState<GlassType[]>([
     GlassType.DOUBLE_PANE,
     GlassType.DOUBLE_STRENGTH
   ]);
   ```

### UI Changes Required:

1. **Replace "Glass Type" section** (currently single-select chips)

   **Change from:** Single selection chips

   **Change to:** Multi-selection chips that can toggle on/off
   ```typescript
   <View style={styles.inputGroup}>
     <Text style={styles.label}>Glass Type * (Select all that apply)</Text>
     <View style={styles.chipContainer}>
       {Object.values(GlassType).map((type) => {
         const isSelected = selectedGlassTypes.includes(type);
         return (
           <TouchableOpacity
             key={type}
             style={[
               styles.chip,
               isSelected && styles.chipSelected,
             ]}
             onPress={() => {
               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
               if (isSelected) {
                 // Remove from selection
                 setSelectedGlassTypes(selectedGlassTypes.filter(t => t !== type));
               } else {
                 // Add to selection
                 setSelectedGlassTypes([...selectedGlassTypes, type]);
               }
             }}
             activeOpacity={0.7}
           >
             <Text style={[
               styles.chipText,
               isSelected && styles.chipTextSelected,
             ]}>
               {type.replace(/_/g, ' ')}
             </Text>
           </TouchableOpacity>
         );
       })}
     </View>
     <Text style={styles.helperText}>
       Example: Double Pane + Double Strength + Neat+
     </Text>
   </View>
   ```

2. **Remove "Pane Count" and "Glass Strength" sections** from Pricing Options
   - These are now part of Glass Type multi-select

3. **Keep all toggle switches** in Pricing Options:
   - Laminate
   - Tempered
   - Tinted
   - Installation
   - Grids (with pattern field)

### addMeasurement Function Changes:

```typescript
const addMeasurement = (widthNum: number, heightNum: number, quantityNum: number) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  const newMeasurement: Measurement = {
    id: generateMeasurementId(),
    width: widthNum,
    height: heightNum,
    depth: depth ? parseFloat(depth) : undefined,
    quantity: quantityNum,
    productType,
    glassTypes: selectedGlassTypes, // Changed from glassType
    frameType,
    hingePlacement,
    // Pricing options
    hasTempered,
    hasLaminate,
    hasTinted,
    hasGrids,
    gridPattern: hasGrids ? gridPattern : undefined,
    hasInstallation,
    customPrice: customPrice ? parseFloat(customPrice) : undefined,
    sidelightCount: selectedCategory === 'DOOR' ? parseInt(sidelightCount) : undefined,
    sidelightType: selectedCategory === 'DOOR' ? sidelightType : undefined,
    notes: notes.trim() || undefined,
    measuredAt: new Date(),
  };

  setMeasurements([...measurements, newMeasurement]);
  resetForm();
  setShowForm(true);
};
```

### resetForm Function Changes:

```typescript
const resetForm = () => {
  setWidth('');
  setHeight('');
  setDepth('');
  setQuantity('1');
  setProductType(DEFAULT_MEASUREMENT.productType);
  setSelectedGlassTypes([GlassType.DOUBLE_PANE, GlassType.DOUBLE_STRENGTH]); // Default
  setFrameType(undefined);
  setHingePlacement(undefined);
  setNotes('');
  // Reset pricing options
  setHasLaminate(false);
  setHasTempered(false);
  setHasTinted(false);
  setHasGrids(false);
  setGridPattern('');
  setHasInstallation(false);
  setCustomPrice('');
  setSidelightCount('0');
  setSidelightType('FULL');
};
```

## PDF Generation Notes

When generating PDFs, the glass description should be built from:

1. **Glass Types array** (e.g., "Double Pane, Double Strength, Neat+")
2. **Pricing toggles** (e.g., "+ Tempered, + Laminate")
3. **Grids** (if hasGrids: "+ Grids (Colonial pattern)")

Example output:
```
Window Type: Double Hung
Glass: Double Pane, Double Strength, Neat+, Tempered, Laminate
Grids: Colonial pattern
```

## Other Files That May Need Updates

1. **MeasurementCard.tsx** - Display logic for glass types
2. **DEFAULT_MEASUREMENT constant** - Update default structure
3. **calculateJobPricing utility** - Update pricing calculations
4. **EstimatePreviewScreen.tsx** - PDF generation with new structure
5. **WorkOrderModal.tsx** - Materials list generation

## Backward Compatibility Note

Existing jobs with old `glassType` field will need migration:
```typescript
// Migration logic example
if (measurement.glassType && !measurement.glassTypes) {
  measurement.glassTypes = [measurement.glassType];
  delete measurement.glassType;
}
```
