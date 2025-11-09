"use client"

import { useEffect, useRef, useState } from "react"
import AdminHeader from "@/components/AdminHeader"
import AdminProtectedRoute from "@/components/AdminProtectedRoute"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChatRoom {
  roomId: number
  userId: number
  userName: string
  lastMessage: string | null
  unreadCount: number
  title: string
  userEmail : string
}

interface ChatMessage {
  roomId: number
  from: number
  content: string
  self: boolean
  senderType: string
}

export default function AdminChatTab() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const socketRef = useRef<WebSocket | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
  const myId = 0  // 관리자 ID, 실제 필요 시 backend에서 제공

  // 1️⃣ 채팅방 목록
  useEffect(() => {
    if (!token) return
    fetch(`http://localhost:8383/chat/store/rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRooms(data || []))
      .catch(err => console.error(err))
  }, [token])

  // 2️⃣ 선택한 방 메시지
  useEffect(() => {
    if (!selectedRoom || !token) return
    fetch(`http://localhost:8383/chat/store/rooms/${selectedRoom.roomId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessages((data || []).map((m: any) => ({
          roomId: selectedRoom.roomId,
          from: m.senderId,
          content: m.content,
          self: m.senderType === "STORE", // 관리자 메시지이면 self
          senderType: m.senderType
        })))
      })
      .catch(err => console.error(err))
  }, [selectedRoom, token])

  // 3️⃣ WebSocket
  useEffect(() => {
    if (!token) return
    const socket = new WebSocket(`ws://localhost:8383/ws/chat?token=${token}`)
    socketRef.current = socket

    socket.onopen = () => console.log("✅ WebSocket 연결 성공")
    socket.onclose = () => console.log("❌ WebSocket 연결 종료")
    socket.onerror = e => console.error("WebSocket 에러", e)

    socket.onmessage = event => {
      try {
        const msg = JSON.parse(event.data)
        if (selectedRoom && msg.roomId === selectedRoom.roomId) {
          setMessages(prev => [...prev, { ...msg, self: msg.senderType === "STORE" }])
        }
      } catch (err) {
        console.error(err)
      }
    }

    return () => socket.close()
  }, [token, selectedRoom])

  // 4️⃣ 메시지 전송
  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return
    if (!input.trim() || !selectedRoom) return

    const message = {
      to: selectedRoom.userId,
      content: input.trim(),
      roomId: selectedRoom.roomId
    }

    socketRef.current.send(JSON.stringify(message))
    setInput("") // 입력창 초기화
  }

  return (
    <AdminProtectedRoute>
      <main className="min-h-screen pt-16 p-6 bg-gray-50">
        <AdminHeader title="채팅 관리" />
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <div className="space-y-4">
              
              {rooms.length > 0 ? rooms.map(room => (
                <div
                  key={room.roomId}
                  onClick={() => setSelectedRoom(room)}
                  className={`bg-white p-4 rounded-xl shadow-md cursor-pointer border-l-4 ${
                    selectedRoom?.roomId === room.roomId ? "border-purple-500" : "border-transparent"
                  }`}
                >
                     
                  <div className="font-semibold text-gray-800">{room.title} {room.userName} </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium"> {room.userEmail} </span>
                      {room.unreadCount > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">{room.unreadCount}</span>
                      )}
                    </div>
                  <div className="text-sm text-gray-500 truncate mt-1">
                    {/* {room.lastMessage || "새 채팅"} */}
                     {/* <span className="text-sm font-medium"> {room.userEmail} </span> */}
                  
                  </div>
                  
                </div>
                
              )) : <div className="text-gray-500 text-sm">채팅방이 없습니다.</div> }
            </div>
          </div>

          <div className="col-span-8">
            <div className="flex flex-col h-[70vh] bg-white p-4 rounded-xl shadow-lg">
              {selectedRoom ? (
                <>
                  <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                        <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm ${msg.self ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                          [{msg.senderType}] {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input value={input} onChange={e => setInput(e.target.value)} placeholder="메시지를 입력하세요..." onKeyDown={e => e.key === "Enter" && sendMessage()} />
                    <Button onClick={sendMessage}>보내기</Button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center flex-1 text-gray-500">채팅방을 선택하세요.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
