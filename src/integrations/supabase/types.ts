export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_profiles: {
        Row: {
          created_at: string
          has_basement: boolean
          has_ceiling_fans: boolean
          has_central_ac: boolean
          has_deck: boolean
          has_fireplace: boolean
          has_furnace_humidifier: boolean
          has_garage: boolean
          has_gas: boolean
          has_hoa: boolean
          has_lawn: boolean
          has_septic: boolean
          has_sprinkler_system: boolean
          id: string
          stories: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          has_basement?: boolean
          has_ceiling_fans?: boolean
          has_central_ac?: boolean
          has_deck?: boolean
          has_fireplace?: boolean
          has_furnace_humidifier?: boolean
          has_garage?: boolean
          has_gas?: boolean
          has_hoa?: boolean
          has_lawn?: boolean
          has_septic?: boolean
          has_sprinkler_system?: boolean
          id?: string
          stories?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          has_basement?: boolean
          has_ceiling_fans?: boolean
          has_central_ac?: boolean
          has_deck?: boolean
          has_fireplace?: boolean
          has_furnace_humidifier?: boolean
          has_garage?: boolean
          has_gas?: boolean
          has_hoa?: boolean
          has_lawn?: boolean
          has_septic?: boolean
          has_sprinkler_system?: boolean
          id?: string
          stories?: number
          updated_at?: string
        }
        Relationships: []
      }
      home_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          next_due_at: string | null
          skipped_at: string | null
          status: string
          template_id: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          next_due_at?: string | null
          skipped_at?: string | null
          status?: string
          template_id: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          next_due_at?: string | null
          skipped_at?: string | null
          status?: string
          template_id?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "home_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          category: string
          created_at: string
          difficulty: string | null
          diy_or_pro: string | null
          est_cost_high: number | null
          est_cost_low: number | null
          est_time: string | null
          frequency: string | null
          frequency_days: number | null
          id: string
          is_prototype_task: boolean | null
          season: string | null
          skip_conditions: string[] | null
          sort_order: number | null
          task_type: string
          tier: string
          timing_trigger: string | null
          title: string
          trigger_rule: string | null
          trigger_type: string | null
          urgency_escalation: Json | null
          why_it_matters: string
        }
        Insert: {
          category: string
          created_at?: string
          difficulty?: string | null
          diy_or_pro?: string | null
          est_cost_high?: number | null
          est_cost_low?: number | null
          est_time?: string | null
          frequency?: string | null
          frequency_days?: number | null
          id: string
          is_prototype_task?: boolean | null
          season?: string | null
          skip_conditions?: string[] | null
          sort_order?: number | null
          task_type: string
          tier: string
          timing_trigger?: string | null
          title: string
          trigger_rule?: string | null
          trigger_type?: string | null
          urgency_escalation?: Json | null
          why_it_matters: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string | null
          diy_or_pro?: string | null
          est_cost_high?: number | null
          est_cost_low?: number | null
          est_time?: string | null
          frequency?: string | null
          frequency_days?: number | null
          id?: string
          is_prototype_task?: boolean | null
          season?: string | null
          skip_conditions?: string[] | null
          sort_order?: number | null
          task_type?: string
          tier?: string
          timing_trigger?: string | null
          title?: string
          trigger_rule?: string | null
          trigger_type?: string | null
          urgency_escalation?: Json | null
          why_it_matters?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
