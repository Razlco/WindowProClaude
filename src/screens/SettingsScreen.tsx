import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Colors, DEFAULT_APP_SETTINGS } from '../constants';
import StorageService from '../services/StorageService';

const SettingsScreen = () => {
  const [companyName, setCompanyName] = useState(DEFAULT_APP_SETTINGS.companyName);
  const [companyPhone, setCompanyPhone] = useState(DEFAULT_APP_SETTINGS.companyPhone);
  const [companyEmail, setCompanyEmail] = useState(DEFAULT_APP_SETTINGS.companyEmail);
  const [companyAddress, setCompanyAddress] = useState(DEFAULT_APP_SETTINGS.companyAddress);
  const [taxRate, setTaxRate] = useState((DEFAULT_APP_SETTINGS.taxRate * 100).toString());

  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autosave, setAutosave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all jobs, customers, and measurements? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Export functionality will be implemented here');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Company Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Your Company Name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={companyPhone}
            onChangeText={setCompanyPhone}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={companyEmail}
            onChangeText={setCompanyEmail}
            placeholder="info@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={companyAddress}
            onChangeText={setCompanyAddress}
            placeholder="123 Main Street"
          />
        </View>
      </View>

      {/* Pricing Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Configuration</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Default Tax Rate (%)</Text>
          <TextInput
            style={styles.input}
            value={taxRate}
            onChangeText={setTaxRate}
            placeholder="8.0"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Default pricing rules can be customized per product type and glass type.
            Contact support for advanced pricing configuration.
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Configure Pricing Rules</Text>
        </TouchableOpacity>
      </View>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts for scheduled jobs
            </Text>
          </View>
          <Switch
            value={enableNotifications}
            onValueChange={setEnableNotifications}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={enableNotifications ? Colors.primary : Colors.backgroundGray}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-save</Text>
            <Text style={styles.settingDescription}>
              Automatically save changes
            </Text>
          </View>
          <Switch
            value={autosave}
            onValueChange={setAutosave}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={autosave ? Colors.primary : Colors.backgroundGray}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Switch to dark theme
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={darkMode ? Colors.primary : Colors.backgroundGray}
          />
        </View>
      </View>

      {/* Bluetooth Devices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bluetooth Devices</Text>

        <View style={styles.deviceCard}>
          <View style={styles.deviceIcon}>
            <Text style={styles.deviceIconText}>BT</Text>
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>No devices paired</Text>
            <Text style={styles.deviceStatus}>
              Pair measurement devices for automatic capture
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Scan for Devices</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleExportData}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Export All Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Backup to Cloud
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleClearData}
        >
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Build</Text>
          <Text style={styles.aboutValue}>2025.10.10</Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Developer</Text>
          <Text style={styles.aboutValue}>Window Measurement Solutions</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveSettings}
      >
        <Text style={styles.saveButtonText}>Save All Settings</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  section: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  infoBox: {
    backgroundColor: Colors.backgroundGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDanger: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: Colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    marginBottom: 16,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceIconText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  aboutLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default SettingsScreen;
