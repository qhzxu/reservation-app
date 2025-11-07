"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: Props) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.replace("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) return null
  return <>{children}</>
}
