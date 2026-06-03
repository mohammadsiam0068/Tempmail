import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateEmailAddress } from '@/lib/utils'
import DashboardShell from '@/components/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get or create profile with assigned email
  const service = await createServiceClient()
  let { data: profile } = await service
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // First login — assign a unique email address
    let emailAddress = generateEmailAddress()
    // Ensure uniqueness
    let exists = true
    while (exists) {
      const { data } = await service.from('profiles').select('id').eq('email_address', emailAddress).single()
      if (!data) { exists = false } else { emailAddress = generateEmailAddress() }
    }
    const { data: newProfile } = await service
      .from('profiles')
      .insert({ id: user.id, email_address: emailAddress })
      .select()
      .single()
    profile = newProfile
  }

  return <DashboardShell user={user} profile={profile}>{children}</DashboardShell>
}
