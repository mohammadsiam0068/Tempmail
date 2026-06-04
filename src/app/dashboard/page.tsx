'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Email {
  id: string
  to_address: string
  from_address: string
  subject: string
  body: string
  html_body: string | null
  otp: string | null
  received_at: string
}

export default function InboxPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  
  const email_address = params.email as string
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    show: boolean
    otp?: string
    from?: string
  }>({ show: false })

  useEffect(() => {
    // Load initial emails
    loadEmails()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`emails:${email_address}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emails',
          filter: `to_address=eq.${email_address}`,
        },
        async (payload: any) => {
          const newEmail = payload.new as Email
          
          // Add to list
          setEmails(prev => [newEmail, ...prev])
          
          // Show notification
          if (newEmail.otp) {
            showNotification(newEmail.otp, newEmail.from_address)
          } else {
            showNotification(undefined, newEmail.from_address)
          }
          
          // Auto-select first email
          if (!selectedEmail) {
            setSelectedEmail(newEmail)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [email_address, selectedEmail])

  const loadEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('to_address', email_address)
        .order('received_at', { ascending: false })
        .limit(50)

      if (error) throw error
      
      setEmails(data || [])
      if (data && data.length > 0) {
        setSelectedEmail(data[0])
      }
    } catch (error) {
      console.error('Failed to load emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (otp?: string, from?: string) => {
    setNotification({
      show: true,
      otp,
      from,
    })

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification({ show: false })
    }, 5000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Real-time Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="font-semibold mb-2">🔔 নতুন ইমেইল এসেছে!</div>
            {notification.from && (
              <div className="text-sm opacity-90 mb-3">
                From: <strong>{notification.from}</strong>
              </div>
            )}
            {notification.otp ? (
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="text-xs opacity-75 mb-1">Verification Code:</div>
                <div className="text-2xl font-bold tracking-widest flex items-center justify-between">
                  <span>{notification.otp}</span>
                  <button
                    onClick={() => copyToClipboard(notification.otp!)}
                    className="ml-3 px-3 py-1 bg-white text-green-600 rounded text-sm font-medium hover:bg-opacity-90"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm">নতুন বার্তা পেয়েছেন</div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <Link href="/" className="text-blue-600 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{email_address}</h1>
        <p className="text-slate-600">Total emails: {emails.length}</p>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-3 gap-6">
        {/* Email List */}
        <div className="col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-slate-100 p-4 border-b">
            <h2 className="font-semibold text-slate-900">Inbox</h2>
            <p className="text-sm text-slate-600">{emails.length} emails</p>
          </div>

          <div className="overflow-y-auto max-h-96">
            {emails.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No emails yet
              </div>
            ) : (
              emails.map(email => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full text-left p-4 border-b hover:bg-blue-50 transition ${
                    selectedEmail?.id === email.id ? 'bg-blue-100' : ''
                  }`}
                >
                  <div className="font-medium text-sm text-slate-900 truncate">
                    {email.from_address}
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {email.subject || '(No Subject)'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(email.received_at).toLocaleTimeString('bn-BD')}
                  </div>
                  {email.otp && (
                    <div className="mt-2 inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      🔐 OTP: {email.otp}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Email Content */}
        <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              {/* Email Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <h2 className="text-xl font-bold mb-2">
                  {selectedEmail.subject || '(No Subject)'}
                </h2>
                <div className="text-sm opacity-90">
                  <div>From: <strong>{selectedEmail.from_address}</strong></div>
                  <div>To: <strong>{selectedEmail.to_address}</strong></div>
                  <div>
                    {new Date(selectedEmail.received_at).toLocaleString('bn-BD')}
                  </div>
                </div>
              </div>

              {/* OTP Highlight */}
              {selectedEmail.otp && (
                <div className="bg-orange-50 border-b-2 border-orange-200 p-4">
                  <div className="text-sm font-medium text-orange-900 mb-2">
                    ✓ Verification Code Found:
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-200">
                    <div className="text-3xl font-bold text-orange-600 tracking-widest">
                      {selectedEmail.otp}
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedEmail.otp!)}
                      className="ml-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm"
                    >
                      📋 Copy Code
                    </button>
                  </div>
                </div>
              )}

              {/* Email Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedEmail.html_body ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(selectedEmail.html_body),
                    }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-slate-700">
                    {selectedEmail.body}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-100 border-t p-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Reply
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400">
                  Forward
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              কোনো ইমেইল নির্বাচন করুন
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple HTML sanitizer
function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}