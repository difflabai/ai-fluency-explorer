
// This file re-exports functionality from more focused modules
import { migrateJsonCategories } from "./database/jsonCategoryMigration";
import { migrateJsonQuestions } from "./database/jsonQuestionMigration";
import { migrateJsonTestTypes } from "./database/jsonTestTypeMigration";
import { migrateJsonData, migrateJsonDataWithNotifications } from "./database/jsonDataOrchestrator";

// Export all the functions for backward compatibility
export {
  migrateJsonCategories,
  migrateJsonQuestions,
  migrateJsonTestTypes,
  migrateJsonData,
  migrateJsonDataWithNotifications
};
