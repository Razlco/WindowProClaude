import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants';
import { Lead, LeadStatus } from '../types';
import StorageService from '../services/StorageService';

const LeadsScreen = ({ navigation }: any) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New lead form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadAddress, setNewLeadAddress] = useState('');
  const [newLeadInterest, setNewLeadInterest] = useState('');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const loadedLeads = await StorageService.getAllLeads();

      // Sort by createdAt date, newest first
      const sortedLeads = loadedLeads.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setLeads(sortedLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      Alert.alert('Error', 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setNewLeadAddress('');
    setNewLeadInterest('');
    setNewLeadNotes('');
  };

  const handleAddLead = async () => {
    if (!newLeadName.trim()) {
      Alert.alert('Validation Error', 'Lead name is required');
      return;
    }
    if (!newLeadPhone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return;
    }
    if (!newLeadInterest.trim()) {
      Alert.alert('Validation Error', 'Interest/Service is required');
      return;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      email: newLeadEmail.trim() || undefined,
      address: newLeadAddress.trim() || undefined,
      interest: newLeadInterest.trim(),
      notes: newLeadNotes.trim() || undefined,
      status: LeadStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await StorageService.saveLead(newLead);
      setShowAddModal(false);
      resetForm();
      loadLeads();
      Alert.alert('Success', 'Lead added successfully');
    } catch (error) {
      console.error('Error saving lead:', error);
      Alert.alert('Error', 'Failed to save lead');
    }
  };

  const handleFollowUp = async (lead: Lead) => {
    const updatedLead = {
      ...lead,
      status: LeadStatus.FOLLOW_UP,
      updatedAt: new Date(),
    };

    try {
      await StorageService.saveLead(updatedLead);
      loadLeads();
      Alert.alert('Success', `${lead.name} marked for follow-up`);
    } catch (error) {
      console.error('Error updating lead:', error);
      Alert.alert('Error', 'Failed to update lead');
    }
  };

  const handleScheduleEstimate = async (lead: Lead) => {
    Alert.alert(
      'Schedule Estimate',
      `Convert ${lead.name} to an estimate?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Estimate',
          onPress: () => {
            // Navigate to NewJob with pre-filled customer data
            navigation.navigate('NewJob', {
              category: lead.interest,
              prefillCustomer: {
                name: lead.name,
                phone: lead.phone,
                email: lead.email || '',
                address: lead.address || '',
              },
            });
          },
        },
      ]
    );
  };

  const handleCancelLead = async (lead: Lead) => {
    Alert.alert(
      'Cancel Lead',
      `Are you sure you want to cancel ${lead.name}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const updatedLead = {
              ...lead,
              status: LeadStatus.CANCELLED,
              updatedAt: new Date(),
            };

            try {
              await StorageService.saveLead(updatedLead);
              loadLeads();
              Alert.alert('Success', 'Lead cancelled');
            } catch (error) {
              console.error('Error updating lead:', error);
              Alert.alert('Error', 'Failed to update lead');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: LeadStatus): string => {
    switch (status) {
      case LeadStatus.NEW:
        return Colors.info;
      case LeadStatus.CONTACTED:
        return Colors.primary;
      case LeadStatus.FOLLOW_UP:
        return Colors.warning;
      case LeadStatus.SCHEDULED:
        return Colors.success;
      case LeadStatus.CONVERTED:
        return Colors.success;
      case LeadStatus.CANCELLED:
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusLabel = (status: LeadStatus): string => {
    return status.replace('_', ' ');
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leads</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Leads List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading leads...</Text>
          </View>
        ) : leads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateText}>No leads yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add potential customers to track and follow up
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.emptyStateButtonText}>Add First Lead</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
            </Text>
            {leads.map((lead) => (
              <View key={lead.id} style={styles.leadCard}>
                {/* Lead Header */}
                <View style={styles.leadHeader}>
                  <Text style={styles.leadName}>{lead.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                      {getStatusLabel(lead.status)}
                    </Text>
                  </View>
                </View>

                {/* Lead Details */}
                <Text style={styles.leadDetail}>📞 {lead.phone}</Text>
                {lead.email && (
                  <Text style={styles.leadDetail}>📧 {lead.email}</Text>
                )}
                {lead.address && (
                  <Text style={styles.leadDetail}>📍 {lead.address}</Text>
                )}
                <Text style={styles.leadDetail}>💼 Interested in: {lead.interest}</Text>
                {lead.notes && (
                  <Text style={styles.leadNotes}>Note: {lead.notes}</Text>
                )}
                <Text style={styles.leadDate}>Added {formatDate(lead.createdAt)}</Text>

                {/* Action Buttons - Only show if not cancelled or converted */}
                {lead.status !== LeadStatus.CANCELLED && lead.status !== LeadStatus.CONVERTED && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonPrimary]}
                      onPress={() => handleFollowUp(lead)}
                    >
                      <Text style={styles.actionButtonText}>Follow Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonSuccess]}
                      onPress={() => handleScheduleEstimate(lead)}
                    >
                      <Text style={styles.actionButtonText}>Schedule Estimate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonDanger]}
                      onPress={() => handleCancelLead(lead)}
                    >
                      <Text style={styles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Lead Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Lead</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newLeadName}
                  onChangeText={setNewLeadName}
                  placeholder="Customer name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={newLeadPhone}
                  onChangeText={setNewLeadPhone}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={newLeadEmail}
                  onChangeText={setNewLeadEmail}
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={newLeadAddress}
                  onChangeText={setNewLeadAddress}
                  placeholder="123 Main St"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Interested In *</Text>
                <TextInput
                  style={styles.input}
                  value={newLeadInterest}
                  onChangeText={setNewLeadInterest}
                  placeholder="Windows, Glass, Doors, etc."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newLeadNotes}
                  onChangeText={setNewLeadNotes}
                  placeholder="Additional notes..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddLead}
              >
                <Text style={styles.saveButtonText}>Add Lead</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.background,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  leadCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leadName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  leadDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  leadNotes: {
    fontSize: 13,
    color: Colors.text,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 4,
  },
  leadDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    minWidth: 90,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  actionButtonSuccess: {
    backgroundColor: Colors.success,
  },
  actionButtonDanger: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  modalScroll: {
    padding: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeadsScreen;
