'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // @ts-ignore
        setAll(cookiesToSet) {
          try {
            // @ts-ignore
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
            })
          } catch (error) {
            // Server component এর জন্য এরর ইগনোর করবে
          }
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // সফল হলে সাকসেস মেসেজ রিটার্ন করবে, রিডাইরেক্ট ক্লায়েন্ট সাইড করবে
  return { success: true }
}
