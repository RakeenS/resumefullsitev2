export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          file_name: string;
          file_path: string;
          file_url: string;
          file_type: string;
          parsed_data: Json | null;
          raw_text: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          file_name: string;
          file_path: string;
          file_url: string;
          file_type: string;
          parsed_data?: Json | null;
          raw_text?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          file_name?: string;
          file_path?: string;
          file_url?: string;
          file_type?: string;
          parsed_data?: Json | null;
          raw_text?: string | null;
          status?: string;
        };
      };
    };
  };
}
