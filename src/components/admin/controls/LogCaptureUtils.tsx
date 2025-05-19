
import React from 'react';

/**
 * Creates a utility to capture console logs for display in the UI
 * @param setMigrationLogs Function to update log state
 * @returns Function to restore original console methods
 */
export const setupLogCapture = (setMigrationLogs: React.Dispatch<React.SetStateAction<string[]>>) => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  console.log = (...args) => {
    originalConsoleLog(...args);
    setMigrationLogs(prev => [...prev, args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ')]);
  };
  
  console.error = (...args) => {
    originalConsoleError(...args);
    setMigrationLogs(prev => [...prev, `ERROR: ${args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ')}`]);
  };
  
  return () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  };
};
