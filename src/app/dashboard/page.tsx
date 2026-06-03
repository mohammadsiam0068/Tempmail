import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()

  // সার্ভার সাইড থেকে নিশ্চিত হওয়া যে ইউজার আসলেই লগিন করা আছে
  const { data: { user } } = await supabase.auth.getUser()

  // যদি কোনো কারণে ইউজার না থাকে, তবে তাকে আবার লগিন পেজে পাঠিয়ে দেবে
  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to your Dashboard!
        </h1>
        <p className="text-gray-600 mb-6">
          Logged in as: <span className="font-semibold text-blue-600">{user.email}</span>
        </p>
        
        <div className="border-2 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center">
          <p className="text-gray-400">Your temporary emails and inbox will appear here.</p>
        </div>
      </div>
    </div>
  )
}
