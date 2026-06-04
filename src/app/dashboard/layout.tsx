'use client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between">
          <h1 className="text-2xl font-bold">temporaries.email</h1>
          <a href="/auth/login" className="text-red-600">logout</a>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}