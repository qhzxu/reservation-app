"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { log } from "console"

interface Props {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: Props) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  function isTokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log("Checking token expiration" + payload)
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("adminToken")
      router.replace("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) return <div className="flex justify-center items-center h-screen">로딩중...</div>
  return <>{children}</>
}
