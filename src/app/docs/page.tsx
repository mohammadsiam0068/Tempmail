import Link from 'next/link'

const endpoints = [
  {
    method: 'GET',
    path: '/api/inbox',
    desc: 'Fetch all messages in your inbox.',
    params: [
      { name: 'limit', type: 'integer', desc: 'Max results to return (default: 20, max: 100)' },
      { name: 'offset', type: 'integer', desc: 'Pagination offset (default: 0)' },
    ],
    response: `{
  "address": "swiftfog1234@temporaries.email",
  "total": 5,
  "limit": 20,
  "offset": 0,
  "messages": [
    {
      "id": "uuid",
      "from_address": "sender@example.com",
      "subject": "Hello!",
      "received_at": "2024-01-15T10:30:00Z"
    }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/messages/:id',
    desc: 'Get the full content of a specific message.',
    params: [],
    response: `{
  "id": "uuid",
  "to_address": "swiftfog1234@temporaries.email",
  "from_address": "sender@example.com",
  "subject": "Hello!",
  "body": "Plain text body...",
  "html_body": "<html>...</html>",
  "received_at": "2024-01-15T10:30:00Z"
}`,
  },
]

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono font-medium tracking-tight">
          temporaries<span className="text-accent">.</span>email
        </Link>
        <Link href="/dashboard" className="font-mono text-sm text-muted hover:text-ink transition-colors">
          Dashboard →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="font-mono text-3xl font-medium mb-3">API Reference</h1>
          <p className="text-muted leading-relaxed">
            Use the REST API to access your inbox programmatically. 
            Generate an API key from your <Link href="/dashboard/api-keys" className="text-accent hover:text-ink transition-colors">dashboard</Link>.
          </p>
        </div>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="font-mono text-lg font-medium mb-3 pb-2 border-b border-border">Authentication</h2>
          <p className="text-sm text-muted mb-4">
            Pass your API key in the <code className="font-mono text-xs bg-surface px-1.5 py-0.5 border border-border">Authorization</code> header with every request.
          </p>
          <div className="bg-ink text-paper p-4 font-mono text-sm">
            <span className="text-muted">Authorization: </span>Bearer te_your_api_key_here
          </div>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="font-mono text-lg font-medium mb-3 pb-2 border-b border-border">Base URL</h2>
          <div className="bg-ink text-paper p-4 font-mono text-sm">
            https://temporaries.email
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="font-mono text-lg font-medium mb-6 pb-2 border-b border-border">Endpoints</h2>
          <div className="space-y-10">
            {endpoints.map((ep) => (
              <div key={ep.path} className="animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-accent text-paper px-2 py-1">{ep.method}</span>
                  <code className="font-mono text-sm text-ink">{ep.path}</code>
                </div>
                <p className="text-sm text-muted mb-4">{ep.desc}</p>

                {ep.params.length > 0 && (
                  <div className="mb-4">
                    <p className="font-mono text-xs text-muted mb-2">QUERY PARAMETERS</p>
                    <div className="card divide-y divide-border">
                      {ep.params.map((p) => (
                        <div key={p.name} className="px-4 py-3 flex items-start gap-4">
                          <code className="font-mono text-xs text-ink w-24 shrink-0">{p.name}</code>
                          <span className="font-mono text-xs text-muted w-16 shrink-0">{p.type}</span>
                          <span className="text-xs text-muted">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-mono text-xs text-muted mb-2">RESPONSE</p>
                  <pre className="bg-ink text-paper p-4 font-mono text-xs overflow-x-auto leading-relaxed">
                    {ep.response}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rate limits */}
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="font-mono text-lg font-medium mb-3">Rate Limits</h2>
          <p className="text-sm text-muted">
            Free tier: 60 requests per minute per API key. 
            Exceeding this returns a <code className="font-mono text-xs bg-surface px-1.5 py-0.5 border border-border">429 Too Many Requests</code> response.
          </p>
        </section>
      </div>
    </main>
  )
}
