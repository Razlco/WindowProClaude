import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants';

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

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
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
    </Stack.Navigator>
  );
};
