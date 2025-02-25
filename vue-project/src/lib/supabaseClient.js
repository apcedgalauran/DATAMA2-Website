import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xbyrvfzaeiwpvwdhuife.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhieXJ2ZnphZWl3cHZ3ZGh1aWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjQ4MjQsImV4cCI6MjA1NjA0MDgyNH0.7gdyUwAyXQNLUuZSjNlctVnTzU0zw0gF2OMeQGrl-j8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
