'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardShell({
  user,
  profile,
  children,
}: {
  user?: any
  profile?: any
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [currentProfile, setCurrentProfile] = useState(profile)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }
        
        setCurrentUser(user)
        
        // Get profile if not passed
        if (!currentProfile) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileData) {
            setCurrentProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      }
    }
    
    if (!user) {
      checkAuth()
    }
  }, [user, currentProfile, router])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">temporaries.email</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{currentUser.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">YOUR ADDRESS</p>
                <p className="text-lg font-mono font-bold text-gray-900 mt-2">
                  {currentProfile?.email_address || 'Loading...'}
                </p>
                <button className="text-orange-600 text-sm mt-2 hover:text-orange-700">
                  copy address
                </button>
              </div>
              
              <nav className="space-y-2">
                <div className="bg-black text-white px-4 py-2 rounded cursor-pointer">
                  📥 Inbox
                </div>
                <div className="text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-100">
                  🔑 API Keys
                </div>
                <div className="text-gray-700 px-4 py-2 rounded cursor-pointer hover:bg-gray-100">
                  📖 API Docs
                </div>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}