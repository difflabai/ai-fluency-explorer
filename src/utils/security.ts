
/**
 * Security utility functions for the application
 */

/**
 * Validates password strength
 * @param password The password to validate
 * @returns An object containing validation result and any error message
 */
export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  message?: string;
} => {
  // Password must be at least 8 characters
  if (password.length < 8) {
    return { 
      isValid: false, 
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Password must contain uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Password must contain lowercase letter
  if (!/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Password must contain a number
  if (!/\d/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one number'
    };
  }
  
  // Password must contain a special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one special character'
    };
  }
  
  return { isValid: true };
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns The sanitized input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generates a secure random token
 * @param length The length of the token
 * @returns A secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
