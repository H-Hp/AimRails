// utils/AjaxUtility.js
export default class AjaxUtility {
  constructor() {
    this.csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    if (!this.csrfToken) {
      console.warn('CSRF token not found. Make sure you have a meta tag with name="csrf-token"');
    }
  }

  /**
   * Ajax request handler
   * @param {string} path - API endpoint path
   * @param {Object} sendData - Data to send (optional)
   * @param {Object} options - Additional options (optional)
   * @returns {Promise} - Response data
   */
  async ajax(path, sendData = null, options = {}) {
    const defaultOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken
      }
    };

    // Merge default options with custom options
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    };

    // Add body only if sendData is not null
    if (sendData !== null) {
      fetchOptions.body = JSON.stringify(sendData);
    }

    try {
      const response = await fetch(path, fetchOptions);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ajax request failed:', error);
      throw error; // Re-throw to handle in the scene if needed
    }
  }
}