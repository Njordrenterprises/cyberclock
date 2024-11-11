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
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          role?: 'admin' | 'user'
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          rate?: number
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          budget: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          budget: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          budget?: number
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          member_id: string
          project_id: string
          start_time: number
          end_time: number | null
          duration: number | null
          synced: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          member_id: string
          project_id: string
          start_time: number
          end_time?: number | null
          duration?: number | null
          synced?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          end_time?: number | null
          duration?: number | null
          synced?: boolean
          updated_at?: string
        }
      }
    }
  }
}
