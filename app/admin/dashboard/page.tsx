"use client"

import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import Link from "next/link"
import { FaListAlt, FaBoxOpen, FaCalendarCheck, FaComments } from "react-icons/fa"

export default function AdminDashboard() {
  const cards = [
    { title: "카테고리 관리", href: "/admin/categories", icon: <FaListAlt size={24} />, color: "bg-blue-100 text-blue-800" },
    { title: "상품 관리", href: "/admin/products", icon: <FaBoxOpen size={24} />, color: "bg-green-100 text-green-800" },
    { title: "예약 관리", href: "/admin/reservations", icon: <FaCalendarCheck size={24} />, color: "bg-yellow-100 text-yellow-800" },
    { title: "채팅 관리", href: "/admin/chats", icon: <FaComments size={24} />, color: "bg-purple-100 text-purple-800" },
  ]

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="관리자 대시보드" />

        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link key={card.href} href={card.href}>
              <div className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer ${card.color}`}>
                {card.icon}
                <span className="font-semibold text-lg">{card.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
