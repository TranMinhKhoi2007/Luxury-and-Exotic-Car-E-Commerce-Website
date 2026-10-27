/**
 * APEX MOTORS - Client-Side Validation Utilities
 */

const Validator = {
  /**
   * Validate standard email address
   * @param {string} email 
   * @returns {boolean}
   */
  isValidEmail(email) {
    if (!email) return false;
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim());
  },

  /**
   * Validate international/national phone number
   * @param {string} phone 
   * @returns {boolean}
   */
  isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
    return cleaned.length >= 7 && cleaned.length <= 16 && /^\+?[0-9]+$/.test(cleaned);
  },

  /**
   * Validate non-empty string
   * @param {string} value 
   * @param {number} minLen 
   * @returns {boolean}
   */
  isNotEmpty(value, minLen = 1) {
    return typeof value === "string" && value.trim().length >= minLen;
  },

  /**
   * Display inline field error
   * @param {HTMLElement} inputElement 
   * @param {string} message 
   */
  showError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add("input-error");
    inputElement.classList.remove("input-valid");
    inputElement.setAttribute("aria-invalid", "true");

    let errorEl = inputElement.parentElement.querySelector(".field-error-msg");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "field-error-msg";
      errorEl.setAttribute("role", "alert");
      inputElement.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  },

  /**
   * Clear inline field error
   * @param {HTMLElement} inputElement 
   */
  clearError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove("input-error");
    inputElement.removeAttribute("aria-invalid");

    const errorEl = inputElement.parentElement.querySelector(".field-error-msg");
    if (errorEl) {
      errorEl.remove();
    }
  },

  /**
   * Mark input as valid
   * @param {HTMLElement} inputElement 
   */
  markValid(inputElement) {
    if (!inputElement) return;
    this.clearError(inputElement);
    inputElement.classList.add("input-valid");
  }
};
