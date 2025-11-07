"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api/auth-api"

interface ChatMessage {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

export default function OneToOneChatPage() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [user, setUser] = useState<{ userId: string; userName: string } | null>(null)

  const storeId = "22" // 고정 상점 ID

  // 로그인 유저 정보 가져오기
  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await authApi.me()
        setUser({ userId: me.userId.toString(), userName: me.userName })
      } catch (err) {
        console.error("유저 정보 가져오기 실패:", err)
      }
    }
    fetchUser()
  }, [])

  // WebSocket 연결
  useEffect(() => {
    if (!user) return

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws")}/ws/chat`)

    socket.onopen = () => console.log("WebSocket connected")

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // from이 나거나 storeId이면 메시지 추가
        if (data.from === user.userId || data.from === storeId) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              userId: data.from,
              userName: data.from === user.userId ? user.userName : "Store",
              content: data.content,
              timestamp: new Date().toISOString(),
            },
          ])
        }
      } catch (err) {
        console.error("메시지 파싱 실패:", err)
      }
    }

    socket.onclose = () => console.log("WebSocket closed")
    socket.onerror = (err) => console.error("WebSocket error:", err)

    setWs(socket)
    return () => socket.close()
  }, [user])

  // 안전하게 메시지 전송
  const sendMessage = (payload: { to: string; content: string }) => {
    if (!ws) return
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload))
    } else {
      ws.addEventListener("open", () => ws.send(JSON.stringify(payload)), { once: true })
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return

    const payload = { to: storeId, content: input }
    sendMessage(payload)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userId: user.userId,
        userName: user.userName,
        content: input,
        timestamp: new Date().toISOString(),
      },
    ])
    setInput("")
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
          유저 정보를 불러오는 중...
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">1:1 채팅 - Store {storeId}</h1>
        <div className="max-w-2xl mx-auto">
          <Card className="h-96 flex flex-col">
            <CardHeader>
              <CardTitle>채팅</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">메시지가 없습니다</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.userId === user.userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.userId === user.userId ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
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
      </main>
    </ProtectedRoute>
  )
}
