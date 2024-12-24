import TimetableGenerator from "@/components/TimetableGenerator"
import AuthWrapper from "@/components/AuthWrapper"

export default function Page() {
  return (
    <AuthWrapper>
      <TimetableGenerator />
    </AuthWrapper>
  )
}