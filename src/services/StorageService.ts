import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job, Customer, AppSettings, Lead } from '../types';
import { STORAGE_KEYS, DEFAULT_APP_SETTINGS } from '../constants';

/**
 * Service for managing local storage using AsyncStorage
 */
class StorageService {
  /**
   * Save jobs to storage
   */
  async saveJobs(jobs: Job[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(jobs);
      await AsyncStorage.setItem(STORAGE_KEYS.JOBS, jsonValue);
    } catch (error) {
      console.error('Error saving jobs:', error);
      throw error;
    }
  }

  /**
   * Load jobs from storage
   */
  async loadJobs(): Promise<Job[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.JOBS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading jobs:', error);
      return [];
    }
  }

  /**
   * Save a single job
   */
  async saveJob(job: Job): Promise<void> {
    try {
      const jobs = await this.loadJobs();
      const index = jobs.findIndex((j) => j.id === job.id);

      if (index >= 0) {
        jobs[index] = job;
      } else {
        jobs.push(job);
      }

      await this.saveJobs(jobs);
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  /**
   * Delete a job
   */
  async deleteJob(jobId: string): Promise<void> {
    try {
      const jobs = await this.loadJobs();
      const filteredJobs = jobs.filter((j) => j.id !== jobId);
      await this.saveJobs(filteredJobs);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  /**
   * Save customers to storage
   */
  async saveCustomers(customers: Customer[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(customers);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, jsonValue);
    } catch (error) {
      console.error('Error saving customers:', error);
      throw error;
    }
  }

  /**
   * Load customers from storage
   */
  async loadCustomers(): Promise<Customer[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading customers:', error);
      return [];
    }
  }

  /**
   * Save app settings
   */
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Load app settings
   */
  async loadSettings(): Promise<AppSettings> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return jsonValue != null
        ? JSON.parse(jsonValue)
        : DEFAULT_APP_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_APP_SETTINGS;
    }
  }

  /**
   * Clear all storage (for testing/debugging)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get last job number
   */
  async getLastJobNumber(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.LAST_JOB_NUMBER);
      return value != null ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error getting last job number:', error);
      return 0;
    }
  }

  /**
   * Save last job number
   */
  async saveLastJobNumber(jobNumber: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_JOB_NUMBER,
        jobNumber.toString()
      );
    } catch (error) {
      console.error('Error saving last job number:', error);
      throw error;
    }
  }

  /**
   * Get all jobs (alias for loadJobs for consistency)
   */
  async getAllJobs(): Promise<Job[]> {
    return this.loadJobs();
  }

  /**
   * Save leads to storage
   */
  async saveLeads(leads: Lead[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(leads);
      await AsyncStorage.setItem(STORAGE_KEYS.LEADS, jsonValue);
    } catch (error) {
      console.error('Error saving leads:', error);
      throw error;
    }
  }

  /**
   * Load leads from storage
   */
  async loadLeads(): Promise<Lead[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.LEADS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  }

  /**
   * Get all leads (alias for loadLeads for consistency)
   */
  async getAllLeads(): Promise<Lead[]> {
    return this.loadLeads();
  }

  /**
   * Save a single lead
   */
  async saveLead(lead: Lead): Promise<void> {
    try {
      const leads = await this.loadLeads();
      const index = leads.findIndex((l) => l.id === lead.id);

      if (index >= 0) {
        leads[index] = lead;
      } else {
        leads.push(lead);
      }

      await this.saveLeads(leads);
    } catch (error) {
      console.error('Error saving lead:', error);
      throw error;
    }
  }

  /**
   * Delete a lead
   */
  async deleteLead(leadId: string): Promise<void> {
    try {
      const leads = await this.loadLeads();
      const filteredLeads = leads.filter((l) => l.id !== leadId);
      await this.saveLeads(filteredLeads);
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }
}

export default new StorageService();
