'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateApiKey } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  const fetchKeys = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, created_at, last_used_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setKeys(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchKeys() }, [fetchKeys])

  async function createKey() {
    if (!newKeyName.trim()) return
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fullKey = generateApiKey()
    const prefix = fullKey.substring(0, 10) + '...'

    const { error } = await supabase.from('api_keys').insert({
      user_id: user.id,
      name: newKeyName.trim(),
      key_hash: fullKey, // In production: hash this!
      key_prefix: prefix,
    })

    if (!error) {
      setRevealedKey(fullKey)
      setNewKeyName('')
      setShowForm(false)
      fetchKeys()
    }
    setCreating(false)
  }

  async function deleteKey(id: string) {
    if (!confirm('Delete this API key? This cannot be undone.')) return
    await supabase.from('api_keys').delete().eq('id', id)
    fetchKeys()
  }

  return (
    <div className="p-8 max-w-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-xl font-medium mb-1">API Keys</h1>
          <p className="text-muted text-sm">Use these to access your inbox via the REST API.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New key'}
        </button>
      </div>

      {/* New key form */}
      {showForm && (
        <div className="card p-4 mb-6 animate-slide-up">
          <label className="font-mono text-xs text-muted block mb-1.5">KEY NAME</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              placeholder="e.g. My Script"
              className="input-field"
              onKeyDown={e => e.key === 'Enter' && createKey()}
            />
            <button onClick={createKey} disabled={creating} className="btn-primary whitespace-nowrap">
              {creating ? '...' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Revealed key warning */}
      {revealedKey && (
        <div className="border border-accent/30 bg-accent/5 p-4 mb-6 animate-slide-up">
          <p className="font-mono text-xs text-accent mb-2">⚠ Copy this key now — it won't be shown again.</p>
          <code className="font-mono text-xs text-ink break-all block bg-white border border-border p-3 mb-2">
            {revealedKey}
          </code>
          <button
            onClick={() => { navigator.clipboard.writeText(revealedKey); setRevealedKey(null) }}
            className="btn-primary text-xs"
          >
            Copy & dismiss
          </button>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <p className="font-mono text-sm text-muted">Loading...</p>
      ) : keys.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-mono text-xs text-muted">No API keys yet.</p>
        </div>
      ) : (
        <div className="space-y-px">
          {keys.map((k) => (
            <div key={k.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-medium mb-0.5">{k.name}</p>
                <p className="font-mono text-xs text-muted">{k.key_prefix}</p>
                <p className="font-mono text-xs text-muted mt-0.5">
                  Created {formatDistanceToNow(new Date(k.created_at), { addSuffix: true })}
                  {k.last_used_at && ` · Last used ${formatDistanceToNow(new Date(k.last_used_at), { addSuffix: true })}`}
                </p>
              </div>
              <button
                onClick={() => deleteKey(k.id)}
                className="font-mono text-xs text-muted hover:text-accent transition-colors"
              >
                revoke
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Usage example */}
      <div className="mt-8 border-t border-border pt-6">
        <p className="font-mono text-xs text-muted mb-3">USAGE EXAMPLE</p>
        <div className="bg-ink text-paper p-4 font-mono text-xs overflow-x-auto">
          <p className="text-muted"># Fetch your inbox</p>
          <p>curl https://temporaries.email/api/inbox \</p>
          <p className="pl-4">-H <span className="text-accent">"Authorization: Bearer te_your_key"</span></p>
        </div>
      </div>
    </div>
  )
}
