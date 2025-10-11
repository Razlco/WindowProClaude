# Window Measurement App

A professional mobile application for window, door, and glass measurement and job estimation, built with Expo and React Native.

## Features

- **Job Management**: Create, track, and manage measurement jobs with automatic job numbering
- **Customer Management**: Store and organize customer information
- **Measurements**: Capture measurements manually or via Bluetooth devices
- **Pricing Calculator**: Automatic pricing based on product type, glass type, and frame materials
- **PDF Quotes**: Generate professional PDF estimates for customers
- **Calendar**: Schedule and track job appointments
- **Data Persistence**: All data stored locally on device

## Getting Started

### Prerequisites

- Node.js 18+ (Note: Current system has Node 18.19.1, but Node 20+ is recommended for optimal performance)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android
npm run ios  # Requires macOS
npm run web
```

## Project Structure

- `/src/types` - TypeScript type definitions
- `/src/constants` - Application constants and configuration
- `/src/utils` - Utility functions for pricing, formatting, etc.
- `/src/hooks` - Custom React hooks
- `/src/services` - Service modules for storage, PDF, Bluetooth
- `/src/components` - Reusable UI components
- `/src/navigation` - Navigation configuration
- `/src/screens` - Screen components

## Tech Stack

- **Expo** - React Native framework
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **date-fns** - Date manipulation
- **expo-print** - PDF generation

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and development guidelines.

## License

Proprietary - All rights reserved
