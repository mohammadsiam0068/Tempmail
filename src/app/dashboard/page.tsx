import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // সার্ভার ইউজারের কুকি পাচ্ছে কি না তা চেক করা হচ্ছে
  const { data: { user }, error } = await supabase.auth.getUser()

  // যদি কোনো কারণে ইউজার না থাকে (সার্ভার কুকি রিড করতে না পারলে)
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <h1 className="text-3xl text-red-600 font-bold mb-4">
          ❌ সার্ভার কুকি পাচ্ছে না!
        </h1>
        <p className="text-lg text-red-800 mb-2">
          (No User found on Server)
        </p>
        <p className="text-gray-600 max-w-md mb-6">
          ব্রাউজার থেকে লগিন সফল হয়েছে, কিন্তু Next.js সার্ভার আপনার কুকি পড়তে পারছে না। 
        </p>
        {error && (
          <div className="bg-white p-4 rounded border border-red-200 mb-6 w-full max-w-md">
            <p className="text-sm text-red-600 font-mono text-left">Error: {error.message}</p>
          </div>
        )}
        <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          লগিন পেজে ফিরে যান
        </a>
      </div>
    )
  }

  // যদি ইউজার থাকে (লগিন সফল এবং সার্ভার কুকি পেয়েছে)
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
          <span className="font-semibold text-blue-600">{user.email}</span>
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Your inbox will appear here...</p>
        </div>
      </div>
    </div>
  )
}
