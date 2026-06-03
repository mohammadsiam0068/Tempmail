import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-mono font-medium tracking-tight text-lg">temporaries<span className="text-accent">.</span>email</span>
        <div className="flex items-center gap-4">
          <Link href="/docs" className="font-mono text-sm text-muted hover:text-ink transition-colors">API</Link>
          <Link href="/auth/login" className="font-mono text-sm text-muted hover:text-ink transition-colors">Login</Link>
          <Link href="/auth/signup" className="btn-primary">Get started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 border border-border bg-white px-3 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot"></span>
          <span className="font-mono text-xs text-muted">Permanent disposable addresses</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-sans font-bold leading-none tracking-tight mb-6">
          Email that<br />
          <span className="text-accent">disappears.</span><br />
          Accounts that don't.
        </h1>

        <p className="text-muted text-lg max-w-xl mb-10 leading-relaxed">
          Get a permanent email address tied to your account. Use it anywhere. 
          Access it forever. Expose it to nothing that matters.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-3">Create free account →</Link>
          <Link href="/docs" className="btn-outline text-base px-8 py-3">View API docs</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-px border-t border-border">
        {[
          { title: 'Permanent Address', desc: 'Your address stays yours. Sign up once, keep it forever. No random resets.', icon: '◈' },
          { title: 'API Access', desc: 'Fetch your inbox programmatically. Build automations. Integrate anywhere.', icon: '⬡' },
          { title: 'Zero noise', desc: 'Sign up for anything without polluting your real inbox. Isolate every service.', icon: '○' },
        ].map((f) => (
          <div key={f.title} className="card p-6 animate-fade-in">
            <span className="text-2xl text-accent font-mono block mb-3">{f.icon}</span>
            <h3 className="font-mono font-medium mb-2">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* API Preview */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-border">
        <h2 className="font-mono text-2xl font-medium mb-2">Developer-first</h2>
        <p className="text-muted text-sm mb-8">Simple REST API. One key. Full access to your inbox.</p>
        <div className="bg-ink text-paper p-6 font-mono text-sm overflow-x-auto">
          <p className="text-muted mb-2"># Fetch your inbox</p>
          <p><span className="text-accent">GET</span> https://temporaries.email/api/inbox</p>
          <p className="text-muted mt-1">Authorization: Bearer te_xxxxxxxxxxxx</p>
          <br />
          <p className="text-muted mb-2"># Get a specific message</p>
          <p><span className="text-accent">GET</span> https://temporaries.email/api/messages/:id</p>
          <p className="text-muted mt-1">Authorization: Bearer te_xxxxxxxxxxxx</p>
        </div>
        <Link href="/docs" className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-ink transition-colors mt-4">
          Full API reference →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 flex items-center justify-between">
        <span className="font-mono text-sm text-muted">temporaries.email</span>
        <div className="flex gap-6">
          <Link href="/docs" className="font-mono text-xs text-muted hover:text-ink transition-colors">API Docs</Link>
          <Link href="/auth/signup" className="font-mono text-xs text-muted hover:text-ink transition-colors">Sign up</Link>
        </div>
      </footer>
    </main>
  )
}
