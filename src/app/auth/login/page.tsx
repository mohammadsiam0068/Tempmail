'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-sm animate-slide-up">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-medium mb-1">Welcome back</h1>
        <p className="text-muted text-sm">Sign in to access your inbox.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-muted block mb-1.5">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="font-mono text-xs text-muted block mb-1.5">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="input-field"
          />
        </div>

        {error && (
          <p className="font-mono text-xs text-accent border border-accent/20 bg-accent/5 px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>
      </form>

      <p className="font-mono text-xs text-muted mt-6 text-center">
        No account yet?{' '}
        <Link href="/auth/signup" className="text-ink hover:text-accent transition-colors">Sign up free</Link>
      </p>
    </div>
  )
}
