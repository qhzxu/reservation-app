"use client"

import Link from "next/link"

export default function MobileHeader() {
  return (
    <header className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
      <nav className="max-w-md mx-auto flex justify-between items-center px-6 py-2">
        <Link href="/" className="text-sm">홈</Link>
        <Link href="/services" className="text-sm">서비스</Link>
        <Link href="/reservations" className="text-sm">예약</Link>
        <Link href="/chat" className="text-sm">채팅</Link>
        <Link href="/profile" className="text-sm">내정보</Link>
              <a href="/admin" className="text-sm">관리자</a>\n      </nav>
    </header>
  )
}
