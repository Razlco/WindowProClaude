import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, TAB_NAMES } from '../constants';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name={TAB_NAMES.JOBS}
        component={HomeScreen}
        options={{
          title: 'Jobs',
          headerTitle: 'Window Measurement App',
        }}
      />
      <Tab.Screen
        name={TAB_NAMES.CALENDAR}
        component={CalendarScreen}
        options={{
          title: 'Calendar',
        }}
      />
      <Tab.Screen
        name={TAB_NAMES.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};
