"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    // 클라이언트에서만 localStorage 체크
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/services")
    }
  }, [isLoggedIn, router])

  // hydrate 전에는 아무것도 렌더링하지 않음
  if (isLoggedIn === null) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">예약 시스템</h1>
        <p className="text-xl text-gray-600 mb-8">서비스를 예약하고 관리하세요</p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              로그인
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              회원가입
            </Button>
          </Link>
        </div>

        {isLoggedIn && (
          <div className="mt-8">
            <Link href="/services">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                서비스 보기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
