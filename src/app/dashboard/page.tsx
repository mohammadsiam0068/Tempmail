'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

interface Email {
  id: string
  from_address: string
  subject: string
  body: string
  html_body: string | null
  received_at: string
}

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selected, setSelected] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailAddress, setEmailAddress] = useState('')
  const supabase = createClient()

  const fetchEmails = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('email_address')
      .eq('id', user.id)
      .single()

    if (profile) {
      setEmailAddress(profile.email_address)
      const { data } = await supabase
        .from('emails')
        .select('*')
        .eq('to_address', profile.email_address)
        .order('received_at', { ascending: false })
        .limit(100)
      setEmails(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchEmails()
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchEmails, 15000)
    return () => clearInterval(interval)
  }, [fetchEmails])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-mono text-sm text-muted animate-pulse">Loading inbox...</span>
      </div>
    )
  }

  return (
    <div className="flex h-full" style={{ minHeight: 'calc(100vh - 53px)' }}>
      {/* Email list */}
      <div className="w-80 border-r border-border flex flex-col shrink-0">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{emails.length} messages</span>
          <button
            onClick={fetchEmails}
            className="font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            ↻ refresh
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {emails.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-mono text-xs text-muted mb-2">No messages yet</p>
              <p className="font-mono text-xs text-muted opacity-60">
                Send an email to<br />{emailAddress}
              </p>
            </div>
          ) : (
            emails.map((mail) => (
              <button
                key={mail.id}
                onClick={() => setSelected(mail)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-surface ${
                  selected?.id === mail.id ? 'bg-surface border-l-2 border-l-accent' : ''
                }`}
              >
                <p className="font-mono text-xs text-muted mb-0.5 truncate">{mail.from_address}</p>
                <p className="font-mono text-sm text-ink truncate mb-1">{mail.subject || '(no subject)'}</p>
                <p className="font-mono text-xs text-muted">
                  {formatDistanceToNow(new Date(mail.received_at), { addSuffix: true })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Email view */}
      <div className="flex-1 overflow-auto">
        {selected ? (
          <div className="p-8 max-w-2xl animate-fade-in">
            <div className="border-b border-border pb-4 mb-6">
              <h2 className="font-mono text-lg font-medium mb-3">{selected.subject || '(no subject)'}</h2>
              <div className="space-y-1">
                <p className="font-mono text-xs text-muted">
                  <span className="text-ink">From:</span> {selected.from_address}
                </p>
                <p className="font-mono text-xs text-muted">
                  <span className="text-ink">Received:</span>{' '}
                  {new Date(selected.received_at).toLocaleString()}
                </p>
              </div>
            </div>
            {selected.html_body ? (
              <iframe
                srcDoc={selected.html_body}
                className="w-full border border-border"
                style={{ height: '500px' }}
                sandbox="allow-same-origin"
              />
            ) : (
              <pre className="font-mono text-sm text-ink whitespace-pre-wrap leading-relaxed">
                {selected.body}
              </pre>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="font-mono text-4xl text-border mb-3">◻</p>
              <p className="font-mono text-sm text-muted">Select a message</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
