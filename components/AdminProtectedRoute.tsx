"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminProtectedRoute({ children } : { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    setLoading(false)
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center p-6">로딩 중...</div>

  return <>{children}</>
}
