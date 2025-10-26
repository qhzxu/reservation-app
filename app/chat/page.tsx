"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSocket } from "@/lib/hooks/use-socket"
import { useAuthStore } from "@/lib/stores/auth-store"

interface ChatMessage {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

function ChatRoom() {
  const { subscribe, publish } = useSocket()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [roomId] = useState("general")

  useEffect(() => {
    const subscription = subscribe(`/topic/rooms/${roomId}`, (message) => {
      try {
        const data = JSON.parse(message.body)
        setMessages((prev) => [...prev, data])
      } catch (err) {
        console.error("메시지 파싱 실패:", err)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [roomId, subscribe])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.userId,
      userName: user.userName,
      content: input,
      timestamp: new Date().toISOString(),
    }

    publish(`/app/chat/${roomId}`, message)
    setInput("")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="h-96 flex flex-col">
        <CardHeader>
          <CardTitle>채팅방 - {roomId}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">메시지가 없습니다</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.userId === user?.userId ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.userId === user?.userId ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.userName}</p>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>

        <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            전송
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">채팅</h1>
        <ChatRoom />
      </main>
    </ProtectedRoute>
  )
}
