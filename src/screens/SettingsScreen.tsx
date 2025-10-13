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
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, DEFAULT_APP_SETTINGS } from '../constants';
import StorageService from '../services/StorageService';

const SettingsScreen = ({ navigation }: any) => {
  const [companyName, setCompanyName] = useState(DEFAULT_APP_SETTINGS.companyName);
  const [companyPhone, setCompanyPhone] = useState(DEFAULT_APP_SETTINGS.companyPhone);
  const [companyEmail, setCompanyEmail] = useState(DEFAULT_APP_SETTINGS.companyEmail);
  const [companyAddress, setCompanyAddress] = useState(DEFAULT_APP_SETTINGS.companyAddress);
  const [taxRate, setTaxRate] = useState((DEFAULT_APP_SETTINGS.taxRate * 100).toString());

  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autosave, setAutosave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // PDF Pricing Options
  const [pdfDetailedPricing, setPdfDetailedPricing] = useState(true);

  // Multi-tax rate management
  const [taxRates, setTaxRates] = useState<Array<{id: string, name: string, rate: number, isDefault: boolean}>>([
    { id: '1', name: 'Default', rate: 8.0, isDefault: true },
  ]);

  // Company branding
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  // Bluetooth state
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<Array<{id: string, name: string}>>([]);

  const handleSaveSettings = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const handleScanDevices = () => {
    setIsScanning(true);
    // TODO: Backend developer - Implement actual Bluetooth scanning here
    // Use react-native-ble-plx or expo-bluetooth
    // Scan for Bosch GLM and Leica Disto devices

    // Simulated scan result for UI demonstration
    setTimeout(() => {
      setAvailableDevices([
        { id: 'demo-1', name: 'Bosch GLM 50 C' },
        { id: 'demo-2', name: 'Leica DISTO D2' },
      ]);
      setIsScanning(false);
      Alert.alert('Scan Complete', 'Found compatible measurement devices. Tap a device to connect.');
    }, 2000);
  };

  const handleConnectDevice = (deviceId: string, deviceName: string) => {
    // TODO: Backend developer - Implement actual Bluetooth connection here
    // Connect to the selected device
    // Store device UUID/ID for future measurements

    Alert.alert(
      'Connect Device',
      `Connect to ${deviceName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: () => {
            setConnectedDevice(deviceName);
            setAvailableDevices([]);
            Alert.alert('Success', `Connected to ${deviceName}`);
          },
        },
      ]
    );
  };

  const handleDisconnectDevice = () => {
    // TODO: Backend developer - Implement actual Bluetooth disconnection here

    Alert.alert(
      'Disconnect Device',
      `Disconnect from ${connectedDevice}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setConnectedDevice(null);
            Alert.alert('Disconnected', 'Device has been disconnected');
          },
        },
      ]
    );
  };

  const handleUploadLogo = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // TODO: Backend developer - Implement expo-image-picker for logo selection
      // import * as ImagePicker from 'expo-image-picker';
      //
      // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      // if (status !== 'granted') {
      //   Alert.alert('Permission Denied', 'Camera roll permissions are required to upload a logo.');
      //   return;
      // }
      //
      // const result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   allowsEditing: true,
      //   aspect: [4, 3],
      //   quality: 0.8,
      // });
      //
      // if (!result.canceled) {
      //   // Upload to Supabase Storage
      //   const { data, error } = await supabase.storage
      //     .from('company-logos')
      //     .upload(`${userId}/logo.png`, {
      //       uri: result.assets[0].uri,
      //       type: 'image/png',
      //       name: 'logo.png',
      //     });
      //
      //   if (error) throw error;
      //
      //   setCompanyLogo(result.assets[0].uri);
      //   Alert.alert('Success', 'Company logo uploaded successfully!');
      // }

      // Temporary: Simulate upload for UI demonstration
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCompanyLogo('https://via.placeholder.com/150');
        Alert.alert('Success', 'Logo uploaded successfully!\n\n(Demo mode - backend not connected)');
      }, 1000);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to upload logo. Please try again.');
    }
  };

  const handleRemoveLogo = () => {
    Alert.alert(
      'Remove Logo',
      'Are you sure you want to remove your company logo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Backend developer - Delete from Supabase Storage
            setCompanyLogo(null);
            Alert.alert('Logo Removed', 'Your company logo has been removed.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.container}>
        {/* Subscription & Billing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription & Billing</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💼 Manage your subscription plan, billing details, and payment methods
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Subscription');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>

        {/* Company Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Information</Text>

        {/* Company Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.label}>Company Logo</Text>
          <View style={styles.logoContainer}>
            {companyLogo ? (
              <View style={styles.logoPreview}>
                <Image source={{ uri: companyLogo }} style={styles.logoImage} />
                <TouchableOpacity
                  style={styles.removeLogoButton}
                  onPress={handleRemoveLogo}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeLogoText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderIcon}>🏢</Text>
                <Text style={styles.logoPlaceholderText}>No logo uploaded</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={handleUploadLogo}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {companyLogo ? 'Change Logo' : 'Upload Logo'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            📸 Logo will appear on PDF estimates and invoices
          </Text>
        </View>

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

        {/* PDF Pricing Options */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>PDF Detailed Pricing</Text>
            <Text style={styles.settingDescription}>
              {pdfDetailedPricing
                ? 'Show line-by-line pricing on PDFs'
                : 'Show only grand total on PDFs'}
            </Text>
          </View>
          <Switch
            value={pdfDetailedPricing}
            onValueChange={(value) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPdfDetailedPricing(value);
            }}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={pdfDetailedPricing ? Colors.primary : Colors.backgroundGray}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📄 Detailed pricing shows materials, labor, and itemized costs per measurement.
            Non-detailed pricing shows only the final total amount.
          </Text>
        </View>

        {/* Multi-Tax Rate Management */}
        <View style={styles.subsectionHeader}>
          <Text style={styles.subsectionTitle}>Tax Rates</Text>
        </View>

        {taxRates.map((taxRate, index) => (
          <View key={taxRate.id} style={styles.taxRateCard}>
            <View style={styles.taxRateInfo}>
              <Text style={styles.taxRateName}>
                {taxRate.name}
                {taxRate.isDefault && <Text style={styles.defaultBadge}> • DEFAULT</Text>}
              </Text>
              <Text style={styles.taxRateValue}>{taxRate.rate.toFixed(2)}%</Text>
            </View>
            {!taxRate.isDefault && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(
                    'Delete Tax Rate',
                    `Remove ${taxRate.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                          setTaxRates(taxRates.filter(tr => tr.id !== taxRate.id));
                        },
                      },
                    ]
                  );
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.prompt(
              'Add Tax Rate',
              'Enter tax rate name:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Next',
                  onPress: (name?: string) => {
                    if (name) {
                      Alert.prompt(
                        'Add Tax Rate',
                        'Enter tax rate percentage:',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Add',
                            onPress: (rate?: string) => {
                              const rateNum = parseFloat(rate || '0');
                              if (rateNum > 0) {
                                setTaxRates([
                                  ...taxRates,
                                  {
                                    id: Date.now().toString(),
                                    name: name,
                                    rate: rateNum,
                                    isDefault: false,
                                  },
                                ]);
                              }
                            },
                          },
                        ],
                        'plain-text',
                        '',
                        'decimal-pad'
                      );
                    }
                  },
                },
              ],
              'plain-text'
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>+ Add Tax Rate</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Add different tax rates for various locations or product types.
            Select the applicable rate when creating estimates.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
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
        <Text style={styles.sectionTitle}>Bluetooth Measurement Devices</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📏 Supported devices: Bosch GLM series, Leica DISTO series
          </Text>
        </View>

        {/* Connected Device */}
        {connectedDevice && (
          <View style={[styles.deviceCard, { backgroundColor: Colors.primaryLight + '20' }]}>
            <View style={[styles.deviceIcon, { backgroundColor: Colors.success }]}>
              <Text style={styles.deviceIconText}>✓</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{connectedDevice}</Text>
              <Text style={[styles.deviceStatus, { color: Colors.success }]}>
                Connected and ready
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleDisconnectDevice}
              style={styles.disconnectButton}
              activeOpacity={0.7}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* No Device Connected */}
        {!connectedDevice && availableDevices.length === 0 && !isScanning && (
          <View style={styles.deviceCard}>
            <View style={styles.deviceIcon}>
              <Text style={styles.deviceIconText}>BT</Text>
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>No devices connected</Text>
              <Text style={styles.deviceStatus}>
                Scan for Bosch GLM or Leica DISTO devices
              </Text>
            </View>
          </View>
        )}

        {/* Available Devices List */}
        {availableDevices.length > 0 && (
          <View>
            <Text style={styles.deviceListTitle}>Available Devices:</Text>
            {availableDevices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={styles.availableDeviceCard}
                onPress={() => handleConnectDevice(device.id, device.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.deviceIcon, { backgroundColor: Colors.info }]}>
                  <Text style={styles.deviceIconText}>📏</Text>
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceStatus}>Tap to connect</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Scan Button */}
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonDisabled]}
          onPress={handleScanDevices}
          disabled={isScanning || !!connectedDevice}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : connectedDevice ? 'Device Connected' : 'Scan for Devices'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleExportData}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Export All Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Backup to Cloud
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleClearData}
          activeOpacity={0.7}
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
        activeOpacity={0.7}
      >
        <Text style={styles.saveButtonText}>Save All Settings</Text>
      </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
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
  deviceListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  availableDeviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.info,
  },
  disconnectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error,
    borderRadius: 6,
  },
  disconnectButtonText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  subsectionHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  taxRateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taxRateInfo: {
    flex: 1,
  },
  taxRateName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  taxRateValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  defaultBadge: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  logoSection: {
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  logoPreview: {
    position: 'relative',
    marginBottom: 12,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  removeLogoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  removeLogoText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoPlaceholderIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  logoPlaceholderText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  uploadButton: {
    width: 200,
  },
});

export default SettingsScreen;
