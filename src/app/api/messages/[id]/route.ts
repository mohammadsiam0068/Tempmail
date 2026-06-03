import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  // Get user's email address
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_address')
    .eq('id', keyRow.user_id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Fetch the specific email (ensure it belongs to this user)
  const { data: email } = await supabase
    .from('emails')
    .select('*')
    .eq('id', params.id)
    .eq('to_address', profile.email_address)
    .single()

  if (!email) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  return NextResponse.json(email)
}
