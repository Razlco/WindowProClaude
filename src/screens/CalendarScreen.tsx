import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../constants';
import { useJobStorage } from '../hooks';
import { formatCalendarDate, formatDisplayDate } from '../utils';
import { Job, WorkflowStatus } from '../types';
import { SkeletonLoader } from '../components/shared';

type DateEvent = {
  job: Job;
  type: 'appointment' | 'followup' | 'install';
  color: string;
  label: string;
};

const CalendarScreen = ({ navigation }: any) => {
  const { jobs } = useJobStorage();
  const [selectedDate, setSelectedDate] = useState(formatCalendarDate(new Date()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to show skeleton briefly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Create marked dates from workflow dates
  const markedDates = useMemo(() => {
    const marked: any = {};
    const dateEvents: Record<string, DateEvent[]> = {};

    jobs.forEach((job) => {
      // Check appointment date
      if (job.appointmentDate) {
        const dateStr = formatCalendarDate(job.appointmentDate);
        if (!dateEvents[dateStr]) dateEvents[dateStr] = [];
        dateEvents[dateStr].push({
          job,
          type: 'appointment',
          color: Colors.info,
          label: 'Estimate Appointment',
        });
      }

      // Check follow-up date
      if (job.followUpDate) {
        const dateStr = formatCalendarDate(job.followUpDate);
        if (!dateEvents[dateStr]) dateEvents[dateStr] = [];
        dateEvents[dateStr].push({
          job,
          type: 'followup',
          color: Colors.warning,
          label: 'Follow-up',
        });
      }

      // Check install date
      if (job.installDate) {
        const dateStr = formatCalendarDate(job.installDate);
        if (!dateEvents[dateStr]) dateEvents[dateStr] = [];
        dateEvents[dateStr].push({
          job,
          type: 'install',
          color: Colors.success,
          label: 'Installation',
        });
      }

      // Legacy scheduled date support
      if (job.scheduledDate) {
        const dateStr = formatCalendarDate(job.scheduledDate);
        if (!dateEvents[dateStr]) dateEvents[dateStr] = [];
        dateEvents[dateStr].push({
          job,
          type: 'appointment',
          color: Colors.primary,
          label: 'Scheduled',
        });
      }
    });

    // Convert events to marked dates
    Object.entries(dateEvents).forEach(([dateStr, events]) => {
      const dots = events.map(event => ({ color: event.color }));
      marked[dateStr] = {
        dots,
        events,
      };
    });

    // Add selected date styling
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = Colors.primary;
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: Colors.primary,
        events: [],
      };
    }

    return marked;
  }, [jobs, selectedDate]);

  // Get events for selected date
  const selectedDateEvents: DateEvent[] = markedDates[selectedDate]?.events || [];

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetails', { jobId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {loading ? (
          <>
            {/* Calendar Skeleton */}
            <View style={styles.calendarSection}>
              {/* Legend skeleton */}
              <View style={styles.legendContainer}>
                {[1, 2, 3].map(i => (
                  <View key={i} style={styles.legendItem}>
                    <SkeletonLoader width={8} height={8} borderRadius={4} />
                    <SkeletonLoader width={80} height={12} borderRadius={4} />
                  </View>
                ))}
              </View>
              {/* Calendar skeleton */}
              <View style={{ padding: 16 }}>
                <SkeletonLoader width={150} height={20} borderRadius={4} style={{ marginBottom: 16, alignSelf: 'center' }} />
                <SkeletonLoader width="100%" height={300} borderRadius={8} />
              </View>
            </View>

            {/* Events skeleton */}
            <View style={styles.section}>
              <SkeletonLoader width={200} height={18} borderRadius={4} style={{ marginBottom: 16 }} />
              {[1, 2, 3].map(i => (
                <View key={i} style={[styles.eventCard, { marginBottom: 12 }]}>
                  <SkeletonLoader width={4} height={100} />
                  <View style={{ flex: 1, padding: 16 }}>
                    <SkeletonLoader width={120} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonLoader width="90%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonLoader width="70%" height={14} borderRadius={4} />
                  </View>
                </View>
              ))}
            </View>

            {/* Stats skeleton */}
            <View style={styles.section}>
              <SkeletonLoader width={150} height={18} borderRadius={4} style={{ marginBottom: 16 }} />
              <View style={styles.statsGrid}>
                {[1, 2, 3, 4].map(i => (
                  <View key={i} style={styles.statCard}>
                    <SkeletonLoader width={60} height={32} borderRadius={4} style={{ marginBottom: 8, alignSelf: 'center' }} />
                    <SkeletonLoader width={80} height={12} borderRadius={4} style={{ alignSelf: 'center' }} />
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </>
        ) : (
          <>
            <View style={styles.calendarSection}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotInfo} />
                  <Text style={styles.legendText}>Appointment</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotSuccess} />
                  <Text style={styles.legendText}>Installation</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotWarning} />
                  <Text style={styles.legendText}>Follow-up</Text>
                </View>
              </View>
            <Calendar
              current={selectedDate}
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              markingType="multi-dot"
              theme={{
                backgroundColor: Colors.background,
                calendarBackground: Colors.background,
                textSectionTitleColor: Colors.textSecondary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: Colors.background,
                todayTextColor: Colors.primary,
                dayTextColor: Colors.text,
                textDisabledColor: Colors.textLight,
                dotColor: Colors.primary,
                selectedDotColor: Colors.background,
                arrowColor: Colors.primary,
                monthTextColor: Colors.text,
                indicatorColor: Colors.primary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Events on {formatDisplayDate(selectedDate)}
            </Text>

            {selectedDateEvents.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No events scheduled for this date</Text>
                <Text style={styles.emptySubtext}>
                  Appointments, follow-ups, and installations will appear here
                </Text>
              </View>
            ) : (
              selectedDateEvents.map((event, index) => (
                <TouchableOpacity
                  key={`${event.job.id}-${event.type}-${index}`}
                  style={styles.eventCard}
                  onPress={() => handleJobPress(event.job.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.eventIndicator, (styles as any)[`eventIndicator${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`]]} />

                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventType}>{event.label}</Text>
                      <Text style={styles.jobNumber}>{event.job.jobNumber}</Text>
                    </View>

                    <Text style={styles.customerName}>{event.job.customer.name}</Text>
                    <Text style={styles.customerAddress}>
                      {event.job.customer.address}, {event.job.customer.city}
                    </Text>
                    <Text style={styles.customerPhone}>{event.job.customer.phone}</Text>

                    <View style={styles.eventFooter}>
                      <View style={(styles as any)[`statusBadge${event.job.status.replace(/_/g, '')}`] || styles.statusBadge}>
                        <Text style={styles.statusText}>{event.job.status}</Text>
                      </View>

                      {event.job.workflowStatus && event.job.workflowStatus !== 'NONE' && (
                        <View style={[
                          styles.workflowBadge,
                          event.type === 'appointment' && styles.workflowBadgeAppointment,
                          event.type === 'followup' && styles.workflowBadgeFollowup,
                          event.type === 'install' && styles.workflowBadgeInstall
                        ]}>
                          <Text style={styles.workflowText}>
                            {event.job.workflowStatus.replace(/_/g, ' ')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Summary Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calendar Summary</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValueInfo}>
                  {jobs.filter(j => j.appointmentDate).length}
                </Text>
                <Text style={styles.statLabel}>Appointments</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValueSuccess}>
                  {jobs.filter(j => j.installDate).length}
                </Text>
                <Text style={styles.statLabel}>Installations</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValueWarning}>
                  {jobs.filter(j => j.followUpDate).length}
                </Text>
                <Text style={styles.statLabel}>Follow-ups</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValuePrimary}>
                  {jobs.filter(j => j.status === 'IN_PROGRESS').length}
                </Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
            </View>
          </View>

            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  calendarSection: {
    backgroundColor: Colors.background,
    marginBottom: 12,
    paddingBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendDotInfo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.info,
  },
  legendDotSuccess: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  legendDotWarning: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
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
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  eventIndicator: {
    width: 4,
  },
  eventIndicatorAppointment: {
    width: 4,
    backgroundColor: Colors.info,
  },
  eventIndicatorFollowup: {
    width: 4,
    backgroundColor: Colors.warning,
  },
  eventIndicatorInstall: {
    width: 4,
    backgroundColor: Colors.success,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  jobNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  workflowBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workflowBadgeAppointment: {
    backgroundColor: Colors.info,
  },
  workflowBadgeFollowup: {
    backgroundColor: Colors.warning,
  },
  workflowBadgeInstall: {
    backgroundColor: Colors.success,
  },
  workflowText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeDRAFT: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.draft,
  },
  statusBadgeQUOTED: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.quoted,
  },
  statusBadgeAPPROVED: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.approved,
  },
  statusBadgeINPROGRESS: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.inProgress,
  },
  statusBadgeCOMPLETED: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.completed,
  },
  statusBadgeCANCELLED: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.cancelled,
  },
  statusText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '50%',
    padding: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValueInfo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.info,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValueSuccess: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.success,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValueWarning: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.warning,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValuePrimary: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default CalendarScreen;
