'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔐 Login attempt:', { email })

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      console.log('✅ Supabase client created')

      // ১. লগিন রিকোয়েস্ট পাঠানো হচ্ছে
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📡 Auth response:', { data, error: authError })

      if (authError) {
        console.error('❌ Auth error:', authError)
        setError(authError.message || 'Login failed')
        setLoading(false)
        return
      }

      if (!data?.user) {
        console.error('❌ No user data returned')
        setError('Login failed: No user data')
        setLoading(false)
        return
      }

      // ২. সেশনটি ব্রাউজারের মেমোরি ও কুকিতে সেট হতে বাধ্য করা হচ্ছে
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.error('❌ Session not established yet')
        setError('Session creation failed. Please try again.')
        setLoading(false)
        return
      }

      console.log('✅ Session confirmed, refreshing and redirecting...')
      
      // ৩. রাউটার রিফ্রেশ করে ১ সেকেন্ড অপেক্ষা করা হচ্ছে যাতে Middleware কুকিটি পায়
      router.refresh()
      
      setTimeout(() => {
        // window.location.replace ব্যবহার করলে ব্রাউজার জোরপূর্বক সার্ভার রিফ্রেশসহ ড্যাশবোর্ডে যাবে
        // এতে মিডলওয়্যার কোনোভাবেই পুরানো ক্যাশ বা কুকি দেখাবে না
        window.location.replace('/dashboard')
      }, 1000)

    } catch (err) {
      console.error('❌ Exception during login:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
