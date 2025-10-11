import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../constants';
import { useJobStorage } from '../hooks';
import { formatCalendarDate, formatDisplayDate } from '../utils';
import { Job } from '../types';

const CalendarScreen = ({ navigation }: any) => {
  const { jobs } = useJobStorage();
  const [selectedDate, setSelectedDate] = useState(formatCalendarDate(new Date()));

  // Create marked dates from scheduled jobs
  const markedDates = useMemo(() => {
    const marked: any = {};

    jobs.forEach((job) => {
      if (job.scheduledDate) {
        const dateStr = formatCalendarDate(job.scheduledDate);
        if (!marked[dateStr]) {
          marked[dateStr] = {
            marked: true,
            dotColor: Colors.primary,
            jobs: [],
          };
        }
        marked[dateStr].jobs.push(job);
      }
    });

    // Add selected date styling
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = Colors.primary;
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: Colors.primary,
        jobs: [],
      };
    }

    return marked;
  }, [jobs, selectedDate]);

  // Get jobs for selected date
  const selectedDateJobs = markedDates[selectedDate]?.jobs || [];

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetails', { jobId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarSection}>
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
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
          Jobs on {formatDisplayDate(selectedDate)}
        </Text>

        {selectedDateJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No jobs scheduled for this date</Text>
            <Text style={styles.emptySubtext}>
              Jobs with scheduled dates will appear here
            </Text>
          </View>
        ) : (
          selectedDateJobs.map((job: Job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => handleJobPress(job.id)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobNumber}>{job.jobNumber}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        {
                          DRAFT: Colors.draft,
                          QUOTED: Colors.quoted,
                          APPROVED: Colors.approved,
                          IN_PROGRESS: Colors.inProgress,
                          COMPLETED: Colors.completed,
                          CANCELLED: Colors.cancelled,
                        }[job.status] || Colors.text,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>{job.status}</Text>
                </View>
              </View>

              <Text style={styles.customerName}>{job.customer.name}</Text>
              <Text style={styles.customerAddress}>
                {job.customer.address}, {job.customer.city}
              </Text>
              <Text style={styles.customerPhone}>{job.customer.phone}</Text>

              <View style={styles.jobFooter}>
                <Text style={styles.measurementCount}>
                  {job.measurements.length} measurement{job.measurements.length !== 1 ? 's' : ''}
                </Text>
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
            <Text style={styles.statValue}>{jobs.filter(j => j.scheduledDate).length}</Text>
            <Text style={styles.statLabel}>Scheduled Jobs</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {jobs.filter(j => j.status === 'IN_PROGRESS').length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {jobs.filter(j => j.status === 'COMPLETED').length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {jobs.filter(j => j.status === 'DRAFT').length}
            </Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  calendarSection: {
    backgroundColor: Colors.background,
    marginBottom: 12,
    paddingBottom: 16,
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
  jobCard: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.background,
    fontSize: 11,
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
    marginBottom: 12,
  },
  jobFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  measurementCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
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
