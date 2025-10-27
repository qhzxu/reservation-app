"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"

type Room = { id: string; title: string; lastMessage?: string }

export default function ChatsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null

  useEffect(()=>{
    const fetchRooms = async ()=>{
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/admin/chats`, { headers: { Authorization: token ? `Bearer ${token}` : "" } })
        const data = await res.json()
        setRooms(data || [])
      } catch (e) { console.error(e) }
    }
    fetchRooms()
  }, [])

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="채팅 관리" />
        <div className="max-w-xl mx-auto mt-8 space-y-4">
          {rooms.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center border-2 border-dashed">
              진행 중인 채팅방이 없습니다.
            </div>
          )}
          {rooms.map(r=> (
            <Link key={r.id} href={`/admin/chats/${r.id}`}>
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500 cursor-pointer">
                <div className="text-lg font-semibold text-gray-800">{r.title}</div>
                <div className="text-sm text-gray-500 truncate mt-1">
                  {r.lastMessage ? `마지막 메시지: ${r.lastMessage}` : "새 채팅"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AdminProtectedRoute>
  )
}