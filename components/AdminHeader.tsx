"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminHeader({ title = "관리자" }: { title?: string }) {
  const router = useRouter()

  const handleLogout = () => {
    if (confirm("로그아웃하시겠습니까?")) {
      localStorage.removeItem("adminToken")
      router.push("/admin/login")
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <nav className="flex items-center gap-6 text-base">
          <Link href="/admin" className="hover:text-blue-600 transition-colors">홈</Link>
          <Link href="/admin/categories" className="hover:text-blue-600 transition-colors">카테고리</Link>
          <Link href="/admin/products" className="hover:text-blue-600 transition-colors">상품</Link>
          <Link href="/admin/reservations" className="hover:text-blue-600 transition-colors">예약</Link>
          <Link href="/admin/chat" className="hover:text-blue-600 transition-colors">채팅</Link>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  )
}
