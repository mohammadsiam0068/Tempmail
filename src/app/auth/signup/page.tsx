'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-sm animate-slide-up">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-medium mb-1">Create account</h1>
        <p className="text-muted text-sm">You'll get a permanent @temporaries.email address.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="font-mono text-xs text-muted block mb-1.5">YOUR EMAIL (for login)</label>
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
            placeholder="min. 8 characters"
            minLength={8}
            required
            className="input-field"
          />
        </div>

        {error && (
          <p className="font-mono text-xs text-accent border border-accent/20 bg-accent/5 px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? 'Creating...' : 'Create account →'}
        </button>
      </form>

      <p className="font-mono text-xs text-muted mt-6 text-center">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-ink hover:text-accent transition-colors">Log in</Link>
      </p>
    </div>
  )
}
