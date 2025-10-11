import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { JobCard } from '../components';
import { useJobStorage } from '../hooks';
import { Colors, SCREEN_NAMES } from '../constants';

const HomeScreen = ({ navigation }: any) => {
  const { jobs, loading } = useJobStorage();

  const handleCreateNewJob = () => {
    navigation.navigate(SCREEN_NAMES.NEW_JOB);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobs.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No jobs yet</Text>
          <Text style={styles.emptySubtext}>Create your first job to get started</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateNewJob}
          >
            <Text style={styles.createButtonText}>+ Create New Job</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onPress={() => navigation.navigate(SCREEN_NAMES.JOB_DETAILS, { jobId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateNewJob}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: Colors.background,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default HomeScreen;
