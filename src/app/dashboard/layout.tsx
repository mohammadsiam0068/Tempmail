'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function generateEmailAddress() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return `${result}@temporaries.email`
}

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)

        // Get profile
        let { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // If profile doesn't exist, create one
        if (!profileData) {
          const emailAddress = generateEmailAddress()
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email_address: emailAddress,
              }
            ])
            .select()
            .single()

          if (insertError) {
            console.error('Error creating profile:', insertError)
          } else {
            profileData = newProfile
          }
        }

        if (profileData) {
          setProfile(profileData)
        }

        setLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">temporaries.email</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 font-medium"
            >
              logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">YOUR ADDRESS</p>
                <p className="text-lg font-mono font-bold text-gray-900 mt-2 break-all">
                  {profile?.email_address || 'Loading...'}
                </p>
                <button 
                  onClick={() => {
                    if (profile?.email_address) {
                      navigator.clipboard.writeText(profile.email_address)
                    }
                  }}
                  className="text-orange-600 text-sm mt-3 hover:text-orange-700 font-medium"
                >
                  📋 copy address
                </button>
              </div>

              <nav className="space-y-1 border-t pt-4">
                <div className="bg-black text-white px-4 py-3 rounded cursor-pointer font-medium">
                  📥 Inbox
                </div>
                <div className="text-gray-700 px-4 py-3 rounded cursor-pointer hover:bg-gray-100 font-medium">
                  🔑 API Keys
                </div>
                <div className="text-gray-700 px-4 py-3 rounded cursor-pointer hover:bg-gray-100 font-medium">
                  📖 API Docs
                </div>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}