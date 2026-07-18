import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://epyhxkftcjucfrqrfpj.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweWh4a2Z4dGNqdWNmcnFyZnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODEzMzMsImV4cCI6MjA5OTk1NzMzM30.GtfrnGcxUnlb2Th2mWpNZIIZ_fzOpcstM8OZIGCYkWw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
