"use client"

import { motion } from "framer-motion"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import Link from "next/link"
import { FaListAlt, FaBoxOpen, FaCalendarCheck, FaComments } from "react-icons/fa"

export default function AdminDashboard() {
  const cards = [
    {
      title: "카테고리 관리",
      href: "/admin/categories",
      icon: <FaListAlt size={26} />,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "상품 관리",
      href: "/admin/products",
      icon: <FaBoxOpen size={26} />,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "예약 관리",
      href: "/admin/reservations",
      icon: <FaCalendarCheck size={26} />,
      gradient: "from-amber-400 to-yellow-500",
    },
    {
      title: "채팅 관리",
      href: "/admin/chats",
      icon: <FaComments size={26} />,
      gradient: "from-purple-500 to-violet-600",
    },
  ]

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <AdminHeader title="관리자 대시보드" />

        <section className="max-w-7xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">관리 항목</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cards.map((card, idx) => (
              <Link key={card.href} href={card.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl shadow-md cursor-pointer bg-white hover:shadow-xl group`}
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full text-white bg-gradient-to-r ${card.gradient} shadow-inner group-hover:scale-110 transition-transform`}
                  >
                    {card.icon}
                  </div>
                  <span className="font-semibold text-lg text-gray-800 group-hover:text-gray-900">
                    {card.title}
                  </span>
                  <div
                    className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </AdminProtectedRoute>
  )
}
