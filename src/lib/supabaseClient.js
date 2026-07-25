import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const staffEmailDomain = import.meta.env.VITE_STAFF_EMAIL_DOMAIN

export function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@${staffEmailDomain}`
}
