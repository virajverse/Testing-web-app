import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Category {
  id: number;
  name_en: string;
  name_hi: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name_en: string;
  name_hi: string;
  price: number;
  delivery_time: number;
  short_desc_en?: string;
  short_desc_hi?: string;
  full_desc_en?: string;
  full_desc_hi?: string;
  features_en?: string;
  features_hi?: string;
  image_url?: string;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  client_name: string;
  whatsapp: string;
  service_id: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
