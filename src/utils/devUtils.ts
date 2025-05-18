
import { triggerMigration } from './migrationScript';
import { displaySystemCheck } from './systemCheck';

// Expose utility functions to the global window object for development use
export const setupDevUtils = () => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.devUtils = {
      migrateData: triggerMigration,
      systemCheck: displaySystemCheck,
    };
    
    console.log(
      'Dev utilities available in console. Run window.devUtils.migrateData() to migrate test data to the database, or window.devUtils.systemCheck() to verify system setup.'
    );
  }
};

// Only run in development environments
if (process.env.NODE_ENV === 'development') {
  setupDevUtils();
}
