export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  status: string;
  date_applied: string;
  salary?: string;
  notes?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
