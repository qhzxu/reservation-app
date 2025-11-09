"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { authApi } from "@/lib/api/auth-api"

interface ChatRoom {
  roomId: number
  userId: number
  userName : string
  lastMessage: string | null
  unreadCount: number
  userEmail : string
}

interface ChatMessage {
  roomId: number
  from: number
  content: string
  self: boolean
  senderType: string
}

export default function ChatTab() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const socketRef = useRef<WebSocket | null>(null)

  const token = authApi.getToken()
  const myId = authApi.getUserId() || 0

  // 1️⃣ 채팅방 목록 불러오기
  useEffect(() => {
    if (!token) return

    fetch("http://localhost:8383/chat/user/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRooms(data)
        else setRooms([])
      })
      .catch(err => console.error(err))
  }, [token])

  // 2️⃣ 선택한 채팅방 메시지 불러오기
  useEffect(() => {
    if (!selectedRoom || !token) return

    fetch(`http://localhost:8383/chat/user/rooms/${selectedRoom.roomId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data.map((m: any) => ({
            roomId: selectedRoom.roomId,
            from: m.senderId,
            content: m.content,
            self: m.senderId === myId,
            senderType: m.senderType
          })))
        } else setMessages([])
      })
      .catch(err => console.error(err))
  }, [selectedRoom, token, myId])

  // 3️⃣ WebSocket 연결
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
        // 현재 선택한 채팅방 메시지만 추가
        if (selectedRoom && msg.roomId === selectedRoom.roomId) {
          setMessages(prev => [...prev, { ...msg, self: msg.from === myId }])
        }
      } catch (err) {
        console.error(err)
      }
    }

    return () => socket.close()
  }, [token, selectedRoom, myId])

const sendMessage = () => {
  if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return
  if (!input.trim() || !selectedRoom) return

  const message = {
    to: selectedRoom.userId,
    content: input.trim(),
    roomId: selectedRoom.roomId
  }

  socketRef.current.send(JSON.stringify(message))
  setInput("") // 입력창 초기화만
}



  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <Card className="shadow">
              <CardContent className="p-4 h-[70vh] overflow-y-auto space-y-2">
                <h3 className="font-semibold mb-2">채팅방 목록</h3>
                {rooms.length > 0 ? rooms.map(room => (
                  <div
                    key={room.roomId}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedRoom?.roomId === room.roomId ? "bg-blue-50 border-blue-300" : "hover:bg-gray-100 border-transparent"
                    }`}
                    
                  >
                    {/* {room.roomId} */}
                    {room.userName}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium"> {room.userEmail} </span>
                      {room.unreadCount > 0 && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">{room.unreadCount}</span>
                      )}
                    </div>
                    {/* <p className="text-xs text-gray-600 truncate">{room.lastMessage || "메시지 없음"}</p> */}
                  </div>
                )) : <div className="text-gray-500 text-sm">채팅방이 없습니다.</div>}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-8">
            <Card className="shadow-lg">
              <CardContent className="p-4 flex flex-col h-[70vh]">
                {selectedRoom ? (
                  <>
                    <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.self ? "justify-end" : "justify-start"}`}>
                          <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm ${msg.self ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
