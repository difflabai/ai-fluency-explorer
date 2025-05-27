export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string
          correct_answer: boolean
          created_at: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          is_active: boolean
          parent_question_id: string | null
          text: string
          updated_at: string
          version: number
        }
        Insert: {
          category_id: string
          correct_answer: boolean
          created_at?: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          is_active?: boolean
          parent_question_id?: string | null
          text: string
          updated_at?: string
          version?: number
        }
        Update: {
          category_id?: string
          correct_answer?: boolean
          created_at?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          is_active?: boolean
          parent_question_id?: string | null
          text?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_parent_question_id_fkey"
            columns: ["parent_question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions_map: {
        Row: {
          created_at: string
          id: string
          question_id: string
          test_type_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          test_type_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          test_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_map_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_map_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          category_scores: Json
          created_at: string
          id: string
          is_test_data: boolean
          max_possible_score: number
          overall_score: number
          percentage_score: number
          public: boolean
          questions_snapshot: Json | null
          share_id: string
          tier_name: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          category_scores: Json
          created_at?: string
          id?: string
          is_test_data?: boolean
          max_possible_score: number
          overall_score: number
          percentage_score: number
          public?: boolean
          questions_snapshot?: Json | null
          share_id?: string
          tier_name: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          category_scores?: Json
          created_at?: string
          id?: string
          is_test_data?: boolean
          max_possible_score?: number
          overall_score?: number
          percentage_score?: number
          public?: boolean
          questions_snapshot?: Json | null
          share_id?: string
          tier_name?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      test_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          question_limit: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          question_limit?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          question_limit?: number | null
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answer: boolean
          created_at: string
          id: string
          question_id: string
          test_result_id: string
          user_id: string | null
        }
        Insert: {
          answer: boolean
          created_at?: string
          id?: string
          question_id: string
          test_result_id: string
          user_id?: string | null
        }
        Update: {
          answer?: boolean
          created_at?: string
          id?: string
          question_id?: string
          test_result_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_test_result_id_fkey"
            columns: ["test_result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: { user_email: string; role_name?: string }
        Returns: boolean
      }
      admin_insert_category: {
        Args: { category_name: string; category_description: string }
        Returns: string
      }
      admin_insert_question: {
        Args: {
          question_text: string
          category_id: string
          difficulty: string
          correct_answer: boolean
        }
        Returns: string
      }
      check_category_exists: {
        Args: { category_name: string }
        Returns: string
      }
      create_question_version: {
        Args: {
          question_id: string
          new_text: string
          new_category_id: string
          new_difficulty: Database["public"]["Enums"]["difficulty_level"]
          new_correct_answer: boolean
        }
        Returns: string
      }
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      populate_test_questions: {
        Args: { test_type_name: string; question_limit?: number }
        Returns: number
      }
    }
    Enums: {
      difficulty_level:
        | "novice"
        | "advanced-beginner"
        | "competent"
        | "proficient"
        | "expert"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_level: [
        "novice",
        "advanced-beginner",
        "competent",
        "proficient",
        "expert",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
