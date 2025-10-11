import { useState, useCallback } from 'react';
import { BluetoothDevice } from '../types';

export const useBluetooth = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [scanning, setScanning] = useState(false);

  const startScan = useCallback(async () => {
    setScanning(true);
    // TODO: Implement actual Bluetooth scanning with expo-bluetooth
    setTimeout(() => setScanning(false), 3000);
  }, []);

  const connectDevice = useCallback(async (device: BluetoothDevice) => {
    // TODO: Implement actual Bluetooth connection
    setConnectedDevice(device);
  }, []);

  const disconnectDevice = useCallback(async () => {
    setConnectedDevice(null);
  }, []);

  return {
    devices,
    connectedDevice,
    scanning,
    startScan,
    connectDevice,
    disconnectDevice,
  };
};
