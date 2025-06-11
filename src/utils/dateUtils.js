/**
 * Utility functions for date formatting and handling
 */

/**
 * Safely format a date with fallback handling
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
        // ISO format
        date = new Date(dateInput);
      } else if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // YYYY-MM-DD format
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

    // Default options
    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options
    };

    return date.toLocaleDateString(locale, defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateInput);
    return 'Error format tanggal';
  }
};

/**
 * Format date for post display (with time)
 * @param {string|Date} dateInput - Date input
 * @returns {string} Formatted date with time
 */
export const formatPostDate = (dateInput) => {
  return formatDate(dateInput, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date for comment display (shorter format)
 * @param {string|Date} dateInput - Date input
 * @returns {string} Formatted date for comments
 */
export const formatCommentDate = (dateInput) => {
  return formatDate(dateInput, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }, 'en-US');
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
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} dateInput - Date input
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateInput) => {
  try {
    if (!dateInput) return 'Waktu tidak tersedia';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Waktu tidak valid';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
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
    console.error('Error getting relative time:', error);
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
