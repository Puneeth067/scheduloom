'use client'

import { useState } from 'react'
import TimetableGenerator from "@/components/TimetableGenerator"
import AuthWrapper from "@/components/AuthWrapper"
import HomePage from "@/components/HomePage"

export default function Page() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return (
      <AuthWrapper>
        <TimetableGenerator />
      </AuthWrapper>
    )
  }

  return <HomePage onAuth={() => setShowAuth(true)} />
}