import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
  }

  const apiKey = authHeader.replace('Bearer ', '').trim()
  const supabase = await createServiceClient()

  // Validate API key
  const { data: keyRow } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_hash', apiKey)
    .single()

  if (!keyRow) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  // Update last_used_at
  await supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('key_hash', apiKey)

  // Get user's email address
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_address')
    .eq('id', keyRow.user_id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Get user's temporary emails
  const { data: emails } = await supabase
    .from('emails')
    .select('*')
    .eq('to_address', profile.email_address)
    .order('received_at', { ascending: false })

  return NextResponse.json(emails || [])
}
