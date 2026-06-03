'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

interface Props {
  user: { email?: string }
  profile: { email_address: string } | null
  children: React.ReactNode
}

export default function DashboardShell({ user, profile, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [copied, setCopied] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function copyAddress() {
    if (!profile?.email_address) return
    await navigator.clipboard.writeText(profile.email_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const navItems = [
    { href: '/dashboard', label: 'Inbox', icon: '◻' },
    { href: '/dashboard/api-keys', label: 'API Keys', icon: '⬡' },
    { href: '/docs', label: 'API Docs', icon: '◈' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-white px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-mono font-medium tracking-tight">
          temporaries<span className="text-accent">.</span>email
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-muted hidden md:block">{user.email}</span>
          <button onClick={handleLogout} className="font-mono text-xs text-muted hover:text-accent transition-colors">
            logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border bg-white flex flex-col shrink-0">
          {/* Address box */}
          <div className="border-b border-border p-4">
            <p className="font-mono text-xs text-muted mb-1.5">YOUR ADDRESS</p>
            <p className="font-mono text-xs text-ink break-all leading-relaxed mb-2">
              {profile?.email_address}
            </p>
            <button
              onClick={copyAddress}
              className="font-mono text-xs text-accent hover:text-ink transition-colors"
            >
              {copied ? '✓ copied' : 'copy address'}
            </button>
          </div>

          {/* Nav */}
          <nav className="p-3 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 font-mono text-sm transition-colors mb-0.5 ${
                  pathname === item.href
                    ? 'bg-ink text-paper'
                    : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
