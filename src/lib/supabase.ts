import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using REAL Supabase client to connect to your database');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);