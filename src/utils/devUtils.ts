
import { triggerMigration } from './migrationScript';

// Expose utility functions to the global window object for development use
export const setupDevUtils = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.devUtils = {
      migrateData: triggerMigration,
    };
    
    console.log(
      'Dev utilities available in console. Run window.devUtils.migrateData() to migrate test data to the database.'
    );
  }
};

// Only run in development environments
if (process.env.NODE_ENV === 'development') {
  setupDevUtils();
}
