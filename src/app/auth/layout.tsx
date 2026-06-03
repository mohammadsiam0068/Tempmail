import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <nav className="border-b border-border px-6 py-4">
        <Link href="/" className="font-mono font-medium tracking-tight">
          temporaries<span className="text-accent">.</span>email
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  )
}
