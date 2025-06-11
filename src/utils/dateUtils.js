/**
 * Utility functions for date formatting and handling
 */

/**
 * Safely format a date with fallback handling and proper timezone support
 * @param {string|Date} dateInput - Date string or Date object
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - Locale string (default: 'id-ID')
 * @returns {string} Formatted date string or fallback
 */
export const formatDate = (dateInput, options = {}, locale = 'id-ID') => {
  try {
    // Handle null, undefined, or empty values
    if (!dateInput) {
      return 'Tanggal tidak tersedia';
    }

    // Convert to Date object
    let date;
    if (typeof dateInput === 'string') {
      // Handle various date formats
      if (dateInput.includes('T') || dateInput.includes('Z')) {
        // ISO format - parse as UTC and convert to local time
        date = new Date(dateInput);
      } else if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // YYYY-MM-DD format - treat as local date
        date = new Date(dateInput + 'T00:00:00');
      } else {
        date = new Date(dateInput);
      }
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return 'Format tanggal tidak valid';
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Tanggal tidak valid';
    }

    // Default options with timezone support
    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta', // WIB timezone
      ...options
    };

    // Use toLocaleString for better timezone handling when time is included
    if (options.hour || options.minute) {
      return date.toLocaleString(locale, defaultOptions);
    } else {
      return date.toLocaleDateString(locale, defaultOptions);
    }
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateInput);
    return 'Error format tanggal';
  }
};

/**
 * Format date for post display (with time or relative time for recent posts)
 * @param {string|Date} dateInput - Date input (WIB timestamps from backend)
 * @returns {string} Formatted date with time or relative time
 */
export const formatPostDate = (dateInput) => {
  try {
    if (!dateInput) return 'Tanggal tidak tersedia';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Tanggal tidak valid';

    // Get current time for accurate comparison since backend sends WIB timestamps
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    // Show relative time for posts less than 24 hours old
    if (diffInHours < 24) {
      return getRelativeTime(dateInput);
    }

    // Show full date and time for older posts (displayed in WIB)
    return formatDate(dateInput, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    });
  } catch (error) {
    console.error('Error formatting post date:', error);
    return 'Error format tanggal';
  }
};

/**
 * Format date for comment display (shorter format with relative time for recent comments)
 * @param {string|Date} dateInput - Date input (WIB timestamps from backend)
 * @returns {string} Formatted date for comments
 */
export const formatCommentDate = (dateInput) => {
  try {
    if (!dateInput) return 'Tanggal tidak tersedia';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Tanggal tidak valid';

    // Get current time for accurate comparison since backend sends WIB timestamps
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    // Show relative time for comments less than 6 hours old
    if (diffInHours < 6) {
      return getRelativeTime(dateInput);
    }

    // Show short date format for older comments (displayed in WIB)
    return formatDate(dateInput, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    }, 'id-ID');
  } catch (error) {
    console.error('Error formatting comment date:', error);
    return 'Error format tanggal';
  }
};

/**
 * Format date for card display (compact)
 * @param {string|Date} dateInput - Date input
 * @returns {string} Formatted date for cards
 */
export const formatCardDate = (dateInput) => {
  return formatDate(dateInput, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Helper function to get current WIB time consistently
 * @returns {Date} Current time in WIB
 */
const getWIBTime = () => {
  const now = new Date();
  const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours for WIB
  return wibTime;
};

/**
 * Get relative time (e.g., "2 hours ago") with proper timezone handling
 * @param {string|Date} dateInput - Date input (WIB timestamps from backend)
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateInput) => {
  try {
    if (!dateInput) return 'Waktu tidak tersedia';

    // Parse date - backend now sends WIB timestamps
    let date;
    if (typeof dateInput === 'string') {
      // Parse the WIB timestamp correctly
      // Backend sends timestamps in WIB timezone format
      date = new Date(dateInput);
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return 'Waktu tidak valid';

    // Get current time for accurate comparison
    // Since backend now sends WIB timestamps, we can compare directly with current time
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 0) {
      return 'Baru saja'; // Handle future dates
    } else if (diffInSeconds < 60) {
      return 'Baru saja';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam yang lalu`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} hari yang lalu`;
    } else {
      return formatCardDate(dateInput);
    }
  } catch (error) {
    console.error('Error getting relative time:', error, 'Input:', dateInput);
    return 'Waktu tidak valid';
  }
};

/**
 * Get the correct date field from post object
 * Handles different field names (created_at, createdAt, etc.)
 * @param {Object} post - Post object
 * @returns {string|Date} Date value
 */
export const getPostDate = (post) => {
  if (!post) return null;
  
  // Try different possible field names
  return post.created_at || 
         post.createdAt || 
         post.date || 
         post.timestamp || 
         post.created ||
         null;
};

/**
 * Validate if a date string/object is valid
 * @param {string|Date} dateInput - Date input
 * @returns {boolean} True if valid
 */
export const isValidDate = (dateInput) => {
  try {
    if (!dateInput) return false;
    const date = new Date(dateInput);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};
