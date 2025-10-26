"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/auth-store"

export function Header() {
  const router = useRouter()
  const { user, clearAuth, accessToken } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={accessToken ? "/home" : "/"} className="text-2xl font-bold text-blue-600">
          예약 시스템
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">
                서비스
              </Link>
              <Link href="/reservations" className="text-gray-600 hover:text-gray-900">
                예약
              </Link>
              {/* {user.role === "ADMIN" && (
                <Link href="/reservations/admin" className="text-gray-600 hover:text-gray-900">
                  관리자
                </Link>
              )} */}
              <Link href="/chat" className="text-gray-600 hover:text-gray-900">
                채팅
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                {/* userName 표시 예시 */}
                {user.userName}님의 프로필
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
