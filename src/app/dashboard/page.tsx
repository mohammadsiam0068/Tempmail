'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Email {
  id: string
  from_address: string
  subject: string
  body: string
  received_at: string
  to_address: string
}

export default function DashboardPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const supabase = createClient()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setError('Not authenticated')
          return
        }

        // Get profile to find email address
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_address')
          .eq('id', user.id)
          .single()

        if (!profile) {
          setError('Profile not found')
          return
        }

        // Fetch emails
        const { data, error: fetchError } = await supabase
          .from('emails')
          .select('*')
          .eq('to_address', profile.email_address)
          .order('received_at', { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
          return
        }

        setEmails(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading emails')
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading emails...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
        <p className="text-sm text-gray-600 mt-1">{emails.length} email(s)</p>
      </div>

      {emails.length === 0 ? (
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No emails yet</p>
            <p className="text-gray-400 text-xs mt-2">Emails you receive will appear here</p>
          </div>
        </div>
      ) : (
        <div className="divide-y">
          {emails.map((email) => (
            <div
              key={email.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {email.from_address}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                    {email.subject || '(no subject)'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(email.received_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}