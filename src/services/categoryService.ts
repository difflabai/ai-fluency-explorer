
import { supabase } from "@/integrations/supabase/client";
import { DBCategory } from './types/questionTypes';

export const fetchCategories = async (): Promise<DBCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return [];
  }
};
