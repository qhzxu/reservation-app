"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 초기화: localStorage에서 토큰 복원
    const token = localStorage.getItem("accessToken")
    if (token) {
      useAuthStore.setState({ accessToken: token })
    }
  }, [])

  return <>{children}</>
}
