"use client"

import Link from "next/link"

export default function AdminHeader({ title = "관리자" } : { title?: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <nav className="flex gap-6 text-base">
          <Link href="/admin/home" className="hover:text-blue-600 transition-colors">홈</Link>
          <Link href="/admin/categories" className="hover:text-blue-600 transition-colors">카테고리</Link>
          <Link href="/admin/products" className="hover:text-blue-600 transition-colors">상품</Link>
          <Link href="/admin/reservations" className="hover:text-blue-600 transition-colors">예약</Link>
          <Link href="/admin/chats" className="hover:text-blue-600 transition-colors">채팅</Link>
        </nav>
      </div>
    </header>
  )
}
