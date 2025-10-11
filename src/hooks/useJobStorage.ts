import { useState, useEffect, useCallback } from 'react';
import { Job } from '../types';
import StorageService from '../services/StorageService';

export const useJobStorage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const loadedJobs = await StorageService.loadJobs();
      setJobs(loadedJobs);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveJob = useCallback(async (job: Job) => {
    try {
      await StorageService.saveJob(job);
      await loadJobs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [loadJobs]);

  const deleteJob = useCallback(async (jobId: string) => {
    try {
      await StorageService.deleteJob(jobId);
      await loadJobs();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [loadJobs]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return {
    jobs,
    loading,
    error,
    saveJob,
    deleteJob,
    refreshJobs: loadJobs,
  };
};
