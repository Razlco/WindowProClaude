import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants';

// Import authentication screens
import { LoginScreen, SignUpScreen, ForgotPasswordScreen } from '../screens/auth';

// Import all screens
import LandingScreen from '../screens/LandingScreen';
import HomeMainScreen from '../screens/HomeMainScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import LeadsScreen from '../screens/LeadsScreen';
import ConverterScreen from '../screens/ConverterScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NewJobScreen from '../screens/NewJobScreen';
import MeasurementsScreen from '../screens/MeasurementsScreen';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import AdminScreen from '../screens/AdminScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import EstimatePreviewScreen from '../screens/EstimatePreviewScreen';

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Authentication Screens */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />

      {/* Landing/Login Screen - First screen shown */}
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />

      {/* Home Main Screen - Central hub with card navigation */}
      <Stack.Screen
        name="HomeMain"
        component={HomeMainScreen}
        options={{ headerShown: false }}
      />

      {/* Projects Screen - View all estimates/jobs */}
      <Stack.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ headerShown: false }}
      />

      {/* Leads Screen - Potential customers */}
      <Stack.Screen
        name="Leads"
        component={LeadsScreen}
        options={{ headerShown: false }}
      />

      {/* Converter Screen - Fraction/Decimal/MM converter */}
      <Stack.Screen
        name="Converter"
        component={ConverterScreen}
        options={{ headerShown: false }}
      />

      {/* Calendar Screen - Scheduled jobs */}
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />

      {/* Settings Screen */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />

      {/* New Job Screen - Customer information entry */}
      <Stack.Screen
        name="NewJob"
        component={NewJobScreen}
        options={{ title: 'Customer Information' }}
      />

      {/* Measurements Screen - Add/edit measurements */}
      <Stack.Screen
        name="Measurements"
        component={MeasurementsScreen}
        options={{ title: 'Add Measurements' }}
      />

      {/* Job Details Screen - View/edit job */}
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }}
      />

      {/* Admin Screen - Admin panel */}
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Admin Panel' }}
      />

      {/* Subscription Screen - Billing & subscription management */}
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ headerShown: false }}
      />

      {/* Estimate Preview Screen - PDF generation and sending */}
      <Stack.Screen
        name="EstimatePreview"
        component={EstimatePreviewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
