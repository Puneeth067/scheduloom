// app/timetable/page.tsx
'use client'

import TimetableGenerator from "@/components/TimetableGenerator"
import AuthWrapper from "@/components/AuthWrapper"

export default function TimetablePage() {
  return (
    <AuthWrapper>
      <TimetableGenerator />
    </AuthWrapper>
  )
}