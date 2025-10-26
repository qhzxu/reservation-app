"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "USER"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, accessToken } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)

  // 클라이언트 마운트 후 hydrated true
  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    // accessToken/user가 존재해야 페이지 접근 가능
    if (!accessToken || !user) {
      router.replace("/login")
      return
    }

    // 권한 체크
    if (requiredRole && user.role !== requiredRole) {
      router.replace("/")
      return
    }
  }, [hydrated, accessToken, user, requiredRole, router])

  if (!hydrated || !accessToken || (requiredRole && user?.role !== requiredRole)) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>
  }

  return <>{children}</>
}
