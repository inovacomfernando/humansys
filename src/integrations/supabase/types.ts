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
      achievements: {
        Row: {
          badge: Json | null
          badge_id: string
          earned_at: string
          id: string
          process_id: string
          user_id: string
        }
        Insert: {
          badge?: Json | null
          badge_id: string
          earned_at?: string
          id?: string
          process_id: string
          user_id: string
        }
        Update: {
          badge?: Json | null
          badge_id?: string
          earned_at?: string
          id?: string
          process_id?: string
          user_id?: string
        }
        Relationships: []
      }
      brainsys_insights: {
        Row: {
          confidence_score: number | null
          content: Json
          created_at: string | null
          id: string
          insight_type: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          content: Json
          created_at?: string | null
          id?: string
          insight_type: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          content?: Json
          created_at?: string | null
          id?: string
          insight_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      certificate_templates: {
        Row: {
          active: boolean
          auto_fill_data: Json | null
          created_at: string
          description: string
          id: string
          name: string
          template_url: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          auto_fill_data?: Json | null
          created_at?: string
          description: string
          id?: string
          name: string
          template_url?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          auto_fill_data?: Json | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          template_url?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      collaborators: {
        Row: {
          created_at: string
          department: string
          email: string
          id: string
          join_date: string
          location: string | null
          name: string
          phone: string | null
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          id?: string
          join_date?: string
          location?: string | null
          name: string
          phone?: string | null
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          id?: string
          join_date?: string
          location?: string | null
          name?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          arr: number | null
          created_at: string
          domain: string | null
          id: string
          mrr: number | null
          name: string
          plan_type: string
          status: string
          subscription_started_at: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          arr?: number | null
          created_at?: string
          domain?: string | null
          id?: string
          mrr?: number | null
          name: string
          plan_type?: string
          status?: string
          subscription_started_at?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          arr?: number | null
          created_at?: string
          domain?: string | null
          id?: string
          mrr?: number | null
          name?: string
          plan_type?: string
          status?: string
          subscription_started_at?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_health_scores: {
        Row: {
          adoption_score: number | null
          calculated_at: string
          churn_risk: string | null
          company_id: string
          engagement_score: number | null
          health_score: number
          id: string
          last_activity_at: string | null
          satisfaction_score: number | null
        }
        Insert: {
          adoption_score?: number | null
          calculated_at?: string
          churn_risk?: string | null
          company_id: string
          engagement_score?: number | null
          health_score?: number
          id?: string
          last_activity_at?: string | null
          satisfaction_score?: number | null
        }
        Update: {
          adoption_score?: number | null
          calculated_at?: string
          churn_risk?: string | null
          company_id?: string
          engagement_score?: number | null
          health_score?: number
          id?: string
          last_activity_at?: string | null
          satisfaction_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_health_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          access_level: string
          category: string
          created_at: string
          description: string | null
          download_count: number
          file_size: number | null
          file_url: string | null
          id: string
          pages: number | null
          title: string
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_url?: string | null
          id?: string
          pages?: number | null
          title: string
          updated_at?: string
          user_id: string
          version?: string
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number
          file_size?: number | null
          file_url?: string | null
          id?: string
          pages?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          anonymous: boolean
          content: string
          created_at: string
          from_user_id: string
          id: string
          notification_method: string
          rating: number | null
          send_email: boolean
          send_notification: boolean
          status: string
          subject: string
          to_collaborator_id: string
          type: string
          updated_at: string
          urgent: boolean
          user_id: string
        }
        Insert: {
          anonymous?: boolean
          content: string
          created_at?: string
          from_user_id: string
          id?: string
          notification_method?: string
          rating?: number | null
          send_email?: boolean
          send_notification?: boolean
          status?: string
          subject: string
          to_collaborator_id: string
          type?: string
          updated_at?: string
          urgent?: boolean
          user_id: string
        }
        Update: {
          anonymous?: boolean
          content?: string
          created_at?: string
          from_user_id?: string
          id?: string
          notification_method?: string
          rating?: number | null
          send_email?: boolean
          send_notification?: boolean
          status?: string
          subject?: string
          to_collaborator_id?: string
          type?: string
          updated_at?: string
          urgent?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_to_collaborator_id_fkey"
            columns: ["to_collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification: {
        Row: {
          current_streak: number
          level: number
          longest_streak: number
          next_level_progress: number
          rank: number
          recent_achievements: Json | null
          total_badges: number
          total_points: number
          user_id: string
        }
        Insert: {
          current_streak?: number
          level?: number
          longest_streak?: number
          next_level_progress?: number
          rank?: number
          recent_achievements?: Json | null
          total_badges?: number
          total_points?: number
          user_id: string
        }
        Update: {
          current_streak?: number
          level?: number
          longest_streak?: number
          next_level_progress?: number
          rank?: number
          recent_achievements?: Json | null
          total_badges?: number
          total_points?: number
          user_id?: string
        }
        Relationships: []
      }
      generated_certificates: {
        Row: {
          certificate_data: Json
          collaborator_id: string
          created_at: string
          generated_url: string | null
          id: string
          issued_date: string
          template_id: string
          training_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_data: Json
          collaborator_id: string
          created_at?: string
          generated_url?: string | null
          id?: string
          issued_date?: string
          template_id: string
          training_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_data?: Json
          collaborator_id?: string
          created_at?: string
          generated_url?: string | null
          id?: string
          issued_date?: string
          template_id?: string
          training_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_certificates_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_certificates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_certificates_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_processes: {
        Row: {
          collaborator_id: string
          created_at: string
          current_step: string
          department: string
          id: string
          position: string
          progress: number
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborator_id: string
          created_at?: string
          current_step?: string
          department: string
          id?: string
          position: string
          progress?: number
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborator_id?: string
          created_at?: string
          current_step?: string
          department?: string
          id?: string
          position?: string
          progress?: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_processes_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          onboarding_process_id: string
          step_order: number
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          onboarding_process_id: string
          step_order: number
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          onboarding_process_id?: string
          step_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_onboarding_process_id_fkey"
            columns: ["onboarding_process_id"]
            isOneToOne: false
            referencedRelation: "onboarding_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          admin_user_id: string
          created_at: string | null
          id: string
          organization_id: string
          role: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          id?: string
          organization_id: string
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          id?: string
          organization_id?: string
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          admin_user_id: string
          created_at: string | null
          id: string
          name: string
          status: string | null
          subscription_plan: string | null
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_events: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          event_type: string
          id: string
          mrr_change: number
          plan_from: string | null
          plan_to: string | null
        }
        Insert: {
          amount?: number
          company_id: string
          created_at?: string
          event_type: string
          id?: string
          mrr_change?: number
          plan_from?: string | null
          plan_to?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          event_type?: string
          id?: string
          mrr_change?: number
          plan_from?: string | null
          plan_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_activities: {
        Row: {
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          level: string
          message: string
          source: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          level: string
          message: string
          source: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          level?: string
          message?: string
          source?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          cache_ttl_minutes: number | null
          cache_version: number | null
          id: string
          updated_at: string | null
        }
        Insert: {
          cache_ttl_minutes?: number | null
          cache_version?: number | null
          id: string
          updated_at?: string | null
        }
        Update: {
          cache_ttl_minutes?: number | null
          cache_version?: number | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_enrollments: {
        Row: {
          collaborator_id: string
          completed_at: string | null
          created_at: string
          enrolled_at: string
          id: string
          progress: number
          status: string
          training_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborator_id: string
          completed_at?: string | null
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number
          status?: string
          training_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborator_id?: string
          completed_at?: string | null
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number
          status?: string
          training_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_enrollments_collaborator_id_fkey"
            columns: ["collaborator_id"]
            isOneToOne: false
            referencedRelation: "collaborators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string
          description: string
          duration: string
          id: string
          instructor: string | null
          participants: number
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          duration: string
          id?: string
          instructor?: string | null
          participants?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          duration?: string
          id?: string
          instructor?: string | null
          participants?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          company_id: string
          created_at: string
          feature_name: string | null
          id: string
          session_duration: number | null
          user_id: string
        }
        Insert: {
          activity_type: string
          company_id: string
          created_at?: string
          feature_name?: string | null
          id?: string
          session_duration?: number | null
          user_id: string
        }
        Update: {
          activity_type?: string
          company_id?: string
          created_at?: string
          feature_name?: string | null
          id?: string
          session_duration?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          id: string
          plan_type: string | null
          remaining_credits: number
          total_credits: number
          updated_at: string | null
          used_credits: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_type?: string | null
          remaining_credits?: number
          total_credits?: number
          updated_at?: string | null
          used_credits?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_type?: string | null
          remaining_credits?: number
          total_credits?: number
          updated_at?: string | null
          used_credits?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_mrr: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          total_mrr: number
        }[]
      }
      create_default_onboarding_steps: {
        Args: { process_id: string }
        Returns: undefined
      }
      get_churn_rate: {
        Args: { period_months?: number }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_cache_version: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "founder" | "admin" | "manager" | "user"
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
      app_role: ["founder", "admin", "manager", "user"],
    },
  },
} as const
