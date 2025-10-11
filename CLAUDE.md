# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A professional Expo React Native TypeScript application for window/door/glass measurement and job estimation. The app helps contractors capture measurements (manual or via Bluetooth devices), calculate pricing, generate quotes, manage customer information, and create PDF estimates.

## Technology Stack

- **Framework**: Expo SDK with React Native
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Storage**: AsyncStorage for local data persistence
- **Date Handling**: date-fns
- **PDF Generation**: expo-print, expo-sharing
- **Calendar**: react-native-calendars
- **Bluetooth**: expo-bluetooth (for measurement devices)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios
npm run web

# Type checking
npx tsc --noEmit
```

## Project Structure

```
/src
  /types          - TypeScript type definitions (Job, Customer, Measurement, Pricing)
  /constants      - App constants (colors, pricing rules, defaults)
  /utils          - Utility functions (pricing calculations, job numbering, date formatting)
  /hooks          - Custom React hooks (useJobStorage, usePricing, useBluetooth)
  /services       - Service modules (StorageService, PDFService, BluetoothService)
  /components     - Reusable UI components (JobCard, MeasurementCard, PricingCalculator)
  /navigation     - Navigation configuration (TabNavigator, StackNavigator)
  /screens        - Screen components (Home, JobDetails, Calendar, Settings, etc.)
```

## Core Architecture

### Data Flow
1. **Storage Layer** (`src/services/StorageService.ts`): AsyncStorage wrapper for CRUD operations on jobs, customers, and settings
2. **Business Logic** (`src/utils/`): Pure functions for pricing calculations, job number generation, and formatting
3. **State Management** (`src/hooks/`): Custom hooks manage data fetching and business logic
4. **UI Layer** (`src/components/`, `src/screens/`): React components consume hooks and display data

### Key Type Definitions (src/types/index.ts)

- **Job**: Main entity containing customer, measurements, pricing, status, and metadata
- **Customer**: Contact and address information
- **Measurement**: Product dimensions, type (window/door/glass), glass type, frame type, quantity
- **JobPricing**: Calculated pricing with subtotal, tax, discount, total, and itemized costs
- **ProductType**: Enum for WINDOW, DOOR, GLASS_PANEL, SLIDING_DOOR, etc.
- **JobStatus**: Enum for DRAFT, QUOTED, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED

### Job Number Format

Auto-generated job numbers follow the pattern: `YYYYMMDD-XXX`
- Example: `20241010-001`
- Date-based prefix ensures chronological ordering
- Three-digit sequence for jobs created on the same day
- Generation logic in `src/utils/jobNumbering.ts`

### Pricing System

Pricing is calculated based on:
1. **Base price** (per square foot) - varies by product type and glass type
2. **Labor price** (per unit) - varies by product type
3. **Frame multiplier** (1.0 - 1.4x) - applied if frame type is specified
4. **Minimum charge** - ensures profitability on small jobs
5. **Tax rate** - configurable, default 8%
6. **Discount** - optional per-job discount

Default pricing rules are in `src/constants/pricing.ts` and can be customized in app settings.

## Common Development Patterns

### Adding a New Screen

1. Create screen file in `src/screens/NewScreen.tsx`
2. Add screen to navigation in `src/navigation/StackNavigator.tsx` or `TabNavigator.tsx`
3. Add screen name constant to `src/constants/defaults.ts`
4. Use existing components and hooks for consistency

### Working with Jobs

```typescript
// Load jobs
const { jobs, loading, saveJob, deleteJob } = useJobStorage();

// Calculate pricing
const pricing = calculateJobPricing(measurements, taxRate, discount);

// Generate job number
const jobNumber = generateJobNumber(lastJobNumber, new Date());
```

### Modifying Pricing Rules

Edit `src/constants/pricing.ts` to modify default pricing, or allow users to customize via Settings screen. Pricing calculations are in `src/utils/pricing.ts`.

## Important Implementation Notes

- All dates should be stored as Date objects or ISO strings
- Job IDs, Customer IDs, and Measurement IDs use the format: `PREFIX-timestamp-random`
- AsyncStorage keys are defined in `src/constants/defaults.ts` (STORAGE_KEYS)
- Color palette is centralized in `src/constants/colors.ts`
- Measurements are stored in inches (width, height, depth)
- Currency formatting uses USD via `Intl.NumberFormat`

## Future Implementation TODOs

The following features are stubbed and need full implementation:

1. **Bluetooth Integration** (`src/services/BluetoothService.ts`): Connect to measurement devices
2. **Signature Capture** (`src/components/SignatureCapture.tsx`): Implement with react-native-signature-canvas
3. **Calendar Integration** (`src/screens/CalendarScreen.tsx`): Display scheduled jobs on calendar
4. **PDF Customization**: Enhance PDF templates with company logos and styling
5. **Job Details Screen**: Complete implementation with full CRUD operations
6. **Measurements Screen**: Build form for adding/editing measurements
7. **Settings Screen**: Implement company info, pricing rules, and data management UIs

## Testing Considerations

When adding tests:
- Test pricing calculations with edge cases (minimum charges, various multipliers)
- Test job number generation across date boundaries
- Mock AsyncStorage for storage service tests
- Test navigation flows between screens
