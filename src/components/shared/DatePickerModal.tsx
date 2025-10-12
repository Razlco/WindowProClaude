import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../constants';

interface DatePickerModalProps {
  visible: boolean;
  title: string;
  mode?: 'date' | 'time' | 'datetime';
  initialDate?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const DatePickerModal = ({
  visible,
  title,
  mode = 'datetime',
  initialDate = new Date(),
  onConfirm,
  onCancel,
}: DatePickerModalProps) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && date) {
        setSelectedDate(date);
        onConfirm(date);
      } else {
        onCancel();
      }
    } else {
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  if (Platform.OS === 'android') {
    return showPicker ? (
      <DateTimePicker
        value={selectedDate}
        mode={mode}
        display="default"
        onChange={handleDateChange}
      />
    ) : null;
  }

  // iOS Modal
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          <DateTimePicker
            value={selectedDate}
            mode={mode}
            display="spinner"
            onChange={handleDateChange}
            style={styles.datePicker}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  confirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});

export default DatePickerModal;
