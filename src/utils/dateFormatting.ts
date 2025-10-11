import { format, formatDistance, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';

/**
 * Format date for display (e.g., "Oct 10, 2024")
 */
export const formatDisplayDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

/**
 * Format date with time (e.g., "Oct 10, 2024 3:30 PM")
 */
export const formatDisplayDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy h:mm a');
};

/**
 * Format time only (e.g., "3:30 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

/**
 * Format date for calendar display (e.g., "2024-10-10")
 */
export const formatCalendarDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format date with smart relative display
 * Shows "Today", "Yesterday", "Tomorrow", or full date
 */
export const formatSmartDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return `Today at ${formatTime(dateObj)}`;
  }

  if (isTomorrow(dateObj)) {
    return `Tomorrow at ${formatTime(dateObj)}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${formatTime(dateObj)}`;
  }

  return formatDisplayDateTime(dateObj);
};

/**
 * Format date for job number (e.g., "20241010")
 */
export const formatJobNumberDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyyMMdd');
};

/**
 * Parse date string safely
 */
export const parseDateSafely = (dateString: string): Date | null => {
  try {
    return parseISO(dateString);
  } catch {
    return null;
  }
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Format duration in hours and minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};
