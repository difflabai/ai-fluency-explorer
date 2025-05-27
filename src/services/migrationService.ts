
import { migrateAndNotify } from '@/utils/databaseMigration';
import { toast } from "@/hooks/use-toast";

export const migrateQuestionsToDatabase = async () => {
  try {
    // Call our updated migration function that handles everything
    return await migrateAndNotify();
  } catch (error) {
    console.error('Error in migrateQuestionsToDatabase:', error);
    toast({
      title: "Migration Failed",
      description: "Failed to migrate questions. See console for details.",
      variant: "destructive"
    });
    return false;
  }
};
