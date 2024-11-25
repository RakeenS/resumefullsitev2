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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json
          created_at: string
          updated_at: string
          pdf_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: Json
          created_at?: string
          updated_at?: string
          pdf_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json
          created_at?: string
          updated_at?: string
          pdf_url?: string | null
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          status: 'applied' | 'phone_screen' | 'technical' | 'final' | 'offer'
          resume_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          status: 'applied' | 'phone_screen' | 'technical' | 'final' | 'offer'
          resume_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          status?: 'applied' | 'phone_screen' | 'technical' | 'final' | 'offer'
          resume_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
