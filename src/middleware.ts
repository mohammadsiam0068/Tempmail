import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome to Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Logged in successfully as: <br/>
          <span className="font-semibold text-blue-600">{user?.email}</span>
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Your temporary emails and inbox will appear here.</p>
        </div>
      </div>
    </div>
  )
}
