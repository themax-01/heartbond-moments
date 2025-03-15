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
      bond_data: {
        Row: {
          activity: string | null
          bond_id: string
          created_at: string | null
          id: string
          plan: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity?: string | null
          bond_id: string
          created_at?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity?: string | null
          bond_id?: string
          created_at?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bond_data_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "bonds"
            referencedColumns: ["id"]
          },
        ]
      }
      bond_members: {
        Row: {
          bond_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          bond_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          bond_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bond_members_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "bonds"
            referencedColumns: ["id"]
          },
        ]
      }
      bond_settings: {
        Row: {
          bond_id: string
          id: string
          quote: string | null
          updated_at: string | null
        }
        Insert: {
          bond_id: string
          id?: string
          quote?: string | null
          updated_at?: string | null
        }
        Update: {
          bond_id?: string
          id?: string
          quote?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bond_settings_bond_id_fkey"
            columns: ["bond_id"]
            isOneToOne: false
            referencedRelation: "bonds"
            referencedColumns: ["id"]
          },
        ]
      }
      bonds: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          reason: string | null
          start_date: string | null
          theme: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          reason?: string | null
          start_date?: string | null
          theme?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          reason?: string | null
          start_date?: string | null
          theme?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
