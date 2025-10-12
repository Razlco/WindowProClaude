import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants';
import { Job, JobStatus, WorkflowStatus } from '../../types';

interface ProjectCardProps {
  job: Job;
  viewMode: 'compact' | 'detailed';
  onPress: (jobId: string) => void;
  onStatusPress?: (job: Job) => void;
  onWorkflowPress?: (job: Job) => void;
}

const ProjectCard = memo(
  ({ job, viewMode, onPress, onStatusPress, onWorkflowPress }: ProjectCardProps) => {
    const getStatusColor = (status: JobStatus): string => {
      switch (status) {
        case JobStatus.DRAFT:
          return Colors.textSecondary;
        case JobStatus.QUOTED:
          return Colors.info;
        case JobStatus.APPROVED:
          return Colors.success;
        case JobStatus.IN_PROGRESS:
          return Colors.primary;
        case JobStatus.COMPLETED:
          return Colors.success;
        case JobStatus.CANCELLED:
          return Colors.error;
        default:
          return Colors.textSecondary;
      }
    };

    const getWorkflowConfig = (status: WorkflowStatus) => {
      switch (status) {
        case WorkflowStatus.ESTIMATE_SCHEDULED:
          return { label: 'Estimate', icon: '📅', color: '#3B82F6' };
        case WorkflowStatus.MATERIALS_NEEDED:
          return { label: 'Materials', icon: '📦', color: '#F59E0B' };
        case WorkflowStatus.INSTALLER_MEASUREMENTS:
          return { label: 'Measurements', icon: '📏', color: '#8B5CF6' };
        case WorkflowStatus.SCHEDULED_FOR_INSTALL:
          return { label: 'Install', icon: '🔨', color: '#10B981' };
        case WorkflowStatus.FOLLOW_UP_NEEDED:
          return { label: 'Follow Up', icon: '🔔', color: '#EF4444' };
        default:
          return null;
      }
    };

    const formatDate = (date: Date): string => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const formatDateTime = (date: Date): string => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    const workflowConfig =
      job.workflowStatus && job.workflowStatus !== WorkflowStatus.NONE
        ? getWorkflowConfig(job.workflowStatus)
        : null;

    if (viewMode === 'compact') {
      return (
        <TouchableOpacity
          style={styles.compactCard}
          onPress={() => onPress(job.id)}
          activeOpacity={0.7}
        >
          <View style={styles.compactHeader}>
            <Text style={styles.compactJobNumber}>{job.jobNumber}</Text>
            <View style={styles.compactBadges}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onStatusPress?.(job);
                }}
              >
                <View style={(styles as any)[`compactStatusBadge${job.status.replace(/_/g, '')}`] || styles.compactStatusBadge}>
                  <Text style={(styles as any)[`compactStatusText${job.status.replace(/_/g, '')}`] || styles.compactStatusText}>
                    {job.status}
                  </Text>
                </View>
              </TouchableOpacity>
              {workflowConfig && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onWorkflowPress?.(job);
                  }}
                >
                  <View style={(styles as any)[`compactWorkflowBadge${job.workflowStatus || ''}`] || styles.compactWorkflowBadge}>
                    <Text style={styles.compactWorkflowIcon}>{workflowConfig.icon}</Text>
                    <Text style={(styles as any)[`compactWorkflowText${job.workflowStatus || ''}`] || styles.compactWorkflowText}>
                      {workflowConfig.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={styles.compactCustomerName}>{job.customer.name}</Text>
          <View style={styles.compactFooter}>
            <Text style={styles.compactDetail}>
              {job.measurements.length} items • {formatCurrency(job.pricing.total)}
            </Text>
            <Text style={styles.compactDate}>{formatDate(job.createdAt)}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Detailed view
    return (
      <TouchableOpacity
        style={styles.detailedCard}
        onPress={() => onPress(job.id)}
        activeOpacity={0.7}
      >
        {/* Header with status badges */}
        <View style={styles.detailedHeader}>
          <Text style={styles.detailedJobNumber}>{job.jobNumber}</Text>
          <View style={styles.detailedBadges}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onStatusPress?.(job);
              }}
            >
              <View style={(styles as any)[`detailedStatusBadge${job.status.replace(/_/g, '')}`] || styles.detailedStatusBadge}>
                <Text style={(styles as any)[`detailedStatusText${job.status.replace(/_/g, '')}`] || styles.detailedStatusText}>
                  {job.status}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workflow Status */}
        {workflowConfig && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onWorkflowPress?.(job);
            }}
            style={{ alignSelf: 'flex-start', marginTop: 8 }}
          >
            <View style={(styles as any)[`workflowBadge${job.workflowStatus || ''}`] || styles.workflowBadge}>
              <Text style={styles.workflowIcon}>{workflowConfig.icon}</Text>
              <Text style={(styles as any)[`workflowText${job.workflowStatus || ''}`] || styles.workflowText}>
                {workflowConfig.label}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Customer Info */}
        <Text style={styles.detailedCustomerName}>{job.customer.name}</Text>
        <Text style={styles.detailedCustomerDetail}>📍 {job.customer.address}</Text>
        {job.customer.phone && (
          <Text style={styles.detailedCustomerDetail}>📞 {job.customer.phone}</Text>
        )}

        {/* Appointment Date */}
        {job.appointmentDate && (
          <Text style={styles.appointmentText}>
            📅 Appointment: {formatDateTime(job.appointmentDate)}
          </Text>
        )}

        {/* Workflow Notes */}
        {job.workflowStatusNotes && (
          <Text style={styles.workflowNotes}>Note: {job.workflowStatusNotes}</Text>
        )}

        {/* Footer */}
        <View style={styles.detailedFooter}>
          <View style={styles.detailedFooterItem}>
            <Text style={styles.detailedFooterLabel}>Items:</Text>
            <Text style={styles.detailedFooterValue}>{job.measurements.length}</Text>
          </View>
          <View style={styles.detailedFooterItem}>
            <Text style={styles.detailedFooterLabel}>Total:</Text>
            <Text style={styles.detailedFooterValue}>{formatCurrency(job.pricing.total)}</Text>
          </View>
          <View style={styles.detailedFooterItem}>
            <Text style={styles.detailedFooterLabel}>Date:</Text>
            <Text style={styles.detailedFooterValue}>{formatDate(job.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if job data or view mode changed
    return (
      prevProps.job.id === nextProps.job.id &&
      prevProps.job.updatedAt === nextProps.job.updatedAt &&
      prevProps.viewMode === nextProps.viewMode
    );
  }
);

const styles = StyleSheet.create({
  // Compact Card Styles
  compactCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactJobNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  compactBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  compactStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  compactStatusBadgeDRAFT: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.textSecondary + '20',
  },
  compactStatusBadgeQUOTED: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.info + '20',
  },
  compactStatusBadgeAPPROVED: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.success + '20',
  },
  compactStatusBadgeINPROGRESS: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.primary + '20',
  },
  compactStatusBadgeCOMPLETED: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.success + '20',
  },
  compactStatusBadgeCANCELLED: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.error + '20',
  },
  compactStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  compactStatusTextDRAFT: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
  compactStatusTextQUOTED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.info,
  },
  compactStatusTextAPPROVED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.success,
  },
  compactStatusTextINPROGRESS: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  compactStatusTextCOMPLETED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.success,
  },
  compactStatusTextCANCELLED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.error,
  },
  compactWorkflowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  compactWorkflowBadgeESTIMATE_SCHEDULED: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#3B82F6' + '20',
  },
  compactWorkflowBadgeMATERIALS_NEEDED: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#F59E0B' + '20',
  },
  compactWorkflowBadgeINSTALLER_MEASUREMENTS: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#8B5CF6' + '20',
  },
  compactWorkflowBadgeSCHEDULED_FOR_INSTALL: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#10B981' + '20',
  },
  compactWorkflowBadgeFOLLOW_UP_NEEDED: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    backgroundColor: '#EF4444' + '20',
  },
  compactWorkflowIcon: {
    fontSize: 12,
  },
  compactWorkflowText: {
    fontSize: 12,
    fontWeight: '600',
  },
  compactWorkflowTextESTIMATE_SCHEDULED: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  compactWorkflowTextMATERIALS_NEEDED: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  compactWorkflowTextINSTALLER_MEASUREMENTS: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  compactWorkflowTextSCHEDULED_FOR_INSTALL: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  compactWorkflowTextFOLLOW_UP_NEEDED: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  compactCustomerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  compactDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Detailed Card Styles
  detailedCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailedJobNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  detailedBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  detailedStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailedStatusBadgeDRAFT: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.textSecondary + '20',
  },
  detailedStatusBadgeQUOTED: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.info + '20',
  },
  detailedStatusBadgeAPPROVED: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.success + '20',
  },
  detailedStatusBadgeINPROGRESS: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.primary + '20',
  },
  detailedStatusBadgeCOMPLETED: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.success + '20',
  },
  detailedStatusBadgeCANCELLED: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.error + '20',
  },
  detailedStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailedStatusTextDRAFT: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: Colors.textSecondary,
  },
  detailedStatusTextQUOTED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: Colors.info,
  },
  detailedStatusTextAPPROVED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: Colors.success,
  },
  detailedStatusTextINPROGRESS: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: Colors.primary,
  },
  detailedStatusTextCOMPLETED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: Colors.success,
  },
  detailedStatusTextCANCELLED: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: Colors.error,
  },
  workflowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  workflowBadgeESTIMATE_SCHEDULED: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    backgroundColor: '#3B82F6' + '20',
  },
  workflowBadgeMATERIALS_NEEDED: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    backgroundColor: '#F59E0B' + '20',
  },
  workflowBadgeINSTALLER_MEASUREMENTS: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    backgroundColor: '#8B5CF6' + '20',
  },
  workflowBadgeSCHEDULED_FOR_INSTALL: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    backgroundColor: '#10B981' + '20',
  },
  workflowBadgeFOLLOW_UP_NEEDED: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    backgroundColor: '#EF4444' + '20',
  },
  workflowIcon: {
    fontSize: 14,
  },
  workflowText: {
    fontSize: 12,
    fontWeight: '600',
  },
  workflowTextESTIMATE_SCHEDULED: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  workflowTextMATERIALS_NEEDED: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  workflowTextINSTALLER_MEASUREMENTS: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  workflowTextSCHEDULED_FOR_INSTALL: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  workflowTextFOLLOW_UP_NEEDED: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  detailedCustomerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  detailedCustomerDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appointmentText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 8,
  },
  workflowNotes: {
    fontSize: 12,
    color: Colors.text,
    fontStyle: 'italic',
    marginTop: 6,
    paddingLeft: 4,
  },
  detailedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailedFooterItem: {
    flex: 1,
  },
  detailedFooterLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailedFooterValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default ProjectCard;
