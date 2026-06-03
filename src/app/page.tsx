import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Temporaries Email</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Create temporary disposable email inboxes instantly to protect your privacy.
      </p>
      <div className="space-x-4">
        <Link href="/auth/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition">
          Go to Login
        </Link>
        <Link href="/dashboard" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition">
          Dashboard
        </Link>
      </div>
    </div>
  )
}
