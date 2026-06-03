'use server'

import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // ভুল হলে এরর মেসেজ পাঠাবে
  if (error) {
    return { error: error.message }
  }

  // সফল হলে সাকসেস মেসেজ পাঠাবে
  return { success: true }
}
