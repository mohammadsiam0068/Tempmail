'use client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">temporaries.email</h1>
          <a
            href="/auth/login"
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">YOUR ADDRESS</p>
                <p className="text-lg font-mono font-bold text-gray-900 mt-2">
                  Loading...
                </p>
                <button className="text-orange-600 text-sm mt-2 hover:text-orange-700">
                  copy address
                </button>
              </div>
              
              <nav className="space-y-2">
                <div className="bg-black text-white px-4 py-2 rounded cursor-pointer">
                  📥 Inbox
                </div>
                <div className="text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-100">
                  🔑 API Keys
                </div>
                <div className="text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-100">
                  📖 API Docs
                </div>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
