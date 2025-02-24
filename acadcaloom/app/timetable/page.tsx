// app/timetable/page.tsx
'use client'

import { useState, useEffect } from 'react'
import TimetableGenerator from "@/components/TimetableGenerator"
import AuthWrapper from "@/components/AuthWrapper"
import { supabase } from '@/utils/supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

export default function TimetablePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
    <div className="p-8 rounded-lg backdrop-blur-sm bg-white/30">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  </div>
  }

  return (
    <AuthWrapper>
      <TimetableGenerator session={session} />
    </AuthWrapper>
  )
}