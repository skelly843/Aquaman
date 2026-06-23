export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_id: string
          created_at: string
          customer_id: string
          employee_id: string | null
          id: string
          internal_notes: string | null
          notes: string | null
          scheduled_at: string
          service_type: string
          status: string | null
          total_price: number | null
        }
        Insert: {
          appointment_id?: string
          created_at?: string
          customer_id: string
          employee_id?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          scheduled_at: string
          service_type: string
          status?: string | null
          total_price?: number | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          customer_id?: string
          employee_id?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          scheduled_at?: string
          service_type?: string
          status?: string | null
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string
          customer_id: string
          description: string | null
          id: string
          status: string | null
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      job_photos: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          photo_url: string
          uploaded_by: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          photo_url: string
          uploaded_by?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          photo_url?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_photos_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          short_description: string | null
          full_description: string | null
          price_range: string | null
          featured_image: string | null
          additional_images: string[] | null
          is_published: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          short_description?: string | null
          full_description?: string | null
          price_range?: string | null
          featured_image?: string | null
          additional_images?: string[] | null
          is_published?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          short_description?: string | null
          full_description?: string | null
          price_range?: string | null
          featured_image?: string | null
          additional_images?: string[] | null
          is_published?: boolean
          sort_order?: number
        }
      }
      gallery_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          location: string | null
          service_category: string | null
          before_image: string | null
          after_image: string | null
          additional_images: string[] | null
          description: string | null
          completion_date: string | null
          is_featured: boolean
          is_published: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          location?: string | null
          service_category?: string | null
          before_image?: string | null
          after_image?: string | null
          additional_images?: string[] | null
          description?: string | null
          completion_date?: string | null
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          location?: string | null
          service_category?: string | null
          before_image?: string | null
          after_image?: string | null
          additional_images?: string[] | null
          description?: string | null
          completion_date?: string | null
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
        }
      }
      site_content: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          content: Json
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          content?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          content?: Json
        }
      }
    }
    Views: {
      [_ in any]: never
    }
    Functions: {
      [_ in any]: never
    }
    Enums: {
      [_ in any]: never
    }
    CompositeTypes: {
      [_ in any]: never
    }
  }
}
