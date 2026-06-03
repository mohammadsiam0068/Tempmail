import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // টেস্ট করার জন্য আপাতত রিডাইরেক্ট বন্ধ রাখলাম
  /*
  if (!user) {
    redirect('/auth/login')
  }
  */

  return (
    <div className="dashboard-layout">
      {/* নেভিগেশন বার বা সাইডবার থাকলে এখানে থাকবে */}
      {children}
    </div>
  )
}
