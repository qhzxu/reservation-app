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
   <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <Link href={accessToken ? "/" : "/"} className="text-4xl font-extrabold text-sky-600 tracking-tight">
     Clinic
    </Link>

    <nav className="flex items-center gap-8">
      {user ? (
        <>
          <Link href="/services" className="text-gray-600 hover:text-sky-600 transition">
            서비스
          </Link>
          <Link href="/reservations" className="text-gray-600 hover:text-sky-600 transition">
            예약
          </Link>
          <Link href="/chat" className="text-gray-600 hover:text-sky-600 transition">
            채팅
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-sky-600 transition">
            {user.userName}님의 프로필
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-sky-500 text-sky-500 hover:bg-sky-50"
          >
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline" size="sm" className="border-sky-500 text-sky-500 hover:bg-sky-50">
              로그인
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
              회원가입
            </Button>
          </Link>
        </>
      )}
    </nav>
  </div>
</header>

  )
}
