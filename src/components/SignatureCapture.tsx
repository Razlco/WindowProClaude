import React, { useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Colors } from '../constants';
// Note: You'll need to install react-native-signature-canvas
// For now, this is a placeholder component

interface SignatureCaptureProps {
  onSave: (signature: string) => void;
  onClear: () => void;
}

export const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  onSave,
  onClear,
}) => {
  // TODO: Implement actual signature capture with react-native-signature-canvas
  // This is a placeholder implementation

  const handleSave = () => {
    // Placeholder: In real implementation, get base64 from signature canvas
    onSave('data:image/png;base64,placeholder');
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvas}>
        {/* TODO: Add SignatureCanvas component here */}
      </View>
      <View style={styles.buttons}>
        <Button title="Clear" onPress={onClear} color={Colors.error} />
        <Button title="Save" onPress={handleSave} color={Colors.success} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  canvas: {
    height: 200,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
