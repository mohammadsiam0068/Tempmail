'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient()

  // সার্ভার সাইড থেকে লগিন রিকোয়েস্ট
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // যদি ভুল পাসওয়ার্ড বা ইমেইল হয়
  if (error) {
    return { error: error.message }
  }

  // সফল হলে সার্ভার নিজেই ড্যাশবোর্ডে পাঠিয়ে দেবে (কোনো কুকি মিসিং হবে না)
  redirect('/dashboard')
}
