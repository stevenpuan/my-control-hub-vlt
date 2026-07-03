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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string
          created_at: string
          created_by: string | null
          followers_count: number
          id: string
          last_active: string | null
          mfa_enabled: boolean
          owner: string | null
          platform: string
          status: string
          updated_at: string
        }
        Insert: {
          account_name: string
          created_at?: string
          created_by?: string | null
          followers_count?: number
          id?: string
          last_active?: string | null
          mfa_enabled?: boolean
          owner?: string | null
          platform: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          created_at?: string
          created_by?: string | null
          followers_count?: number
          id?: string
          last_active?: string | null
          mfa_enabled?: boolean
          owner?: string | null
          platform?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          label: string
          section: string
          sort_order: number
          updated_at: string
          value: string | null
          value_type: string | null
        }
        Insert: {
          id?: string
          label: string
          section: string
          sort_order?: number
          updated_at?: string
          value?: string | null
          value_type?: string | null
        }
        Update: {
          id?: string
          label?: string
          section?: string
          sort_order?: number
          updated_at?: string
          value?: string | null
          value_type?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json | null
          owner_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json | null
          owner_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json | null
          owner_id?: string
        }
        Relationships: []
      }
      compliance_items: {
        Row: {
          app: string
          created_at: string
          created_by: string | null
          gdpr: boolean
          id: string
          iso27001: boolean
          last_audit: string | null
          mfa: boolean
          risk: string | null
          soc2: boolean
          sso: boolean
          updated_at: string
        }
        Insert: {
          app: string
          created_at?: string
          created_by?: string | null
          gdpr?: boolean
          id?: string
          iso27001?: boolean
          last_audit?: string | null
          mfa?: boolean
          risk?: string | null
          soc2?: boolean
          sso?: boolean
          updated_at?: string
        }
        Update: {
          app?: string
          created_at?: string
          created_by?: string | null
          gdpr?: boolean
          id?: string
          iso27001?: boolean
          last_audit?: string | null
          mfa?: boolean
          risk?: string | null
          soc2?: boolean
          sso?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      cost_categories: {
        Row: {
          app_count: number
          category: string
          created_at: string
          id: string
          monthly_cost: number
          sort_order: number
        }
        Insert: {
          app_count?: number
          category: string
          created_at?: string
          id?: string
          monthly_cost?: number
          sort_order?: number
        }
        Update: {
          app_count?: number
          category?: string
          created_at?: string
          id?: string
          monthly_cost?: number
          sort_order?: number
        }
        Relationships: []
      }
      cost_trend: {
        Row: {
          amount: number
          created_at: string
          id: string
          month_label: string
          sort_order: number
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          month_label: string
          sort_order?: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          month_label?: string
          sort_order?: number
        }
        Relationships: []
      }
      handovers: {
        Row: {
          account: string
          created_at: string
          created_by: string | null
          from_person: string | null
          id: string
          items: string | null
          progress_done: number
          progress_total: number
          start_date: string | null
          status: string
          to_person: string | null
          updated_at: string
        }
        Insert: {
          account: string
          created_at?: string
          created_by?: string | null
          from_person?: string | null
          id?: string
          items?: string | null
          progress_done?: number
          progress_total?: number
          start_date?: string | null
          status?: string
          to_person?: string | null
          updated_at?: string
        }
        Update: {
          account?: string
          created_at?: string
          created_by?: string | null
          from_person?: string | null
          id?: string
          items?: string | null
          progress_done?: number
          progress_total?: number
          start_date?: string | null
          status?: string
          to_person?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          connected_apps: number
          created_at: string
          created_by: string | null
          health: string | null
          id: string
          integration_type: string | null
          last_sync: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          connected_apps?: number
          created_at?: string
          created_by?: string | null
          health?: string | null
          id?: string
          integration_type?: string | null
          last_sync?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          connected_apps?: number
          created_at?: string
          created_by?: string | null
          health?: string | null
          id?: string
          integration_type?: string | null
          last_sync?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          app: string
          assignee: string | null
          created_at: string
          created_by: string | null
          expiry: string | null
          id: string
          license_type: string | null
          total_seats: number
          updated_at: string
          used_seats: number
        }
        Insert: {
          app: string
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          expiry?: string | null
          id?: string
          license_type?: string | null
          total_seats?: number
          updated_at?: string
          used_seats?: number
        }
        Update: {
          app?: string
          assignee?: string | null
          created_at?: string
          created_by?: string | null
          expiry?: string | null
          id?: string
          license_type?: string | null
          total_seats?: number
          updated_at?: string
          used_seats?: number
        }
        Relationships: []
      }
      oauth_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_team: string | null
          created_date: string | null
          expiry_date: string | null
          id: string
          last_used: string | null
          name: string
          scope: string | null
          service: string | null
          status: string
          token_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_team?: string | null
          created_date?: string | null
          expiry_date?: string | null
          id?: string
          last_used?: string | null
          name: string
          scope?: string | null
          service?: string | null
          status?: string
          token_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_team?: string | null
          created_date?: string | null
          expiry_date?: string | null
          id?: string
          last_used?: string | null
          name?: string
          scope?: string | null
          service?: string | null
          status?: string
          token_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      permission_roles: {
        Row: {
          apps_scope: string | null
          created_at: string
          created_by: string | null
          id: string
          last_modified: string | null
          members: number
          permissions: string | null
          role: string
          role_created_by: string | null
          updated_at: string
        }
        Insert: {
          apps_scope?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_modified?: string | null
          members?: number
          permissions?: string | null
          role: string
          role_created_by?: string | null
          updated_at?: string
        }
        Update: {
          apps_scope?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_modified?: string | null
          members?: number
          permissions?: string | null
          role?: string
          role_created_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      privileged_accounts: {
        Row: {
          account: string
          account_type: string | null
          created_at: string
          created_by: string | null
          holder: string | null
          id: string
          last_access: string | null
          mfa_status: string | null
          next_rotation: string | null
          rotation_label: string | null
          service: string | null
          updated_at: string
        }
        Insert: {
          account: string
          account_type?: string | null
          created_at?: string
          created_by?: string | null
          holder?: string | null
          id?: string
          last_access?: string | null
          mfa_status?: string | null
          next_rotation?: string | null
          rotation_label?: string | null
          service?: string | null
          updated_at?: string
        }
        Update: {
          account?: string
          account_type?: string | null
          created_at?: string
          created_by?: string | null
          holder?: string | null
          id?: string
          last_access?: string | null
          mfa_status?: string | null
          next_rotation?: string | null
          rotation_label?: string | null
          service?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          id: string
          job_title: string | null
          joined_date: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id: string
          job_title?: string | null
          joined_date?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          job_title?: string | null
          joined_date?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      renewals: {
        Row: {
          action: string | null
          app: string
          created_at: string
          created_by: string | null
          expiry: string | null
          id: string
          monthly_cost: number | null
          priority: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          action?: string | null
          app: string
          created_at?: string
          created_by?: string | null
          expiry?: string | null
          id?: string
          monthly_cost?: number | null
          priority?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          action?: string | null
          app?: string
          created_at?: string
          created_by?: string | null
          expiry?: string | null
          id?: string
          monthly_cost?: number | null
          priority?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      saas_apps: {
        Row: {
          badges: string[]
          category: string | null
          contract_end: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          icon: string | null
          id: string
          monthly_cost: number
          name: string
          updated_at: string
          vendor: string | null
        }
        Insert: {
          badges?: string[]
          category?: string | null
          contract_end?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          icon?: string | null
          id?: string
          monthly_cost?: number
          name: string
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          badges?: string[]
          category?: string | null
          contract_end?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          icon?: string | null
          id?: string
          monthly_cost?: number
          name?: string
          updated_at?: string
          vendor?: string | null
        }
        Relationships: []
      }
      shares: {
        Row: {
          created_at: string
          created_by: string | null
          expiry_date: string | null
          id: string
          permission: string | null
          resource: string
          resource_type: string | null
          share_date: string | null
          shared_by: string | null
          shared_with: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          permission?: string | null
          resource: string
          resource_type?: string | null
          share_date?: string | null
          shared_by?: string | null
          shared_with?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          permission?: string | null
          resource?: string
          resource_type?: string | null
          share_date?: string | null
          shared_by?: string | null
          shared_with?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          created_at: string
          current_label: string | null
          id: string
          limit_label: string | null
          metric: string | null
          service: string
          sort_order: number
          updated_at: string
          usage_pct: number
        }
        Insert: {
          created_at?: string
          current_label?: string | null
          id?: string
          limit_label?: string | null
          metric?: string | null
          service: string
          sort_order?: number
          updated_at?: string
          usage_pct?: number
        }
        Update: {
          created_at?: string
          current_label?: string | null
          id?: string
          limit_label?: string | null
          metric?: string | null
          service?: string
          sort_order?: number
          updated_at?: string
          usage_pct?: number
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
