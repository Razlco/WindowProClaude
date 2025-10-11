import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors, SCREEN_NAMES } from '../constants';
import { TabNavigator } from './TabNavigator';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import MeasurementsScreen from '../screens/MeasurementsScreen';
import NewJobScreen from '../screens/NewJobScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
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
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.NEW_JOB}
        component={NewJobScreen}
        options={{ title: 'New Job' }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.JOB_DETAILS}
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.MEASUREMENTS}
        component={MeasurementsScreen}
        options={{ title: 'Add Measurements' }}
      />
      <Stack.Screen
        name={SCREEN_NAMES.ADMIN}
        component={AdminScreen}
        options={{ title: 'Admin Panel' }}
      />
    </Stack.Navigator>
  );
};
