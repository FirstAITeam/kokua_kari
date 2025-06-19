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
      concrete_products: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          in_stock: boolean | null
          product_code: string | null
          product_name: string
          stock_item_id: number | null
          unit_count: number | null
          unit_label: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          in_stock?: boolean | null
          product_code?: string | null
          product_name: string
          stock_item_id?: number | null
          unit_count?: number | null
          unit_label?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          in_stock?: boolean | null
          product_code?: string | null
          product_name?: string
          stock_item_id?: number | null
          unit_count?: number | null
          unit_label?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concrete_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "concrete_products_stock_item_id_fkey"
            columns: ["stock_item_id"]
            isOneToOne: false
            referencedRelation: "recommended_stock_items"
            referencedColumns: ["recommended_stock_item_id"]
          },
        ]
      }
      corporate_types: {
        Row: {
          corporate_type_id: number
          corporate_type_name: string
          description: string | null
        }
        Insert: {
          corporate_type_id?: number
          corporate_type_name: string
          description?: string | null
        }
        Update: {
          corporate_type_id?: number
          corporate_type_name?: string
          description?: string | null
        }
        Relationships: []
      }
      disaster_types: {
        Row: {
          description: string | null
          disaster_type_id: number
          disaster_type_name: string
        }
        Insert: {
          description?: string | null
          disaster_type_id?: number
          disaster_type_name: string
        }
        Update: {
          description?: string | null
          disaster_type_id?: number
          disaster_type_name?: string
        }
        Relationships: []
      }
      item_corporate_types: {
        Row: {
          corporate_type_id: number
          id: number
          recommended_stock_item_id: number
        }
        Insert: {
          corporate_type_id: number
          id?: number
          recommended_stock_item_id: number
        }
        Update: {
          corporate_type_id?: number
          id?: number
          recommended_stock_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_corporate_types_corporate_type_id_fkey"
            columns: ["corporate_type_id"]
            isOneToOne: false
            referencedRelation: "corporate_types"
            referencedColumns: ["corporate_type_id"]
          },
          {
            foreignKeyName: "item_corporate_types_recommended_stock_item_id_fkey"
            columns: ["recommended_stock_item_id"]
            isOneToOne: false
            referencedRelation: "recommended_stock_items"
            referencedColumns: ["recommended_stock_item_id"]
          },
        ]
      }
      item_disaster_types: {
        Row: {
          disaster_type_id: number
          id: number
          recommended_stock_item_id: number
        }
        Insert: {
          disaster_type_id: number
          id?: number
          recommended_stock_item_id: number
        }
        Update: {
          disaster_type_id?: number
          id?: number
          recommended_stock_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_disaster_types_disaster_type_id_fkey"
            columns: ["disaster_type_id"]
            isOneToOne: false
            referencedRelation: "disaster_types"
            referencedColumns: ["disaster_type_id"]
          },
          {
            foreignKeyName: "item_disaster_types_recommended_stock_item_id_fkey"
            columns: ["recommended_stock_item_id"]
            isOneToOne: false
            referencedRelation: "recommended_stock_items"
            referencedColumns: ["recommended_stock_item_id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: number
          category_name: string
          description: string | null
        }
        Insert: {
          category_id?: number
          category_name: string
          description?: string | null
        }
        Update: {
          category_id?: number
          category_name?: string
          description?: string | null
        }
        Relationships: []
      }
      recommended_stock_items: {
        Row: {
          basis: string | null
          category_id: number | null
          cover_count: string | null
          item_name: string
          per_10_person_qty: number | null
          per_person_qty: number | null
          phase: string
          quality_level: string | null
          recommended_stock_item_id: number
          reference_price: number | null
          remarks: string | null
          representative_product_id: number | null
          substitute_group_id: number | null
          unit: string | null
        }
        Insert: {
          basis?: string | null
          category_id?: number | null
          cover_count?: string | null
          item_name: string
          per_10_person_qty?: number | null
          per_person_qty?: number | null
          phase: string
          quality_level?: string | null
          recommended_stock_item_id?: number
          reference_price?: number | null
          remarks?: string | null
          representative_product_id?: number | null
          substitute_group_id?: number | null
          unit?: string | null
        }
        Update: {
          basis?: string | null
          category_id?: number | null
          cover_count?: string | null
          item_name?: string
          per_10_person_qty?: number | null
          per_person_qty?: number | null
          phase?: string
          quality_level?: string | null
          recommended_stock_item_id?: number
          reference_price?: number | null
          remarks?: string | null
          representative_product_id?: number | null
          substitute_group_id?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommended_stock_items_new_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "recommended_stock_items_new_substitute_group_id_fkey"
            columns: ["substitute_group_id"]
            isOneToOne: false
            referencedRelation: "substitute_groups"
            referencedColumns: ["substitute_group_id"]
          },
          {
            foreignKeyName: "recommended_stock_items_representative_product_id_fkey"
            columns: ["representative_product_id"]
            isOneToOne: false
            referencedRelation: "concrete_products"
            referencedColumns: ["id"]
          },
        ]
      }
      substitute_groups: {
        Row: {
          description: string | null
          group_name: string
          substitute_group_id: number
        }
        Insert: {
          description?: string | null
          group_name: string
          substitute_group_id?: number
        }
        Update: {
          description?: string | null
          group_name?: string
          substitute_group_id?: number
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
    Enums: {},
  },
} as const
