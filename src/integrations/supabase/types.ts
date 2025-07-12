export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      branch_ids: {
        Row: {
          branch_id: string
          branch_name: string
          college_id: string | null
          created_at: string | null
        }
        Insert: {
          branch_id?: string
          branch_name: string
          college_id?: string | null
          created_at?: string | null
        }
        Update: {
          branch_id?: string
          branch_name?: string
          college_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branch_ids_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "college_ids"
            referencedColumns: ["college_id"]
          },
        ]
      }
      college_ids: {
        Row: {
          college_id: string
          college_name: string
          created_at: string | null
        }
        Insert: {
          college_id?: string
          college_name: string
          created_at?: string | null
        }
        Update: {
          college_id?: string
          college_name?: string
          created_at?: string | null
        }
        Relationships: []
      }
      cutoffs: {
        Row: {
          branch_name: string
          cap1_cutoff: number | null
          cap2_cutoff: number | null
          cap3_cutoff: number | null
          category: string
          city: string | null
          college_name: string
          college_type: string
          created_at: string | null
          id: string
          year: number | null
        }
        Insert: {
          branch_name: string
          cap1_cutoff?: number | null
          cap2_cutoff?: number | null
          cap3_cutoff?: number | null
          category: string
          city?: string | null
          college_name: string
          college_type: string
          created_at?: string | null
          id?: string
          year?: number | null
        }
        Update: {
          branch_name?: string
          cap1_cutoff?: number | null
          cap2_cutoff?: number | null
          cap3_cutoff?: number | null
          category?: string
          city?: string | null
          college_name?: string
          college_type?: string
          created_at?: string | null
          id?: string
          year?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          aggregate: number | null
          category: string | null
          college_types: string[] | null
          created_at: string | null
          full_name: string | null
          id: string
          preferred_branch: string | null
          search_results: Json | null
          session_id: string
          session_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aggregate?: number | null
          category?: string | null
          college_types?: string[] | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          preferred_branch?: string | null
          search_results?: Json | null
          session_id: string
          session_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aggregate?: number | null
          category?: string | null
          college_types?: string[] | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          preferred_branch?: string | null
          search_results?: Json | null
          session_id?: string
          session_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_college_names: {
        Args: Record<PropertyKey, never>
        Returns: {
          college_name: string
        }[]
      }
      get_available_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
        }[]
      }
      get_branches_for_colleges: {
        Args: { college_names: string[] }
        Returns: {
          college_name: string
          branch_name: string
        }[]
      }
      get_college_type: {
        Args: { college_name_param: string }
        Returns: string
      }
      get_college_types_for_colleges: {
        Args: { college_names: string[] }
        Returns: {
          college_name: string
          college_type: string
        }[]
      }
      get_colleges_with_branches: {
        Args: Record<PropertyKey, never>
        Returns: {
          college_id: string
          college_name: string
          college_type: string
          branches: Json
        }[]
      }
      get_colleges_with_branches_and_types: {
        Args: Record<PropertyKey, never>
        Returns: {
          college_id: string
          college_name: string
          college_type: string
          branches: Json
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
