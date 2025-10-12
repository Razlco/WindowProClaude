import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActionSheetIOS,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '../constants';
import { Job, JobStatus, WorkflowStatus } from '../types';
import StorageService from '../services/StorageService';
import { SwipeableProjectCard, CollapsibleSection } from '../components/projects';
import { DatePickerModal, ProjectCardSkeleton } from '../components/shared';

type ViewMode = 'compact' | 'detailed';
type DatePickerType = 'appointment' | 'followup' | 'install';
type QuickFilter = 'all' | 'dueToday' | 'followUpsWeek' | 'materialsNeeded' | 'readyToInstall';

const ProjectsScreen = ({ navigation }: any) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'all'>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [groupByStatus, setGroupByStatus] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(20);

  // Date picker state
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<DatePickerType>('appointment');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [pendingWorkflowStatus, setPendingWorkflowStatus] = useState<WorkflowStatus | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    // Apply search and filter
    let result = jobs;

    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(job => job.status === activeFilter);
    }

    // Apply quick filters
    if (quickFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);

      switch (quickFilter) {
        case 'dueToday':
          result = result.filter(job => {
            const appointmentDate = job.appointmentDate ? new Date(job.appointmentDate) : null;
            const installDate = job.installDate ? new Date(job.installDate) : null;
            return (
              (appointmentDate && appointmentDate >= today && appointmentDate <= endOfToday) ||
              (installDate && installDate >= today && installDate <= endOfToday)
            );
          });
          break;
        case 'followUpsWeek':
          result = result.filter(job => {
            const followUpDate = job.followUpDate ? new Date(job.followUpDate) : null;
            return followUpDate && followUpDate >= today && followUpDate <= endOfWeek;
          });
          break;
        case 'materialsNeeded':
          result = result.filter(job => job.workflowStatus === WorkflowStatus.MATERIALS_NEEDED);
          break;
        case 'readyToInstall':
          result = result.filter(job => job.workflowStatus === WorkflowStatus.SCHEDULED_FOR_INSTALL);
          break;
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((job) => {
        const customerName = job.customer.name.toLowerCase();
        const customerEmail = job.customer.email?.toLowerCase() || '';
        const customerPhone = job.customer.phone.toLowerCase();
        const customerAddress = job.customer.address.toLowerCase();

        return (
          customerName.includes(query) ||
          customerEmail.includes(query) ||
          customerPhone.includes(query) ||
          customerAddress.includes(query) ||
          job.jobNumber.toLowerCase().includes(query)
        );
      });
    }

    setFilteredJobs(result);
  }, [searchQuery, jobs, activeFilter, quickFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const loadedJobs = await StorageService.getAllJobs();

      // Sort by createdAt date, newest first
      const sortedJobs = loadedJobs.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setJobs(sortedJobs);
      setFilteredJobs(sortedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleJobPress = useCallback((jobId: string) => {
    navigation.navigate('JobDetails', { jobId });
  }, [navigation]);

  const handleStatusPress = useCallback((job: Job) => {
    const statusOptions = Object.values(JobStatus).map(status => ({
      label: status,
      value: status,
    }));

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Update Project Status',
          options: [...statusOptions.map(o => o.label), 'Cancel'],
          cancelButtonIndex: statusOptions.length,
        },
        async (buttonIndex) => {
          if (buttonIndex < statusOptions.length) {
            await updateJobStatus(job, statusOptions[buttonIndex].value);
          }
        }
      );
    } else {
      // Android Alert
      Alert.alert(
        'Update Project Status',
        `Current status: ${job.status}`,
        [
          ...statusOptions.map(option => ({
            text: option.label,
            onPress: () => updateJobStatus(job, option.value),
          })),
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  }, []);

  const handleWorkflowPress = useCallback((job: Job) => {
    const workflowOptions = [
      { label: '📅 Schedule Estimate', value: WorkflowStatus.ESTIMATE_SCHEDULED, needsDate: true, dateType: 'appointment' },
      { label: '📦 Materials Need Ordered', value: WorkflowStatus.MATERIALS_NEEDED },
      { label: '📏 Installer Measurements', value: WorkflowStatus.INSTALLER_MEASUREMENTS },
      { label: '🔨 Scheduled for Install', value: WorkflowStatus.SCHEDULED_FOR_INSTALL, needsDate: true, dateType: 'install' },
      { label: '🔔 Need to Follow Up', value: WorkflowStatus.FOLLOW_UP_NEEDED, needsDate: true, dateType: 'followup' },
      { label: '✕ Clear Status', value: WorkflowStatus.NONE },
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Update Workflow Status',
          options: [...workflowOptions.map(o => o.label), 'Cancel'],
          cancelButtonIndex: workflowOptions.length,
          destructiveButtonIndex: workflowOptions.length - 1,
        },
        async (buttonIndex) => {
          if (buttonIndex < workflowOptions.length) {
            const option = workflowOptions[buttonIndex];
            await handleWorkflowChange(job, option.value, option.needsDate, option.dateType as DatePickerType);
          }
        }
      );
    } else {
      Alert.alert(
        'Update Workflow Status',
        '',
        [
          ...workflowOptions.map(option => ({
            text: option.label,
            onPress: () => handleWorkflowChange(job, option.value, option.needsDate, option.dateType as DatePickerType),
            style: (option.value === WorkflowStatus.NONE ? 'destructive' : 'default') as 'cancel' | 'default' | 'destructive',
          })),
          { text: 'Cancel', style: 'cancel' as 'cancel' | 'default' | 'destructive' },
        ]
      );
    }
  }, []);

  const handleWorkflowChange = async (
    job: Job,
    newStatus: WorkflowStatus,
    needsDate?: boolean,
    dateType?: DatePickerType
  ) => {
    if (needsDate && dateType) {
      // Show date picker
      setSelectedJob(job);
      setPendingWorkflowStatus(newStatus);
      setDatePickerType(dateType);
      setDatePickerVisible(true);
      return;
    }

    // Update immediately if no date needed
    await updateWorkflowStatus(job, newStatus);
  };

  const handleDateConfirm = async (date: Date) => {
    if (!selectedJob || !pendingWorkflowStatus) return;

    const updatedJob = { ...selectedJob };

    // Set the appropriate date field
    switch (datePickerType) {
      case 'appointment':
        updatedJob.appointmentDate = date;
        break;
      case 'followup':
        updatedJob.followUpDate = date;
        break;
      case 'install':
        updatedJob.installDate = date;
        break;
    }

    updatedJob.workflowStatus = pendingWorkflowStatus;
    updatedJob.updatedAt = new Date();

    try {
      await StorageService.saveJob(updatedJob);
      setDatePickerVisible(false);
      setSelectedJob(null);
      setPendingWorkflowStatus(null);
      await loadJobs();
      Alert.alert('Success', 'Workflow status updated');
    } catch (error) {
      console.error('Error updating workflow:', error);
      Alert.alert('Error', 'Failed to update workflow status');
    }
  };

  const updateJobStatus = async (job: Job, newStatus: JobStatus) => {
    const updatedJob = {
      ...job,
      status: newStatus,
      updatedAt: new Date(),
    };

    try {
      await StorageService.saveJob(updatedJob);
      await loadJobs();
      Alert.alert('Success', `Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const updateWorkflowStatus = async (job: Job, newStatus: WorkflowStatus) => {
    const updatedJob = {
      ...job,
      workflowStatus: newStatus === WorkflowStatus.NONE ? undefined : newStatus,
      updatedAt: new Date(),
    };

    try {
      await StorageService.saveJob(updatedJob);
      await loadJobs();
      Alert.alert('Success', 'Workflow status updated');
    } catch (error) {
      console.error('Error updating workflow:', error);
      Alert.alert('Error', 'Failed to update workflow status');
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<JobStatus | 'all', number> = {
      all: jobs.length,
      [JobStatus.DRAFT]: 0,
      [JobStatus.QUOTED]: 0,
      [JobStatus.APPROVED]: 0,
      [JobStatus.IN_PROGRESS]: 0,
      [JobStatus.COMPLETED]: 0,
      [JobStatus.CANCELLED]: 0,
    };

    jobs.forEach(job => {
      counts[job.status]++;
    });

    return counts;
  }, [jobs]);

  // Group jobs by status
  const groupedJobs = useMemo(() => {
    if (!groupByStatus) return null;

    const groups: Record<JobStatus, Job[]> = {
      [JobStatus.DRAFT]: [],
      [JobStatus.QUOTED]: [],
      [JobStatus.APPROVED]: [],
      [JobStatus.IN_PROGRESS]: [],
      [JobStatus.COMPLETED]: [],
      [JobStatus.CANCELLED]: [],
    };

    filteredJobs.forEach(job => {
      groups[job.status].push(job);
    });

    return groups;
  }, [filteredJobs, groupByStatus]);

  const renderItem = useCallback(({ item }: { item: Job }) => (
    <SwipeableProjectCard
      job={item}
      viewMode={viewMode}
      onPress={handleJobPress}
      onStatusPress={handleStatusPress}
      onWorkflowPress={handleWorkflowPress}
    />
  ), [viewMode, handleJobPress, handleStatusPress, handleWorkflowPress]);

  const getDatePickerTitle = () => {
    switch (datePickerType) {
      case 'appointment':
        return 'Select Estimate Appointment';
      case 'followup':
        return 'Select Follow-up Date';
      case 'install':
        return 'Select Installation Date';
      default:
        return 'Select Date';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projects</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setGroupByStatus(!groupByStatus)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewModeIcon}>{groupByStatus ? '▤' : '▥'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setViewMode(prev => prev === 'compact' ? 'detailed' : 'compact')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewModeIcon}>{viewMode === 'compact' ? '▦' : '☰'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, address, email, phone, or job #..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Filter Buttons */}
      <View style={styles.quickFilterContainer}>
        <TouchableOpacity
          style={[styles.quickFilterButton, quickFilter === 'all' && styles.quickFilterButtonActive]}
          onPress={() => setQuickFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.quickFilterText, quickFilter === 'all' && styles.quickFilterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickFilterButton, quickFilter === 'dueToday' && styles.quickFilterButtonActive]}
          onPress={() => setQuickFilter('dueToday')}
          activeOpacity={0.7}
        >
          <Text style={[styles.quickFilterText, quickFilter === 'dueToday' && styles.quickFilterTextActive]}>📅 Due Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickFilterButton, quickFilter === 'followUpsWeek' && styles.quickFilterButtonActive]}
          onPress={() => setQuickFilter('followUpsWeek')}
          activeOpacity={0.7}
        >
          <Text style={[styles.quickFilterText, quickFilter === 'followUpsWeek' && styles.quickFilterTextActive]}>🔔 Follow-ups</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickFilterButton, quickFilter === 'materialsNeeded' && styles.quickFilterButtonActive]}
          onPress={() => setQuickFilter('materialsNeeded')}
          activeOpacity={0.7}
        >
          <Text style={[styles.quickFilterText, quickFilter === 'materialsNeeded' && styles.quickFilterTextActive]}>📦 Materials</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickFilterButton, quickFilter === 'readyToInstall' && styles.quickFilterButtonActive]}
          onPress={() => setQuickFilter('readyToInstall')}
          activeOpacity={0.7}
        >
          <Text style={[styles.quickFilterText, quickFilter === 'readyToInstall' && styles.quickFilterTextActive]}>🔨 Ready</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
            All ({statusCounts.all})
          </Text>
        </TouchableOpacity>
        {Object.values(JobStatus).map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, activeFilter === status && styles.filterChipActive]}
            onPress={() => setActiveFilter(status)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, activeFilter === status && styles.filterChipTextActive]}>
              {status} ({statusCounts[status]})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Projects List */}
      {loading ? (
        <ScrollView style={styles.groupedContainer} contentContainerStyle={styles.listContent}>
          {[1, 2, 3, 4, 5].map((item) => (
            <ProjectCardSkeleton key={item} viewMode={viewMode} />
          ))}
        </ScrollView>
      ) : filteredJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📁</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery || activeFilter !== 'all' || quickFilter !== 'all' ? 'No projects match your criteria' : 'No projects yet'}
          </Text>
          {!searchQuery && activeFilter === 'all' && quickFilter === 'all' && (
            <Text style={styles.emptyStateSubtext}>
              Start by creating a new estimate from the home screen
            </Text>
          )}
        </View>
      ) : groupByStatus && groupedJobs ? (
        <ScrollView
          style={styles.groupedContainer}
          contentContainerStyle={styles.groupedContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadJobs} />}
        >
          {Object.entries(groupedJobs)
            .filter(([_, jobs]) => jobs.length > 0)
            .map(([status, jobs]) => {
              const statusColors: Record<JobStatus, string> = {
                [JobStatus.DRAFT]: Colors.textSecondary,
                [JobStatus.QUOTED]: Colors.warning,
                [JobStatus.APPROVED]: Colors.success,
                [JobStatus.IN_PROGRESS]: Colors.primary,
                [JobStatus.COMPLETED]: Colors.success,
                [JobStatus.CANCELLED]: Colors.error,
              };

              const statusIcons: Record<JobStatus, string> = {
                [JobStatus.DRAFT]: '📝',
                [JobStatus.QUOTED]: '💰',
                [JobStatus.APPROVED]: '✓',
                [JobStatus.IN_PROGRESS]: '🔨',
                [JobStatus.COMPLETED]: '✅',
                [JobStatus.CANCELLED]: '✕',
              };

              return (
                <CollapsibleSection
                  key={status}
                  title={status}
                  count={jobs.length}
                  icon={statusIcons[status as JobStatus]}
                  color={statusColors[status as JobStatus]}
                  defaultExpanded={status !== JobStatus.CANCELLED && status !== JobStatus.COMPLETED}
                >
                  {jobs.slice(0, displayLimit).map(job => (
                    <View key={job.id} style={styles.cardWrapper}>
                      {renderItem({ item: job })}
                    </View>
                  ))}
                  {jobs.length > displayLimit && (
                    <TouchableOpacity
                      style={styles.loadMoreButton}
                      onPress={() => setDisplayLimit(prev => prev + 20)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.loadMoreText}>Load More ({jobs.length - displayLimit} remaining)</Text>
                    </TouchableOpacity>
                  )}
                </CollapsibleSection>
              );
            })}
        </ScrollView>
      ) : (
        <FlashList
          data={filteredJobs.slice(0, displayLimit)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadJobs}
          ListFooterComponent={
            filteredJobs.length > displayLimit ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => setDisplayLimit(prev => prev + 20)}
                activeOpacity={0.7}
              >
                <Text style={styles.loadMoreText}>Load More ({filteredJobs.length - displayLimit} remaining)</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={datePickerVisible}
        title={getDatePickerTitle()}
        mode="datetime"
        initialDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => {
          setDatePickerVisible(false);
          setSelectedJob(null);
          setPendingWorkflowStatus(null);
        }}
      />
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeIcon: {
    fontSize: 20,
    color: Colors.primary,
  },
  searchContainer: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemSeparator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
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
  },
  quickFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  quickFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickFilterButtonActive: {
    backgroundColor: Colors.info,
    borderColor: Colors.info,
  },
  quickFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  quickFilterTextActive: {
    color: Colors.background,
  },
  groupedContainer: {
    flex: 1,
  },
  groupedContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  loadMoreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  loadMoreText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProjectsScreen;
