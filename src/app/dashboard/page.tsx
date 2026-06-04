import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/auth/login')
  }

  const { data: emails } = await supabase
    .from('emails')
    .select('*')
    .eq('to_address', user.email)
    .order('received_at', { ascending: false })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>
      
      {!emails || emails.length === 0 ? (
        <p className="text-gray-500">No emails yet</p>
      ) : (
        <div className="space-y-2">
          {emails.map((email) => (
            <div key={email.id} className="border rounded p-4 hover:bg-gray-50">
              <p className="font-medium">{email.from_address}</p>
              <p className="text-sm text-gray-600">{email.subject}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(email.received_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}